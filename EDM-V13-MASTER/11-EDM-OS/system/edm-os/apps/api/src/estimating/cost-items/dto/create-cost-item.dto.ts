import { IsEnum, IsString } from "class-validator";
import { Trade } from "@edm-os/db";
export class CreateCostItemDto {
  @IsString() code!: string;
  @IsString() description!: string;
  @IsEnum(Trade) trade!: Trade;
  @IsString() unit!: string; // m2, m, nr, item
}
