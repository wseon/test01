import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@WebSocketGateway({namespace: '/chat', cors: true})
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

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
  @Roles('client', 'broker')
  async handleCreateRoom(@MessageBody() roomName: string, @ConnectedSocket() client: Socket) {
    const roomCreated = await this.chatService.createRoom(roomName);
    if (roomCreated) {
      client.emit('roomCreated', { roomName, status: 'Room created successfully' });
    } else {
      client.emit('roomCreated', { roomName, status: 'Room already exists' });
    }
  }

  @SubscribeMessage('joinRoom')
  @Roles('client', 'broker')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string) {
    const roomExists = await this.chatService.isRoomExists(roomName);
    if (roomExists) {
      await this.chatService.addUserToRoom(roomName, client.id);
      client.join(roomName);
      this.chatService.publishMessage(roomName, {
        roomName,
        sender: 'Server',
        message: `${client.id} joined ${roomName}`,
      });
    } else {
      client.emit('joinError', { roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('leaveRoom')
  @Roles('client', 'broker')
  async handleLeaveRoom(@ConnectedSocket() client: Socket, @MessageBody() roomName: string) {
    const roomExists = await this.chatService.isRoomExists(roomName);
    if (roomExists) {
      await this.chatService.removeUserFromRoom(roomName, client.id);
      client.leave(roomName);
      this.chatService.publishMessage(roomName, {
        roomName,
        sender: 'Server',
        message: `${client.id} left ${roomName}`,
      });
    } else {
      client.emit('leaveError', { roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('message')
  @Roles('client', 'broker')
  async handleMessage(@MessageBody() data: { roomName: string; sender: string; message: string }, @ConnectedSocket() client: Socket) {
    const roomExists = await this.chatService.isRoomExists(data.roomName);
    if (roomExists) {
      this.chatService.publishMessage(data.roomName, data);
    } else {
      client.emit('messageError', { roomName: data.roomName, message: 'Room does not exist' });
    }
  }

  @SubscribeMessage('getRooms')
  @Roles('client', 'broker')
  async handleGetRooms(@ConnectedSocket() client: Socket) {
    const rooms = await this.chatService.getRooms();
    client.emit('roomsList', rooms);
  }

  async onModuleInit() {
    this.chatService.subscribeToChat((channel, message) => {
      const data = JSON.parse(message);
      this.server.to(data.roomName).emit('message', data);
    });
  }
}
