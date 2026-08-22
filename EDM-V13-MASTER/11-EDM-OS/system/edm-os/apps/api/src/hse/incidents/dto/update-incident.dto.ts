import { IsEnum, IsOptional, IsString } from "class-validator";
import { IncidentType, Severity } from "@edm-os/db";
export class UpdateIncidentDto {
  @IsOptional() @IsEnum(IncidentType) type?: IncidentType;
  @IsOptional() @IsEnum(Severity) severity?: Severity;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() rootCause?: string;
  @IsOptional() @IsString() actionsTaken?: string;
}
