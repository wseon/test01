import { Controller, Post, Body, UseGuards, Req, Patch, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBearerAuth()
  @Get('chat/history/:messageId')
  @Roles('client, broker')
  async getMessagesBefore(@Param('roomName') roomName: string, @Param('messageId') messageId: string) {
    return this.chatService.getMessagesBefore(roomName, messageId);
  }


}
