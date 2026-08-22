import { IsEnum, IsOptional, IsString, IsDateString } from "class-validator";
import { ActivityType } from "@edm-os/db";
export class CreateActivityDto {
  @IsEnum(ActivityType) type!: ActivityType;
  @IsString() subject!: string;
  @IsOptional() @IsString() body?: string;
  @IsOptional() @IsDateString() dueAt?: string;
  @IsOptional() @IsString() ownerUserId?: string;
  @IsOptional() @IsString() contactId?: string;
  @IsOptional() @IsString() leadId?: string;
  @IsOptional() @IsString() opportunityId?: string;
  @IsOptional() @IsString() projectId?: string;
}
