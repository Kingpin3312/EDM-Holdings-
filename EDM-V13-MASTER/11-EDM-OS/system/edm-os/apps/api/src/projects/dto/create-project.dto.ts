import { IsArray, IsEnum, IsOptional, IsString, IsNumber, IsDateString } from "class-validator";
import { Trade, ProjectStatus } from "@edm-os/db";

export class CreateProjectDto {
  @IsString() code!: string;
  @IsString() name!: string;
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() tenderId?: string;
  @IsOptional() @IsArray() @IsEnum(Trade, { each: true }) trades?: Trade[];
  @IsOptional() @IsEnum(ProjectStatus) status?: ProjectStatus;
  @IsOptional() @IsNumber() contractValue?: number;
  @IsOptional() @IsString() emirate?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
}
