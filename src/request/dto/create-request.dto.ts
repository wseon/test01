import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ description: 'Request title'})
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Request Description'})
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Asigned broker ID'})
  @IsOptional()
  brokerId?: number; // 특정 Broker에게 요청할 경우

  @ApiProperty({ description: 'Public or Private Key'})
  @IsNotEmpty()
  isPublic: boolean; // 공개 요청 여부
}
