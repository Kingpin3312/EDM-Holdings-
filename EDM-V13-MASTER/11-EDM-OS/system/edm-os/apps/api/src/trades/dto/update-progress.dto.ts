import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
export class UpdateProgressDto {
  @IsOptional() @IsString() area?: string;
  @IsOptional() @IsNumber() quantity?: number;
  @IsOptional() @IsObject() attributes?: Record<string, unknown>;
  @IsOptional() @IsString() notes?: string;
}
