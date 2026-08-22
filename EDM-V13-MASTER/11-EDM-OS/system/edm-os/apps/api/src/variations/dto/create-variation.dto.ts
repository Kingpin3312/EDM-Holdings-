import { IsNumber, IsOptional, IsString } from "class-validator";
export class CreateVariationDto {
  @IsString() projectId!: string;
  @IsString() ref!: string;
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsNumber() value!: number;
  @IsOptional() @IsString() raisedById?: string;
}
