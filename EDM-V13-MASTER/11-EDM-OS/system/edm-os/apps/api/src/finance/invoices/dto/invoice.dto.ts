import { IsNumber, IsOptional, IsString, IsDateString } from "class-validator";
export class CreateInvoiceDto {
  @IsString() projectId!: string;
  @IsString() invoiceNo!: string;
  @IsNumber() grossAmount!: number;
  @IsOptional() @IsNumber() retentionAmount?: number;
  @IsOptional() @IsNumber() netAmount?: number;       // computed if omitted
  @IsOptional() @IsDateString() dueAt?: string;
}
export class UpdateInvoiceDto {
  @IsOptional() @IsNumber() grossAmount?: number;
  @IsOptional() @IsNumber() retentionAmount?: number;
  @IsOptional() @IsNumber() netAmount?: number;
  @IsOptional() @IsDateString() dueAt?: string;
}
