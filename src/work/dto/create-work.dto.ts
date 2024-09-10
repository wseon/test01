import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateWorkDto {
  @ApiProperty({ description: 'Contract ID'})
  @IsNotEmpty()
  @IsNumber()
  contractId: number;

  @ApiProperty({ description: 'Work Description'})
  @IsOptional()
  @IsString()
  description: string;

  // TODO: 2024-09-11 : 필수 여부 확인 필요 > 일을 만들고 -> 직원을 나중에 추가할 수 있는지
  @ApiProperty({ description: 'Person(Workers) involved in work'})
  @IsOptional()
  @IsArray()
  workerIds: number[]; // 작업에 참여할 작업자들
}
