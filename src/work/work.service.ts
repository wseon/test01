import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Work } from './entities/work.entity';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkStatusDto } from './dto/update-work-status.dto';
import { Contract } from 'src/contract/entities/contract.entity';
import { Worker } from 'src/worker/entities/worker.entity';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private workRepository: Repository<Work>,
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Worker)
    private workerRepository: Repository<Worker>,
  ) {}

  // 작업 생성
  async createWork(createWorkDto: CreateWorkDto): Promise<Work> {
    const contract = await this.contractRepository.findOne({ where: { id: createWorkDto.contractId } });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    const workers = await this.workerRepository.findByIds(createWorkDto.workerIds);

    if (workers.length !== createWorkDto.workerIds.length) {
      throw new NotFoundException('One or more workers not found');
    }

    const work = this.workRepository.create({
      contract,
      workers,
      description: createWorkDto.description,
      status: 'pending',
    });

    return this.workRepository.save(work);
  }

  // 작업 상태 업데이트
  async updateWorkStatus(workId: number, updateWorkStatusDto: UpdateWorkStatusDto): Promise<Work> {
    const work = await this.workRepository.findOne({ where: { id: workId } });

    if (!work) {
      throw new NotFoundException('Work not found');
    }

    work.status = updateWorkStatusDto.status;
    if (updateWorkStatusDto.status === 'completed') {
      work.completedAt = updateWorkStatusDto.completedAt || new Date();
    }

    return this.workRepository.save(work);
  }

  // 특정 계약의 작업 조회
  async getWorksByContract(contractId: number): Promise<Work[]> {
    return this.workRepository.find({ where: { contract: { id: contractId } }, relations: ['workers'] });
  }

  // 작업자 확인
  async verifyWorker(workId: number, workerId: number): Promise<boolean> {
    const work = await this.workRepository.findOne({ where: { id: workId }, relations: ['workers'] });

    if (!work) {
      throw new NotFoundException('Work not found');
    }

    return work.workers.some(worker => worker.id === workerId);
  }
}
