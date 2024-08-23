import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request } from './entities/request.entity';
import { Client } from 'src/auth/entities/client.entity';
import { Broker } from 'src/auth/entities/broker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request, Client, Broker])],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
