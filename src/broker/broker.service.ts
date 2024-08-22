import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Broker } from './entities/broker.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterBrokerDto } from './dto/register-broker.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class BrokerService {
  constructor(
    @InjectRepository(Broker)
    private brokersRepository: Repository<Broker>,
    private jwtService: JwtService,
  ) {}

  async registerBroker(registerDto: RegisterBrokerDto): Promise<Broker> {
    const { email, businessNumber } = registerDto;

    const existingBroker = await this.brokersRepository.findOne({ where: { businessNumber } });

    if (existingBroker) {
      throw new ConflictException('Business Number already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;
    const broker = this.brokersRepository.create(registerDto);

    return this.brokersRepository.save(broker);
  }

  async validateBroker(email: string, password: string): Promise<Broker | null> {
    const broker = await this.brokersRepository.findOne({ where: { email } });

    const passwordValid = await bcrypt.compare(password, broker.password);
    if (!broker || !passwordValid || !broker.isApproved) {
      return null;
    }

    return broker;
  }

  async loginBroker(broker: Broker): Promise<{ accessToken: string }> {
    const payload = { email: broker.email, sub: broker.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async approveBroker(id: number): Promise<Broker> {
    const broker = await this.brokersRepository.findOne({ where: { id } });
    if (!broker) {
      throw new NotFoundException('Broker not found');
    }
    broker.isApproved = true;
    return this.brokersRepository.save(broker);
  }
}
