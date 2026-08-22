import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
export class ReceiptDto {
  @IsString() lineId!: string;
  @IsNumber() quantity!: number;
}
export class ReceiveDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => ReceiptDto) receipts!: ReceiptDto[];
}
