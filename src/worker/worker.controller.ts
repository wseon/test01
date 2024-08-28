import { Controller, Post, Body, UseGuards, Req, Patch, Delete, Param, Get } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('Workers')
@Controller('workers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @ApiOperation({ summary: 'Create a new worker' })
  @ApiBearerAuth()
  @Post()
  @Roles('provider')
  async createWorker(@Req() req: ExpressRequest, @Body() createWorkerDto: CreateWorkerDto) {
    const providerId = req.user.id;
    return this.workerService.createWorker(providerId, createWorkerDto);
  }

  @ApiOperation({ summary: 'Update worker details' })
  @ApiBearerAuth()
  @Patch(':workerId')
  @Roles('provider')
  async updateWorker(@Param('workerId') workerId: number, @Body() updateWorkerDto: UpdateWorkerDto) {
    return this.workerService.updateWorker(workerId, updateWorkerDto);
  }

  @ApiOperation({ summary: 'Delete a worker' })
  @ApiBearerAuth()
  @Delete(':workerId')
  @Roles('provider')
  async deleteWorker(@Param('workerId') workerId: number) {
    return this.workerService.deleteWorker(workerId);
  }

  @ApiOperation({ summary: 'Get all workers for a provider' })
  @ApiBearerAuth()
  @Get()
  @Roles('provider')
  async getWorkersByProvider(@Req() req: ExpressRequest) {
    const providerId = req.user.id;
    return this.workerService.getWorkersByProvider(providerId);
  }
}
