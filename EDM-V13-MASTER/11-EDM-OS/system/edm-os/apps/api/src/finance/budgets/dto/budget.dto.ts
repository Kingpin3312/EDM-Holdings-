import { IsNumber, IsOptional, IsString } from "class-validator";
export class CreateBudgetDto {
  @IsString() projectId!: string;
  @IsString() description!: string;
  @IsNumber() budgetAmount!: number;
  @IsOptional() @IsString() costCodeId?: string;
  @IsOptional() @IsNumber() committedAmount?: number;
  @IsOptional() @IsNumber() actualAmount?: number;
}
export class UpdateBudgetDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() budgetAmount?: number;
  @IsOptional() @IsNumber() committedAmount?: number;
  @IsOptional() @IsNumber() actualAmount?: number;
}
