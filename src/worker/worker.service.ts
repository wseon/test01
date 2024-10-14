import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Broker } from 'src/auth/entities/broker.entity';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Broker)
    private brokerRepository: Repository<Broker>,
  ) {}

  async createWorker(brokerId: number, createWorkerDto: CreateWorkerDto): Promise<Worker> {
    const broker = await this.brokerRepository.findOne({ where: { id: brokerId } });

    if (!broker) {
      throw new NotFoundException('Provider not found');
    }

    const worker = this.workerRepository.create({
      ...createWorkerDto,
      broker,
    });

    return this.workerRepository.save(worker);
  }

  async updateWorker(workerId: number, updateWorkerDto: UpdateWorkerDto): Promise<Worker> {
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    Object.assign(worker, updateWorkerDto);
    return this.workerRepository.save(worker);
  }

  async deleteWorker(workerId: number): Promise<void> {
    const worker = await this.workerRepository.findOne({ where: { id: workerId } });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    await this.workerRepository.remove(worker);
  }

  async getWorkersByBroker(brokerId: number): Promise<Worker[]> {
    return this.workerRepository.find({ where: { broker: { id: brokerId } } });
  }
}
