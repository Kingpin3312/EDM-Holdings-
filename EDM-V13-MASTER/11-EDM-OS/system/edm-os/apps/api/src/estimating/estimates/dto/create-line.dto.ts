import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateLineDto {
  @IsString() description!: string;
  @IsEnum(Trade) trade!: Trade;
  @IsString() unit!: string;
  @IsNumber() qty!: number;
  @IsOptional() @IsString() costItemId?: string;
  @IsOptional() @IsNumber() labourRate?: number;
  @IsOptional() @IsNumber() materialRate?: number;
  @IsOptional() @IsNumber() plantRate?: number;
  @IsOptional() @IsNumber() subRate?: number;
  @IsOptional() @IsInt() sortOrder?: number;
}
