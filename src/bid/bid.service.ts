import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bid } from './entities/bid.entity';
import { Broker } from 'src/auth/entities/broker.entity';
import { Request } from 'src/request/entities/request.entity';

@Injectable()
export class BidService {
  private readonly brokerFeePercentage: number = parseFloat(process.env.BROKER_FEE_PERCENTAGE);
  private readonly brokerFeeFixed: number = parseInt(process.env.BROKER_FEE_FIXED, 10);

  constructor(
    @InjectRepository(Bid)
    private bidRepository: Repository<Bid>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
  ) {}

  // 수수료 계산 함수
  private calculateFee(amount: number): number {
    if (this.brokerFeePercentage > 0) {
      return (amount * this.brokerFeePercentage) / 100;
    } else if (this.brokerFeeFixed > 0) {
      return this.brokerFeeFixed;
    }
    return 0; // 수수료가 없을 경우
  }

  // 브로커가 견적 제출
  async createBid(brokerId: number, requestId: number, amount: number): Promise<Bid> {
    const broker = await this.brokerRepository.findOne({ where: { id: brokerId } });
    const request = await this.requestRepository.findOne({ where: { id: requestId }, relations: ['bids'] });

    if (!broker) {
      throw new NotFoundException('Broker not found');
    }

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // 동일한 브로커가 이미 견적을 제출했는지 확인
    const existingBid = request.bids.find(bid => bid.broker.id === brokerId);
    if (existingBid) {
      throw new ConflictException('You have already submitted a bid for this request');
    }

    const fee = this.calculateFee(amount);

    if (fee > broker.balance) {
      throw new BadRequestException('Insufficient balance to cover the fee');
    }

    // 브로커의 잔고에서 수수료 차
    broker.balance -= fee;
    await this.brokerRepository.save(broker);
    const bid = this.bidRepository.create({
      amount,
      broker,
      request,
    });
    return this.bidRepository.save(bid);
  }

  // 특정 요청에 대한 견적 목록 조회 (해당 요청의 클라이언트만 가능)
  async getBidsForRequest(clientId: number, requestId: number): Promise<Bid[]> {
    const request = await this.requestRepository.findOne({ where: { id: requestId }, relations: ['bids', 'client'] });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    if (request.client.id !== clientId) {
      throw new ForbiddenException('You do not have permission to view these bids');
    }

    return this.bidRepository.find({
      where: { request: { id: requestId } },
      relations: ['broker'],
      order: { createdAt: 'DESC' },
    });
  }

  // 브로커가 제출한 견적 목록 조회
  async getBidsByBroker(brokerId: number): Promise<Bid[]> {
    return this.bidRepository.find({
      where: { broker: { id: brokerId } },
      relations: ['request'],
      order: { createdAt: 'DESC' },
    });
  }

  async acceptBid(clientId: number, bidId: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({ where: { id: bidId }, relations: ['request'] });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    if (bid.request.client.id !== clientId) {
      throw new ForbiddenException('You do not have permission to accept this bid');
    }

    // 동일 요청에 대해 다른 견적들은 모두 미선택 상태로 설정
    await this.bidRepository.update({ request: { id: bid.request.id } }, { isAccepted: false });

    // 선택한 견적을 수락된 상태로 업데이트
    bid.isAccepted = true;
    return this.bidRepository.save(bid);
  }
}
