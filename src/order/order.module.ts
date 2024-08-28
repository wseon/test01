import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Broker } from 'src/auth/entities/broker.entity';
import { Worker } from 'src/worker/entities/worker.entity';
import { OrderApplication } from './entities/order-application.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Broker, Worker, OrderApplication]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
