import { Controller, Post, Body, UseGuards, Req, Patch, Param, Get } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkStatusDto } from './dto/update-work-status.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('Works')
@Controller('works')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @ApiOperation({ summary: 'Create a new work' })
  @ApiBearerAuth()
  @Post()
  @Roles('broker')
  async createWork(@Req() req: ExpressRequest, @Body() createWorkDto: CreateWorkDto) {
    return this.workService.createWork(createWorkDto);
  }

  @ApiOperation({ summary: 'Update work status' })
  @ApiBearerAuth()
  @Patch(':workId/status')
  @Roles('broker', 'provider')
  async updateWorkStatus(@Param('workId') workId: number, @Body() updateWorkStatusDto: UpdateWorkStatusDto) {
    return this.workService.updateWorkStatus(workId, updateWorkStatusDto);
  }

  @ApiOperation({ summary: 'Get all works for a contract' })
  @ApiBearerAuth()
  @Get('contract/:contractId')
  @Roles('client')
  async getWorksByContract(@Param('contractId') contractId: number) {
    return this.workService.getWorksByContract(contractId);
  }

  @ApiOperation({ summary: 'Verify worker at the work site' })
  @ApiBearerAuth()
  @Get(':workId/verify-worker/:workerId')
  @Roles('client')
  async verifyWorker(@Param('workId') workId: number, @Param('workerId') workerId: number) {
    const isVerified = await this.workService.verifyWorker(workId, workerId);
    return { verified: isVerified };
  }
}
