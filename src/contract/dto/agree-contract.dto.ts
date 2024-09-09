import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AgreeContractDto {

  @ApiProperty({ description: 'Contract ID'})
  @IsNotEmpty()
  @IsNumber()
  contractId: number;
}
