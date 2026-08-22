import { IsDateString, IsOptional, IsString } from "class-validator";
export class UpdateRfiDto {
  @IsOptional() @IsString() subject?: string;
  @IsOptional() @IsString() question?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}
