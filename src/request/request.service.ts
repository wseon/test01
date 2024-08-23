import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { Client } from 'src/client/entities/client.entity';
import { Broker } from 'src/broker/entities/broker.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
  ) {}

  async createRequest(clientId: number, createRequestDto: CreateRequestDto): Promise<Request> {
    const client = await this.clientRepository.findOne({ where: { id: clientId} });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    let broker: Broker = null;
    if (createRequestDto.brokerId) {
      broker = await this.brokerRepository.findOne({ where: { id: createRequestDto.brokerId } });
      if (!broker) {
        throw new NotFoundException('Broker not found');
      }
    }

    const request = this.requestRepository.create({
      ...createRequestDto,
      client,
      broker,
    });

    return this.requestRepository.save(request);
  }

  // 클라이언트의 요청서 목록 조회
  async getClientRequests(clientId: number): Promise<Request[]> {
    return this.requestRepository.find({
      where: [
        { client: { id: clientId } }  // 해당 클라이언트가 요청한 모든 요청서 (공개 및 비공개)
      ],
      relations: ['broker'],
      order: { createdAt: 'DESC' },
    });
  }

  async getBrokerRequests(brokerId: number): Promise<Request[]> {
    return this.requestRepository.find({
      where: [
        // 공개 요청서를 브로커가 수주하면 어차피 brokerId에 ㅐ해당id가 들어가기때문에
        { broker: { id: brokerId }, isPublic: true },  // 해당 브로커에게 맡겨진 공개 요청서
        { broker: { id: brokerId }, isPublic: false }  // 해당 브로커에게 맡겨진 비공개 요청서
      ],
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  // 공개 요청서 조회 (모든 클라이언트 및 브로커가 접근 가능)
  async getPublicRequests(): Promise<Request[]> {
    return this.requestRepository.find({
      where: { isPublic: true },
      relations: ['client', 'broker'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateRequest(clientId: number, requestId: number, updateData: Partial<CreateRequestDto>): Promise<Request> {
    const request = await this.requestRepository.findOne({
      where: { id: requestId, client: { id: clientId } },
    });

    if (!request) {
      throw new NotFoundException('Request not found or you do not have permission to update it');
    }

    Object.assign(request, updateData);
    return this.requestRepository.save(request);
  }

  // 요청 삭제
  async deleteRequest(clientId: number, requestId: number): Promise<void> {
    const request = await this.requestRepository.findOne({
      where: { id: requestId, client: { id: clientId } },
    });

    if (!request) {
      throw new NotFoundException('Request not found or you do not have permission to delete it');
    }

    await this.requestRepository.remove(request);
  }
}
