import { PartialType } from "@nestjs/common";
import { CreateLeadDto } from "./create-lead.dto";
export class UpdateLeadDto extends PartialType(CreateLeadDto) {}
