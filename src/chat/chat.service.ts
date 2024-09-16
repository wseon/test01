import { Injectable, Inject } from '@nestjs/common';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import Redis from 'ioredis';

@Injectable()
export class ChatService {
  constructor(
    @Inject('ElasticsearchClient') private readonly elasticsearchClient: ElasticsearchClient,
    @Inject('RedisPublisherClient') private readonly redisPublisherClient: Redis,
    @Inject('RedisSubscriberClient') private readonly redisSubscriberClient: Redis,
  ) {}

  async createRoom(roomName: string): Promise<boolean> {
    const roomId = `room:${roomName}`;
    const roomExists = await this.redisPublisherClient.sismember('rooms', roomId);
    if (!roomExists) {
      await this.redisPublisherClient.sadd('rooms', roomId);
      await this.redisPublisherClient.hset(roomId, 'createdAt', new Date().toISOString());
      return true;
    } else {
      return false;
    }
  }

  async isRoomExists(roomName: string): Promise<boolean> {
    const roomId = `room:${roomName}`;
    return await this.redisPublisherClient.sismember('rooms', roomId) === 1;
  }

  async addUserToRoom(roomName: string, userId: string): Promise<void> {
    const roomId = `room:${roomName}`;
    await this.redisPublisherClient.sadd(`${roomId}:users`, userId);
  }

  async removeUserFromRoom(roomName: string, userId: string): Promise<void> {
    const roomId = `room:${roomName}`;
    await this.redisPublisherClient.srem(`${roomId}:users`, userId);
  }

  async publishMessage(roomName: string, message: any): Promise<void> {
    await this.redisPublisherClient.publish('chat', JSON.stringify(message));
    await this.saveMessageToElasticsearch(roomName, message);
  }

  async saveMessageToElasticsearch(roomName: string, message: any): Promise<void> {
    await this.elasticsearchClient.index({
      index: 'chat-messages',
      body: {
        roomName: roomName,
        sender: message.sender,
        message: message.message,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async getRecentMessages(roomName: string): Promise<any> {
    const resp = await this.elasticsearchClient.search({
      index: 'chat-messages',
      body: {
        query: {
          match: { roomName }
        },
        sort: [{ timestamp: { order: 'desc' } }],
        size: 20
      }
    });
    return resp.hits.hits.map(hit => hit._source).reverse();
  }

  async getMessagesBefore(roomName: string, messageId: string): Promise<any> {
    const resp01 = await this.elasticsearchClient.get({
      index: 'chat-messages',
      id: messageId,
    });

    const targetMessage: any = resp01._source;
    const targetTimestamp = targetMessage.timestamp;
    const resp02 = await this.elasticsearchClient.search({
      index: 'chat-index',
      body: {
        query: {
          bool: {
            must: [
              { match: { roomName } }
            ],
            filter: {
              range: {
                timestamp: {
                  lt: targetTimestamp
                }
              }
            }
          }
        },
        sort: [{ timestamp: { order: 'desc' } }],
        size: 20
      }
    });
    return resp02.hits.hits.map(hit => hit._source).reverse();
  }

  async getRooms(): Promise<string[]> {
    return await this.redisPublisherClient.smembers('rooms');
  }

  subscribeToChat(onMessage: (channel: string, message: string) => void): void {
    this.redisSubscriberClient.subscribe('chat');
    this.redisSubscriberClient.on('message', onMessage);
  }
}
