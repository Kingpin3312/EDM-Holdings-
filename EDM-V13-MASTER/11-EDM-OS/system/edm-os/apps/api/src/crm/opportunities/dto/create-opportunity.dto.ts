import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, IsDateString } from "class-validator";
import { OpportunityStatus, OpportunityStage } from "@edm-os/db";
export class CreateOpportunityDto {
  @IsString() name!: string;
  @IsNumber() value!: number;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsInt() @Min(0) @Max(100) probability?: number;
  @IsOptional() @IsEnum(OpportunityStatus) status?: OpportunityStatus;
  @IsOptional() @IsEnum(OpportunityStage) stage?: OpportunityStage;
  @IsOptional() @IsDateString() expectedClose?: string;
}
