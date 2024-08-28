import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { Broker } from 'src/auth/entities/broker.entity';
import { Client } from 'src/auth/entities/client.entity';
import { Work } from 'src/work/entities/work.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract, Broker, Client, Work]),
  ],
  providers: [ContractService],
  controllers: [ContractController],
})
export class ContractModule {}
