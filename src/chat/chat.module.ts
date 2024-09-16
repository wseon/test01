import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import Redis from 'ioredis';

@Module({
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: 'ElasticsearchClient',
      useFactory: () => {
        return new ElasticsearchClient({ node: 'http://192.168.0.134:9200' });
      },
    },
    {
      provide: 'RedisPublisherClient',
      useFactory: () => {
        return new Redis({
          host: '192.168.0.132',
          port: 6379,
        });
      },
    },
    {
      provide: 'RedisSubscriberClient',
      useFactory: () => {
        return new Redis({
          host: '192.168.0.132',
          port: 6379,
        });
      },
    },
  ],
})
export class ChatModule {}
