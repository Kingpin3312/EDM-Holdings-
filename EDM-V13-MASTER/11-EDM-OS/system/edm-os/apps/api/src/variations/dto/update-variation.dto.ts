import { IsNumber, IsOptional, IsString } from "class-validator";
export class UpdateVariationDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() value?: number;
}
