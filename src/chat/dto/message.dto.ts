export class MessageDto {
  roomName: string;
  sender: string;
  message: string;
  timestamp: Date;

  constructor(roomName: string, sender: string, message: string) {
    this.roomName = roomName;
    this.sender = sender;
    this.message = message;
    this.timestamp = new Date();
  }
}
