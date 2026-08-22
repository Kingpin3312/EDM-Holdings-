import { IsNumber, IsOptional, IsString, IsInt, Min, Max, IsDateString } from "class-validator";
export class ConvertLeadDto {
  @IsOptional() @IsString() name?: string;       // opportunity name (defaults to lead title)
  @IsNumber() value!: number;
  @IsOptional() @IsInt() @Min(0) @Max(100) probability?: number;
  @IsOptional() @IsDateString() expectedClose?: string;
}
