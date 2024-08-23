import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request as ExpressRequest } from 'express';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Request')
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @ApiOperation({ summary: 'Create a new request' })
  @ApiBearerAuth() // JWT 인증 필요
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client') // 클라이언트만 요청 가능
  async createRequest(@Req() req: ExpressRequest, @Body() createRequestDto: CreateRequestDto) {
    const clientId = req.user.id; // JWT를 통해 인증된 클라이언트 ID 가져오기
    return this.requestService.createRequest(clientId, createRequestDto);
  }

  @ApiOperation({ summary: 'Get all requests for a client' })
  @ApiBearerAuth() // JWT 인증 필요
  // 클라이언트의 요청서 목록 조회 (내가 요청한 목록)
  @Get('client')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  async getClientRequests(@Req() req: ExpressRequest) {
    const clientId = req.user.id;
    return this.requestService.getClientRequests(clientId);
  }

  @ApiOperation({ summary: 'Get all requests for a broker' })
  @ApiBearerAuth() // JWT 인증 필요
  // 브로커의 요청서 목록 조회 (나에게 맡겨진 목록)
  @Get('broker')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('broker')
  async getBrokerRequests(@Req() req: ExpressRequest) {
    const brokerId = req.user.id;
    return this.requestService.getBrokerRequests(brokerId);
  }

  @ApiOperation({ summary: 'Get all requests' })
  @ApiBearerAuth() // JWT 인증 필요
  // 공개 요청서 목록 조회 (클라이언트와 브로커만 접근 가능)
  @Get('public')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client', 'broker')
  async getPublicRequests() {
    return this.requestService.getPublicRequests();
  }

  // 요청 변경
  @ApiOperation({ summary: 'Update a request' })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  async updateRequest(
    @Req() req: ExpressRequest,
    @Param('id') id: number,
    @Body() updateData: Partial<CreateRequestDto>
  ) {
    const clientId = req.user.id;
    return this.requestService.updateRequest(clientId, id, updateData);
  }

  // 요청 삭제
  @ApiOperation({ summary: 'Delete a request' })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client')
  async deleteRequest(@Req() req: ExpressRequest, @Param('id') id: number) {
    const clientId = req.user.id;
    await this.requestService.deleteRequest(clientId, id);
    return { message: 'Request deleted successfully' };
  }
}
