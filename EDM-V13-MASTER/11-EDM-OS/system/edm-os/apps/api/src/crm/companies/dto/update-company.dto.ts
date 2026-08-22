import { PartialType } from "@nestjs/common";
import { CreateCompanyDto } from "./create-company.dto";
export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
