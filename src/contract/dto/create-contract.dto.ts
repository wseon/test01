import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateContractDto {

  @ApiProperty({ description: 'Request ID'})
  @IsNotEmpty()
  @IsNumber()
  requestId: number;

  @ApiProperty({ description: 'Client ID' })
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @ApiProperty({ description: 'Contract Detail'})
  @IsOptional()
  @IsString()
  contractDetails: string;
}
