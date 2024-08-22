import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterBrokerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  password: string;

  @IsNotEmpty()
  @IsString()
  businessNumber: string;

  phoneNumber?: string;

  address?: string;
}
