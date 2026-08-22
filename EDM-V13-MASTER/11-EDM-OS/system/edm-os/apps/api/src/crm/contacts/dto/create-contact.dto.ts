import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";
export class CreateContactDto {
  @IsString() companyId!: string;
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsBoolean() isPrimary?: boolean;
}
