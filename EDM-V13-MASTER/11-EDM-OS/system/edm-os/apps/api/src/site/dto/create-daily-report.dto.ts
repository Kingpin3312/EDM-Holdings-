import { IsArray, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { LabourEntryDto, PlantEntryDto, DeliveryEntryDto } from "./entries.dto";

export class CreateDailyReportDto {
  @IsString() projectId!: string;
  @IsDateString() reportDate!: string;
  @IsOptional() @IsString() weather?: string;
  @IsOptional() @IsInt() temperatureC?: number;
  @IsOptional() @IsString() delays?: string;
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => LabourEntryDto) labour?: LabourEntryDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PlantEntryDto) plant?: PlantEntryDto[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => DeliveryEntryDto) deliveries?: DeliveryEntryDto[];
}
