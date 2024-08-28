export class RoomDto {
  roomId: string;
  roomName: string;

  constructor(roomName: string) {
    this.roomId = roomName;
    this.roomName = roomName;
  }


}
