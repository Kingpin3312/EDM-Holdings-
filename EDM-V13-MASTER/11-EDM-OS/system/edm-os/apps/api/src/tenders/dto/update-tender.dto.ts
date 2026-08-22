import { PartialType } from "@nestjs/common";
import { CreateTenderDto } from "./create-tender.dto";
export class UpdateTenderDto extends PartialType(CreateTenderDto) {}
