import { IsDateString, IsEnum, IsOptional } from "class-validator";
import { PoStatus } from "@edm-os/db";
export class UpdatePoDto {
  @IsOptional() @IsEnum(PoStatus) status?: PoStatus;
  @IsOptional() @IsDateString() expectedAt?: string;
}
