export class CreateWorkDto {
  contractId: number;
  description: string;
  workerIds: number[]; // 작업에 참여할 작업자들
}
