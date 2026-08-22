import { PartialType } from "@nestjs/common";
import { CreateContactDto } from "./create-contact.dto";
export class UpdateContactDto extends PartialType(CreateContactDto) {}
