import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateCostCodeDto, UpdateCostCodeDto } from "./dto/cost-code.dto";

@Injectable()
export class CostCodesService {
  constructor(private prisma: PrismaService) {}
  list(orgId: string) { return this.prisma.costCode.findMany({ where: tenantWhere(orgId, {}), orderBy: { code: "asc" } }); }
  create(orgId: string, dto: CreateCostCodeDto) { return this.prisma.costCode.create({ data: { ...dto, organisation: { connect: { id: orgId } } } }); }
  async update(orgId: string, id: string, dto: UpdateCostCodeDto) {
    const c = await this.prisma.costCode.findFirst({ where: { id, organisationId: orgId } });
    if (!c) throw new NotFoundException("Cost code not found");
    return this.prisma.costCode.update({ where: { id }, data: dto });
  }
}
