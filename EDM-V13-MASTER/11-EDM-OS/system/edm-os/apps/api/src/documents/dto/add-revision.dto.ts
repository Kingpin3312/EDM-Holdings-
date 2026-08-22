import { IsOptional, IsString } from "class-validator";
export class AddRevisionDto {
  @IsString() storageKey!: string;
  @IsString() fileName!: string;
  @IsOptional() fileSize?: number;
  @IsOptional() @IsString() note?: string;
  @IsOptional() @IsString() uploadedBy?: string;
}
