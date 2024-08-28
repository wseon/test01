import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Worker } from './entities/worker.entity';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Provider } from 'src/auth/entities/provider.entity';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
    @InjectRepository(Provider)
    private providerRepository: Repository<Provider>,
  ) {}

  async createWorker(providerId: number, createWorkerDto: CreateWorkerDto): Promise<Worker> {
    const provider = await this.providerRepository.findOne({ where: { id: providerId } });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const worker = this.workerRepository.create({
      ...createWorkerDto,
      provider,
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

  async getWorkersByProvider(providerId: number): Promise<Worker[]> {
    return this.workerRepository.find({ where: { provider: { id: providerId } } });
  }
}
