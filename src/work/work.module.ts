import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { WorkService } from './work.service';
import { WorkController } from './work.controller';
import { Contract } from 'src/contract/entities/contract.entity';
import { Worker } from 'src/worker/entities/worker.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Work, Contract, Worker]),
  ],
  providers: [WorkService],
  controllers: [WorkController],
})
export class WorkModule {}
