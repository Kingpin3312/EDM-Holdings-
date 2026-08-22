import { PartialType } from "@nestjs/common";
import { CreateSupplierDto } from "./create-supplier.dto";
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
