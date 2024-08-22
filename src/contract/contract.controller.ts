import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { AsRequestDto } from './dto/as-request.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('create')
  createContract(@Body() contractDto: CreateContractDto) {
    return this.contractService.createContract(contractDto);
  }

  @Get('status/:id')
  getContractStatus(@Param('id') id: string) {
    return this.contractService.getContractStatus(id);
  }

  @Post('as-request')
  requestAS(@Body() asRequestDto: AsRequestDto) {
    return this.contractService.requestAS(asRequestDto);
  }
}
