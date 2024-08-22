import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  sendMessage(messageDto: SendMessageDto) {
    // 메시지 전송 로직 구현
  }

  getChatHistory(chatId: string) {
    // 채팅 기록 조회 로직 구현
  }
}
