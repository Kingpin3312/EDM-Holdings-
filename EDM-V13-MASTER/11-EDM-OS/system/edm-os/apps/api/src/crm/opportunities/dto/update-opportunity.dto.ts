import { PartialType } from "@nestjs/common";
import { CreateOpportunityDto } from "./create-opportunity.dto";
export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {}
