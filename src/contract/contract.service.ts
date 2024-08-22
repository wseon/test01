import { Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { AsRequestDto } from './dto/as-request.dto';

@Injectable()
export class ContractService {
  createContract(contractDto: CreateContractDto) {
    // 계약 생성 로직 구현
  }

  getContractStatus(contractId: string) {
    // 계약 상태 조회 로직 구현
  }

  requestAS(asRequestDto: AsRequestDto) {
    // AS 요청 로직 구현
  }
}
