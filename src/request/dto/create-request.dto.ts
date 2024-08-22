import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  brokerId?: number; // 특정 Broker에게 요청할 경우

  @IsNotEmpty()
  isPublic: boolean; // 공개 요청 여부
}
