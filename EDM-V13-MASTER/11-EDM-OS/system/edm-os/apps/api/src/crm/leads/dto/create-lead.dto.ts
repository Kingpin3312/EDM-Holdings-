import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
import { LeadStage } from "@edm-os/db";
export class CreateLeadDto {
  @IsString() title!: string;
  @IsOptional() @IsString() companyId?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsEnum(LeadStage) stage?: LeadStage;
  @IsOptional() @IsNumber() estValue?: number;
  @IsOptional() @IsDateString() nextFollowUpAt?: string;
  @IsOptional() @IsString() ownerUserId?: string;
  @IsOptional() @IsString() notes?: string;
}
