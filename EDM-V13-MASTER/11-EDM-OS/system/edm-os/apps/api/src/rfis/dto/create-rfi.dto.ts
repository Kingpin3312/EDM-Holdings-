import { IsDateString, IsOptional, IsString } from "class-validator";
export class CreateRfiDto {
  @IsString() projectId!: string;
  @IsString() ref!: string;
  @IsString() subject!: string;
  @IsString() question!: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsString() raisedById?: string;
}
