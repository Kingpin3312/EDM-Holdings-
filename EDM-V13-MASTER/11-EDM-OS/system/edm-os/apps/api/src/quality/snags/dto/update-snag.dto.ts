import { IsEnum, IsOptional, IsString } from "class-validator";
import { SnagStatus } from "@edm-os/db";
export class UpdateSnagDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsEnum(SnagStatus) status?: SnagStatus;
  @IsOptional() @IsString() photoUrl?: string;
}
