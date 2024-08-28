export class CreateRoomDto {
  roomId: string;
  roomName: string;
  createdAt: number;

  constructor(roomName: string) {
    this.roomId = roomName;
    this.roomName = roomName;
    this.createdAt = Date.now();
  }


}
