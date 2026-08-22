import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { RateType } from "@edm-os/db";
export class CreateRateDto {
  @IsEnum(RateType) type!: RateType;
  @IsString() description!: string;
  @IsString() unit!: string;
  @IsNumber() rate!: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsString() costItemId?: string;
  @IsOptional() @IsString() supplierId?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @IsOptional() @IsDateString() validTo?: string;
}
