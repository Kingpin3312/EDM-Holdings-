import { IsEnum, IsOptional, IsString } from "class-validator";
import { Severity, NcrStatus } from "@edm-os/db";
export class UpdateNcrDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(Severity) severity?: Severity;
  @IsOptional() @IsEnum(NcrStatus) status?: NcrStatus;
  @IsOptional() @IsString() correctiveAction?: string;
}
