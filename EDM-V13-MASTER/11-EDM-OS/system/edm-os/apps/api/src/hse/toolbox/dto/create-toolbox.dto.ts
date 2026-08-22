import { IsInt, IsOptional, IsString, IsDateString, Min } from "class-validator";
export class CreateToolboxDto {
  @IsOptional() @IsString() projectId?: string;
  @IsString() topic!: string;
  @IsDateString() conductedAt!: string;
  @IsOptional() @IsInt() @Min(0) attendees?: number;
  @IsOptional() @IsString() notes?: string;
}
