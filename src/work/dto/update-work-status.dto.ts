import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWorkStatusDto {
  @ApiProperty({
    description: 'Work Status',
    example: 'pending',
    enum: ['pending', 'in-progress', 'completed'],
  })
  @IsNotEmpty()
  @IsString()
  status: string; // 'pending', 'in-progress', 'completed'

  @ApiProperty({ description: 'Work completion time' })
  @IsOptional()
  @IsDate()
  completedAt?: Date;
}
