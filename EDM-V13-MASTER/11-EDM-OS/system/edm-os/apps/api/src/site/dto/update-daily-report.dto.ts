import { IsInt, IsOptional, IsString } from "class-validator";
// Only the report header is patchable; entries are managed via their own endpoints.
export class UpdateDailyReportDto {
  @IsOptional() @IsString() weather?: string;
  @IsOptional() @IsInt() temperatureC?: number;
  @IsOptional() @IsString() delays?: string;
  @IsOptional() @IsString() notes?: string;
}
