import { IsEnum, IsObject, IsOptional, IsString, IsDateString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateInspectionDto {
  @IsString() projectId!: string;
  @IsString() ref!: string;
  @IsString() title!: string;
  @IsOptional() @IsEnum(Trade) trade?: Trade;
  @IsOptional() @IsString() templateId?: string;
  @IsOptional() @IsString() inspectorId?: string;
  @IsOptional() @IsDateString() inspectedAt?: string;
  @IsOptional() @IsObject() responses?: Record<string, unknown>;
}
