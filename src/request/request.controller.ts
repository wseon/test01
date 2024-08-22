import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Request as ExpressRequest } from 'express';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('client') // 클라이언트만 요청 가능
  async createRequest(@Req() req: ExpressRequest, @Body() createRequestDto: CreateRequestDto) {
    const clientId = req.user.id; // JWT를 통해 인증된 클라이언트 ID 가져오기
    return this.requestService.createRequest(clientId, createRequestDto);
  }

}
