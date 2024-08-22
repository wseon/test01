import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { SubmitReviewDto } from './dto/submit-review.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('request')
  createRequest(@Body() requestDto: CreateRequestDto) {
    return this.clientService.createRequest(requestDto);
  }

  @Get('bids')
  getQuotes(@Query('requestId') requestId: string) {
    return this.clientService.getBids(requestId);
  }

  @Post('contract')
  createContract(@Body() contractDto: CreateContractDto) {
    return this.clientService.createContract(contractDto);
  }

  @Post('review')
  submitReview(@Body() reviewDto: SubmitReviewDto) {
    return this.clientService.submitReview(reviewDto);
  }
}
