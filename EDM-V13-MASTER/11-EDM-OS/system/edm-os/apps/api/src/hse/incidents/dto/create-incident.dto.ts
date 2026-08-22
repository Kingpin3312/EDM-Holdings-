import { IsEnum, IsOptional, IsString, IsDateString } from "class-validator";
import { IncidentType, Severity } from "@edm-os/db";
export class CreateIncidentDto {
  @IsOptional() @IsString() projectId?: string;
  @IsString() ref!: string;
  @IsEnum(IncidentType) type!: IncidentType;
  @IsOptional() @IsEnum(Severity) severity?: Severity;
  @IsString() description!: string;
  @IsDateString() occurredAt!: string;
  @IsOptional() @IsString() reportedById?: string;
  @IsOptional() @IsString() rootCause?: string;
  @IsOptional() @IsString() actionsTaken?: string;
}
