import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { Trade } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";

// TradeProgress has no organisationId — scoped through its Project. One flexible
// table serves every trade; trade-specific metrics live in `attributes`.
@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, trade?: Trade) {
    return this.prisma.tradeProgress.findMany({
      where: { project: { organisationId: orgId }, ...(projectId && { projectId }), ...(trade && { trade }) },
      orderBy: { date: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const tp = await this.prisma.tradeProgress.findFirst({ where: { id, project: { organisationId: orgId } } });
    if (!tp) throw new NotFoundException("Trade progress record not found");
    return tp;
  }

  async create(orgId: string, dto: CreateProgressDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, date, attributes, ...rest } = dto;
    return this.prisma.tradeProgress.create({
      data: { ...rest, attributes: attributes as object | undefined, date: date ? new Date(date) : undefined, project: { connect: { id: projectId } } },
    });
  }

  async update(orgId: string, id: string, dto: UpdateProgressDto) {
    await this.get(orgId, id);
    const { attributes, ...rest } = dto;
    return this.prisma.tradeProgress.update({ where: { id }, data: { ...rest, attributes: attributes as object | undefined } });
  }

  // Installed quantity rolled up by trade — the core "how much is in" view.
  async summary(orgId: string, projectId?: string) {
    const grouped = await this.prisma.tradeProgress.groupBy({
      by: ["trade", "unit"],
      where: { project: { organisationId: orgId }, ...(projectId && { projectId }) },
      _sum: { quantity: true },
      _count: true,
    });
    return grouped.map((g) => ({ trade: g.trade, unit: g.unit, installed: Number(g._sum.quantity ?? 0), records: g._count }));
  }
}
