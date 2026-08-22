import { IsInt, IsOptional, IsString, Min } from "class-validator";
export class UpdateToolboxDto {
  @IsOptional() @IsString() topic?: string;
  @IsOptional() @IsInt() @Min(0) attendees?: number;
  @IsOptional() @IsString() notes?: string;
}
