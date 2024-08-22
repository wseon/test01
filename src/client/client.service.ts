import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';

@Injectable()
export class ClientService {
  createRequest(requestDto: CreateRequestDto) {
    // 청소 요청서 작성 로직 구현
  }

  getBids(requestId: string) {
    // 견적서 조회 로직 구현
  }

  createContract(contractDto: CreateContractDto) {
    // 계약 요청 로직 구현
  }

  submitReview(reviewDto: SubmitReviewDto) {
    // 리뷰 작성 로직 구현
  }
}
