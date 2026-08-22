import { PartialType } from "@nestjs/common";
import { CreateRateDto } from "./create-rate.dto";
export class UpdateRateDto extends PartialType(CreateRateDto) {}
