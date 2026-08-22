import { IsArray, IsNumber, IsOptional, IsString, IsDateString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PoLineDto {
  @IsString() description!: string;
  @IsNumber() qty!: number;
  @IsString() unit!: string;
  @IsNumber() unitPrice!: number;
}
export class CreatePoDto {
  @IsString() supplierId!: string;
  @IsString() poNo!: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsDateString() expectedAt?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PoLineDto) lines?: PoLineDto[];
}
