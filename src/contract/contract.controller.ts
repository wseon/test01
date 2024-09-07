import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { AgreeContractDto } from './dto/agree-contract.dto';
import { RequestContractDto } from './dto/request-contract.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('Contracts')
@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @ApiOperation({ summary: 'Request a contract from a broker' })
  @ApiBearerAuth()
  @Post('request')
  @Roles('client')
  async requestContract(
    @Req() req: ExpressRequest,
    @Body() requestContractDto: RequestContractDto,
  ) {
    const client = req.user;
    return this.contractService.requestContract(client, requestContractDto);
  }

  @ApiOperation({ summary: 'Create a contract for a client' })
  @ApiBearerAuth()
  @Post('create')
  @Roles('broker')
  async createContract(
    @Req() req: ExpressRequest,
    @Body() createContractDto: CreateContractDto,
  ) {
    const broker = req.user;
    return this.contractService.createContract(broker, createContractDto);
  }

  @ApiOperation({
    summary: 'Client agrees to the contract (소비자 : 계약 요청)',
  })
  @ApiBearerAuth()
  @Post('agree/client')
  @Roles('client')
  async agreeContractAsClient(
    @Req() req: ExpressRequest,
    @Body() agreeContractDto: AgreeContractDto,
  ) {
    const client = req.user;
    return this.contractService.agreeContractAsClient(client, agreeContractDto);
  }

  @ApiOperation({ summary: 'Broker agrees to the contract (업체 : 계약 확정)' })
  @ApiBearerAuth()
  @Post('agree/broker')
  @Roles('broker')
  async agreeContractAsBroker(
    @Req() req: ExpressRequest,
    @Body() agreeContractDto: AgreeContractDto,
  ) {
    const broker = req.user;
    return this.contractService.agreeContractAsBroker(broker, agreeContractDto);
  }

  @ApiOperation({
    summary: 'Get contracts by a client (소비자: 계약서 확인)',
  })
  @ApiBearerAuth()
  @Roles('client')
  @Get('client')
  async getContractsByClient(@Req() req: ExpressRequest) {
    const clientId = req.user.id;
    console.log('client', clientId);
    return this.contractService.getContractsByClient(clientId);
  }

  @ApiOperation({ summary: 'Get contracts by a broker (업체: 계약서 확인' })
  @ApiBearerAuth()
  @Roles('broker')
  @Get('broker')
  async getContractsByBroker(@Req() req: ExpressRequest) {
    const brokerId = req.user.id;
    return await this.contractService.getContractsByBroker(brokerId);
  }
}
