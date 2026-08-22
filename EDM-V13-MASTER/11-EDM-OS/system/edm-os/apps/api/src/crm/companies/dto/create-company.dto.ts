import { IsEnum, IsOptional, IsString } from "class-validator";
import { CompanyType } from "@edm-os/db";

export class CreateCompanyDto {
  @IsString() name!: string;
  @IsEnum(CompanyType) type!: CompanyType;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() notes?: string;
}
