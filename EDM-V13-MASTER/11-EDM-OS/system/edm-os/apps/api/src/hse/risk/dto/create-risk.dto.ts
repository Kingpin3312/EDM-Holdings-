import { IsArray, IsEnum, IsOptional, IsString, IsDateString } from "class-validator";
import { Severity } from "@edm-os/db";
export class CreateRiskDto {
  @IsOptional() @IsString() projectId?: string;
  @IsString() ref!: string;
  @IsString() activity!: string;
  @IsArray() hazards!: { hazard: string; likelihood: number; severity: number; control: string }[];
  @IsOptional() @IsEnum(Severity) residualRisk?: Severity;
  @IsOptional() @IsDateString() reviewedAt?: string;
}
