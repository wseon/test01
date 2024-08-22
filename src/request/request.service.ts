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

}
