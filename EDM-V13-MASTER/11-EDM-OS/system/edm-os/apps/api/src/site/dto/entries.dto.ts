import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Trade } from "@edm-os/db";

export class LabourEntryDto {
  @IsEnum(Trade) trade!: Trade;
  @IsInt() @Min(0) headcount!: number;
  @IsNumber() hours!: number;
}
export class PlantEntryDto {
  @IsString() item!: string;
  @IsInt() @Min(0) quantity!: number;
  @IsOptional() @IsNumber() hours?: number;
}
export class DeliveryEntryDto {
  @IsString() material!: string;
  @IsNumber() quantity!: number;
  @IsString() unit!: string;
  @IsOptional() @IsString() supplierId?: string;
}
