import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@Body() messageDto: SendMessageDto) {
    return this.chatService.sendMessage(messageDto);
  }

  @Get('history/:id')
  getChatHistory(@Param('id') chatId: string) {
    return this.chatService.getChatHistory(chatId);
  }
}
