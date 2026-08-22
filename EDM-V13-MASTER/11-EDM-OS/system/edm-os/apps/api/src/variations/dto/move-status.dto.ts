import { IsEnum } from "class-validator";
import { VariationStatus } from "@edm-os/db";
export class MoveStatusDto {
  @IsEnum(VariationStatus) status!: VariationStatus;
}
