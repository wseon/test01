import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { RequestContractDto } from './dto/request-contract.dto';
import { AgreeContractDto } from './dto/agree-contract.dto';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';

@Injectable()
export class ContractService {
  private readonly brokerFeePercentage: number = parseFloat(process.env.BROKER_FEE_PERCENTAGE);
  private readonly brokerFeeFixed: number = parseInt(process.env.BROKER_FEE_FIXED, 10);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
  ) {}

  private calculateFee(): number {
    if (this.brokerFeeFixed > 0) {
      return this.brokerFeeFixed;
    }
    return 0;
  }

  async requestContract(client: Client, requestContractDto: RequestContractDto): Promise<Contract> {
    const contract = this.contractRepository.create({
      client,
      request: { id: requestContractDto.requestId } as any,
      status: 'requested',
    });
    return this.contractRepository.save(contract);
  }

  async createContract(broker: Broker, createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepository.create({
      broker,
      request: { id: createContractDto.requestId } as any,
      contractDetails: createContractDto.contractDetails,
      status: 'drafted',
    });
    return this.contractRepository.save(contract);
  }

  async agreeContractAsClient(client: Client, agreeContractDto: AgreeContractDto): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id: agreeContractDto.contractId },
      relations: ['client'],
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.client.id !== client.id) {
      throw new BadRequestException('Unauthorized');
    }

    contract.clientAgreed = true;

    if (contract.brokerAgreed) {
      contract.status = 'completed';
    }

    return this.contractRepository.save(contract);
  }

  async agreeContractAsBroker(broker: Broker, agreeContractDto: AgreeContractDto): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id: agreeContractDto.contractId },
      relations: ['broker', 'request'],
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.broker.id !== broker.id) {
      throw new BadRequestException('Unauthorized');
    }

    // 수수료 계산
    const fee = this.calculateFee(); // 고정형 수수료 계산

    if (fee > broker.balance) {
      throw new BadRequestException('Insufficient balance to cover the fee');
    }

    // 브로커의 잔고에서 수수료 차감
    broker.balance -= fee;
    await this.brokerRepository.save(broker);

    contract.brokerAgreed = true;

    if (contract.clientAgreed) {
      contract.status = 'completed';
    }

    return this.contractRepository.save(contract);
  }

  async getContractsByClient(client: Client): Promise<Contract[]> {
    return this.contractRepository.find({ where: { client } });
  }

  async getContractsByBroker(broker: Broker): Promise<Contract[]> {
    return this.contractRepository.find({ where: { broker } });
  }
}
