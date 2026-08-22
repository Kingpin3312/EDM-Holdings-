import { IsEnum, IsObject, IsOptional, IsString, IsDateString } from "class-validator";
import { InspectionResult } from "@edm-os/db";
export class UpdateInspectionDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsEnum(InspectionResult) result?: InspectionResult;
  @IsOptional() @IsObject() responses?: Record<string, unknown>;
  @IsOptional() @IsDateString() inspectedAt?: string;
}
