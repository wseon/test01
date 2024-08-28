import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderApplication } from './entities/order-application.entity';
import { ApplyOrderDto } from './dto/apply-order.dto';
import { SelectProviderDto } from './dto/select-provider.dto';
import { Provider } from 'src/auth/entities/provider.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Broker } from 'src/auth/entities/broker.entity';
import { Contract } from 'src/contract/entities/contract.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderApplication)
    private orderApplicationRepository: Repository<OrderApplication>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  // 수수료 계산 메서드 (예시)
  private calculateFee(bidAmount: number): number {
    return bidAmount * 0.05; // 예: 제시 금액의 5%를 수수료로 계산
  }

  // 오더 생성
  async createOrder(brokerId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const broker = await this.brokerRepository.findOne({ where: { id: brokerId } });
    const contract = await this.contractRepository.findOne({ where: { id: createOrderDto.contractId } });

    if (!broker) {
      throw new NotFoundException('Broker not found');
    }

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const order = this.orderRepository.create({
      broker,
      contract,
      description: createOrderDto.description,
      status: 'open',
    });

    return this.orderRepository.save(order);
  }

  // 오더에 대한 수행업체 지원
  async applyForOrder(providerId: number, applyOrderDto: ApplyOrderDto): Promise<OrderApplication> {
    const order = await this.orderRepository.findOne({ where: { id: applyOrderDto.orderId }, relations: ['applications'] });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const provider = await this.providerRepository.findOne({ where: { id: providerId } });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const fee = this.calculateFee(applyOrderDto.bidAmount);

    if (fee > provider.balance) {
      throw new BadRequestException('Insufficient balance to cover the fee');
    }

    // 수행업체의 잔고에서 수수료 차감
    provider.balance -= fee;
    await this.providerRepository.save(provider);

    const application = this.orderApplicationRepository.create({
      order,
      provider,
      bidAmount: applyOrderDto.bidAmount,
      status: 'pending',
    });

    return this.orderApplicationRepository.save(application);
  }

  // 브로커가 지원을 선택하여 하청 계약 체결
  async selectProvider(brokerId: number, selectProviderDto: SelectProviderDto): Promise<OrderApplication> {
    const application = await this.orderApplicationRepository.findOne({ where: { id: selectProviderDto.applicationId }, relations: ['order', 'provider'] });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const order = await this.orderRepository.findOne({ where: { id: application.order.id }, relations: ['broker'] });

    if (order.broker.id !== brokerId) {
      throw new BadRequestException('Unauthorized');
    }

    application.status = 'accepted';
    order.status = 'closed';

    await this.orderRepository.save(order);

    return this.orderApplicationRepository.save(application);
  }

  // 오더 상태 업데이트
  async updateOrderStatus(orderId: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderDto.status;

    return this.orderRepository.save(order);
  }

  // 특정 브로커의 모든 오더 조회
  async getOrdersByBroker(brokerId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { broker: { id: brokerId } }, relations: ['contract', 'applications'] });
  }

  // 특정 수행업체의 모든 오더 조회
  async getOrdersByProvider(providerId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { applications: { provider: { id: providerId } } }, relations: ['contract', 'broker', 'applications'] });
  }
}
