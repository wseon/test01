export class UpdateWorkStatusDto {
  status: string; // 'pending', 'in-progress', 'completed'
  completedAt?: Date;
}
