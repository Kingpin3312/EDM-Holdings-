import { PartialType } from "@nestjs/common";
import { CreateCostItemDto } from "./create-cost-item.dto";
export class UpdateCostItemDto extends PartialType(CreateCostItemDto) {}
