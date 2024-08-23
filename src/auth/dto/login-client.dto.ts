import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginClientDto {
  @ApiProperty({ description: 'Client email'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Client password'})
  @IsNotEmpty()
  @IsString()
  password: string;
}
