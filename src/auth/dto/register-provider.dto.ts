import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterProviderDto {
  @ApiProperty({ description: 'Provider name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Provider email'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Provider password'})
  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  password: string;

  @ApiProperty({ description: 'Provider business number'})
  @IsNotEmpty()
  @IsString()
  businessNumber: string;

  @ApiProperty({ description: 'Provider phone number'})
  phoneNumber?: string;

  @ApiProperty({ description: 'Provider address'})
  address?: string;
}
