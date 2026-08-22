import { IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class FirstRevisionDto {
  @IsString() storageKey!: string;   // Supabase Storage object key
  @IsString() fileName!: string;
  @IsOptional() fileSize?: number;
  @IsOptional() @IsString() note?: string;
}
export class CreateDocumentDto {
  @IsString() title!: string;
  @IsString() category!: string;     // drawing | contract | spec | submittal...
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() tenderId?: string;
  @IsOptional() @IsString() variationId?: string;
  @IsOptional() @IsString() rfiId?: string;
  @IsOptional() @ValidateNested() @Type(() => FirstRevisionDto) firstRevision?: FirstRevisionDto;
}
