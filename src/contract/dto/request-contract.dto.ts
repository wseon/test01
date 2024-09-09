import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class RequestContractDto {
  
  @ApiProperty({ description: 'Request ID'})
  @IsNotEmpty()
  @IsNumber()
  requestId: number;
}
