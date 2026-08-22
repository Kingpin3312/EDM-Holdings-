import { IsEnum, IsInt, IsOptional, IsString, Max, Min, IsEmail } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateSupplierDto {
  @IsString() name!: string;
  @IsOptional() @IsEnum(Trade) trade?: Trade;
  @IsOptional() @IsString() contactName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
}
