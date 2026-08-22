import { PartialType } from "@nestjs/common";
import { IsEnum, IsOptional } from "class-validator";
import { EstimateStatus } from "@edm-os/db";
import { CreateEstimateDto } from "./create-estimate.dto";
export class UpdateEstimateDto extends PartialType(CreateEstimateDto) {
  @IsOptional() @IsEnum(EstimateStatus) status?: EstimateStatus;
}
