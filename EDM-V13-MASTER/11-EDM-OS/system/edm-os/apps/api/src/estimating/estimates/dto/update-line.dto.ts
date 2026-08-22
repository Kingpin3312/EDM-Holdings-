import { PartialType } from "@nestjs/common";
import { CreateLineDto } from "./create-line.dto";
export class UpdateLineDto extends PartialType(CreateLineDto) {}
