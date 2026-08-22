import { IsEnum, IsOptional, IsString } from "class-validator";
import { TenderStatus } from "@edm-os/db";
export class MoveStatusDto {
  @IsEnum(TenderStatus) status!: TenderStatus;
  @IsOptional() @IsString() note?: string;
}
