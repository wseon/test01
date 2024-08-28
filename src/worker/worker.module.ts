import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { Provider } from 'src/auth/entities/provider.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worker, Provider, Order]),
  ],
  providers: [WorkerService],
  controllers: [WorkerController],
})
export class WorkerModule {}
