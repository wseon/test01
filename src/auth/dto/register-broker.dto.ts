import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterBrokerDto {
  @ApiProperty({ description: 'Broker name'})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Broker email'})
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Broker password'})
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;

  @ApiProperty({ description: 'Broker business number'})
  @IsNotEmpty()
  @IsString()
  businessNumber: string;

  @ApiProperty({ description: 'Broker phone number'})
  phoneNumber?: string;

  @ApiProperty({ description: 'Broker address'})
  address?: string;
}
