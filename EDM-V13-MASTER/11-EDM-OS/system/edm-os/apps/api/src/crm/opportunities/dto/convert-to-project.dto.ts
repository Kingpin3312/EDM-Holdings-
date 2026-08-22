import { IsOptional, IsString, IsDateString } from "class-validator";

// Convert a won opportunity into a live project. Name, client and contract
// value carry over from the opportunity — only project-specific fields are
// supplied here. Code is auto-generated (EDM-P-####) unless overridden.
export class ConvertToProjectDto {
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() emirate?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() managerUserId?: string;
  @IsOptional() @IsDateString() startDate?: string;
}
