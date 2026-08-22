import { IsNumber, IsOptional, IsString } from "class-validator";
export class CreateEstimateDto {
  @IsString() ref!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() tenderId?: string;
  @IsOptional() @IsNumber() overheadPct?: number;
  @IsOptional() @IsNumber() profitPct?: number;
  @IsOptional() @IsNumber() contingencyPct?: number;
  @IsOptional() @IsString() currency?: string;
}
