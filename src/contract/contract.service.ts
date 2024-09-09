import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
  private readonly brokerFeePercentage: number = parseFloat(
    process.env.BROKER_FEE_PERCENTAGE,
  );
  private readonly brokerFeeFixed: number = parseInt(
    process.env.BROKER_FEE_FIXED,
    10,
  );

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

  // Client 가 계약 요청하면 이 계약을 승인(Agree)한 것으로 인정 -> Contract를 agree로 변경한다.
  async requestContract(
    client: Client,
    requestContractDto: RequestContractDto,
  ): Promise<Contract> {
    const contract = this.contractRepository.create({
      client,
      request: { id: requestContractDto.requestId } as any,
      status: 'requested',
    });
    return this.contractRepository.save(contract);
  }

  async createContract(
    broker: Broker,
    createContractDto: CreateContractDto,
  ): Promise<Contract> {
    // TODO: [240908] Contract 생성시, clientId도 추가해줘야 함. -> Client가 자신의 Contracts 확인하기 위해.
    const contract = this.contractRepository.create({
      broker,
      request: { id: createContractDto.requestId } as any,
      client: { id: createContractDto.clientId } as any,
      contractDetails: createContractDto.contractDetails,
      status: 'drafted',
    });
    return this.contractRepository.save(contract);
  }

  async agreeContractAsClient(
    client: Client,
    agreeContractDto: AgreeContractDto,
  ): Promise<Contract> {
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

    // Client의 경우 계약 요청 == 계약 승인으로 본다. -> requested로 변경
    // 계약 completed는 Broker만 수행할 수 있다.
    contract.status = 'requested';

    return this.contractRepository.save(contract);
  }

  async agreeContractAsBroker(
    broker: Broker,
    agreeContractDto: AgreeContractDto,
  ): Promise<Contract> {
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

    // Client 승인이 먼저 이뤄지고 Broker가 최종 승인 == 계약 확정 프로세스 진행
    if (contract.clientAgreed) {
      contract.status = 'completed';
      contract.brokerAgreed = true;
    } else {
      throw new BadRequestException('Client approve is required.')
    }

    // 수수료 계산
    const fee = this.calculateFee(); // 고정형 수수료 계산

    if (fee > broker.balance) {
      throw new BadRequestException('Insufficient balance to cover the fee');
    }

    // 브로커의 잔고에서 수수료 차감
    broker.balance -= fee;
    await this.brokerRepository.save(broker);


    return this.contractRepository.save(contract);
  }

  async getContractsByClient(clientId: number): Promise<Contract[]> {
    return this.contractRepository.find({
      where: [{ client: { id: clientId } }],
      order: { createdAt: 'DESC' },
    });
  }

  async getContractsByBroker(brokerId: number): Promise<Contract[]> {
    return this.contractRepository.find({
      where: [{ broker: { id: brokerId } }],
      order: { createdAt: 'DESC' },
    });
  }
}
