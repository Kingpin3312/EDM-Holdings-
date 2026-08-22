import { IsEnum, IsOptional, IsString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateSnagDto {
  @IsString() projectId!: string;
  @IsString() ref!: string;
  @IsString() description!: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEnum(Trade) trade?: Trade;
  @IsOptional() @IsString() inspectionId?: string;
  @IsOptional() @IsString() photoUrl?: string;
}
