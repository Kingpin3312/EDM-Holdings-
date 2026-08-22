import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min, IsNumber, IsDateString } from "class-validator";
import { Trade, TenderStatus } from "@edm-os/db";

export class CreateTenderDto {
  @IsString() tenderNo!: string;
  @IsString() projectName!: string;
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() consultantId?: string;
  @IsOptional() @IsString() mainContractorId?: string;
  @IsOptional() @IsArray() @IsEnum(Trade, { each: true }) trades?: Trade[];
  @IsOptional() @IsNumber() value?: number;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsEnum(TenderStatus) status?: TenderStatus;
  @IsOptional() @IsInt() @Min(0) @Max(100) awardProbability?: number;
  @IsOptional() @IsString() notes?: string;
}
