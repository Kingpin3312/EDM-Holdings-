import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateTemplateDto {
  @IsString() name!: string;
  @IsOptional() @IsEnum(Trade) trade?: Trade;
  @IsArray() items!: { id: string; text: string; required?: boolean }[];
}
