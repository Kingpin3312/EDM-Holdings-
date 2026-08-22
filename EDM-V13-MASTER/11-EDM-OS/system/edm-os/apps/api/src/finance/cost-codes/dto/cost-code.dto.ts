import { IsEnum, IsOptional, IsString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateCostCodeDto {
  @IsString() code!: string;
  @IsString() description!: string;
  @IsOptional() @IsEnum(Trade) trade?: Trade;
}
import { PartialType } from "@nestjs/common";
export class UpdateCostCodeDto extends PartialType(CreateCostCodeDto) {}
