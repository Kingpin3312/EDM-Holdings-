import { IsEnum, IsOptional, IsString } from "class-validator";
import { Severity } from "@edm-os/db";
export class CreateNcrDto {
  @IsString() projectId!: string;
  @IsString() ref!: string;
  @IsString() title!: string;
  @IsString() description!: string;
  @IsOptional() @IsEnum(Severity) severity?: Severity;
}
