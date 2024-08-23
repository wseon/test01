import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterClientDto {
  @ApiProperty({ description: 'Client name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Client email'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Client password'})
  @IsNotEmpty()
  @IsString()
  password?: string;

  @ApiProperty({ description: 'Client Google Id - if google auth'})
  @IsOptional()
  googleId?: string;

  @ApiProperty({ description: 'Client Kakao Id - if kakao auth'})
  @IsOptional()
  kakaoId?: string;

  @ApiProperty({ description: 'Auth provider type'})
  @IsNotEmpty()
  @IsString()
  authProvider: 'email' | 'google' | 'kakao';
}
