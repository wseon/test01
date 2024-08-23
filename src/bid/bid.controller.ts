import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BidService } from './bid.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Bids')
@Controller('bid')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BidController {
  constructor(private readonly bidService: BidService) {}

  // 브로커가 견적 제출
  @ApiOperation({ summary: 'Submit a bid for a request' })
  @ApiBearerAuth()
  @Post(':requestId')
  @Roles('broker')
  async createBid(
    @Req() req: ExpressRequest,
    @Param('requestId') requestId: number,
    @Body('amount') amount: number,
  ) {
    console.log('DDDD')
    console.log(req.user)
    const brokerId = req.user.id;
    return this.bidService.createBid(brokerId, requestId, amount);
  }

  // 특정 요청에 대한 견적 목록 조회 (해당 요청의 클라이언트만 가능)
  @ApiOperation({ summary: 'Get all bids for a specific request' })
  @ApiBearerAuth()
  @Roles('client')
  @Get('request/:requestId')
  async getBidsForRequest(@Req() req: ExpressRequest, @Param('requestId') requestId: number) {
    const clientId = req.user.id;
    return this.bidService.getBidsForRequest(clientId, requestId);
  }

  // 브로커가 제출한 견적 목록 조회
  @ApiOperation({ summary: 'Get all bids submitted by a broker' })
  @ApiBearerAuth()
  @Roles('broker')
  @Get('broker')
  async getBidsByBroker(@Req() req: ExpressRequest) {
    const brokerId = req.user.id;
    return this.bidService.getBidsByBroker(brokerId);
  }

  // 클라이언트가 견적 선택
  @ApiOperation({ summary: 'Accept a bid for a request' })
  @ApiBearerAuth()
  @Post('accept/:bidId')
  @Roles('client')
  async acceptBid(@Req() req: ExpressRequest, @Param('bidId') bidId: number) {
    const clientId = req.user.id;
    return this.bidService.acceptBid(clientId, bidId);
  }
}
