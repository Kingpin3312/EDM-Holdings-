import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTemplateDto } from "./dto/create-template.dto";

// Checklist templates are a shared library (no per-org scope in the schema yet).
@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.checklistTemplate.findMany({ orderBy: { name: "asc" } }); }
  create(dto: CreateTemplateDto) { return this.prisma.checklistTemplate.create({ data: { name: dto.name, trade: dto.trade, items: dto.items as object } }); }
}
