import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';

@WebSocketGateway({namespace: '/chat', cors: true})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private redisSubscriberClient: Redis;
  private redisPublisherClient: Redis;

  constructor() {
    this.redisSubscriberClient = new Redis();
    this.redisPublisherClient = new Redis();
  }

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    const roomExists = await this.redisPublisherClient.sismember('rooms', roomName);
    if (!roomExists) {
      await this.redisPublisherClient.sadd('rooms', roomName);
      client.emit('roomCreated', { roomName, status: 'Room created successfully' });
    } else {
      client.emit('roomCreated', { roomName, status: 'Room already exists' });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string) {
    const roomExists = await this.redisPublisherClient.sismember('rooms', roomName);
    if (roomExists) {
      await this.redisPublisherClient.sadd(`room:${roomName}:users`, client.id);
      client.join(roomName);
      this.redisPublisherClient.publish('chat', JSON.stringify({ room: roomName, sender: 'Server', message: `${client.id} joined ${roomName}` }));
    } else {
      client.emit('joinError', { roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string) {
    const roomExists = await this.redisPublisherClient.sismember('rooms', roomName);
    if (roomExists) {
      await this.redisPublisherClient.srem(`room:${roomName}:users`, client.id);
      client.leave(roomName);
      this.redisPublisherClient.publish('chat', JSON.stringify({ room: roomName, sender: 'Server', message: `${client.id} left ${roomName}` }));
    } else {
      client.emit('leaveError', { roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: { roomName: string; sender: string; message: string }, @ConnectedSocket() client: Socket) {
    const roomExists = await this.redisPublisherClient.sismember('rooms', data.roomName);
    if (roomExists) {
      this.redisPublisherClient.publish('chat', JSON.stringify(data));
    } else {
      client.emit('messageError', { roomName: data.roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('getRooms')
  async handleGetRooms(@ConnectedSocket() client: Socket) {
    const rooms = await this.redisPublisherClient.smembers('rooms');
    client.emit('roomsList', rooms);
  }

  async onModuleInit() {
    this.redisSubscriberClient.subscribe('chat', (err, count) => {
      if (err) {
        console.error('Failed to subscribe: %s', err.message);
      } else {
        console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
      }
    });

    this.redisSubscriberClient.on('message', (channel, message) => {
      const data = JSON.parse(message);
      this.server.to(data.roomName).emit('message', data);
    });
  }
}
