import { Injectable, NotFoundException } from "@nestjs/common";
import { EstimateStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere, assertOwned } from "../../common/tenant";
import { CreateEstimateDto } from "./dto/create-estimate.dto";
import { UpdateEstimateDto } from "./dto/update-estimate.dto";
import { CreateLineDto } from "./dto/create-line.dto";
import { UpdateLineDto } from "./dto/update-line.dto";
import { priceEstimate, PricingLine } from "./pricing";

@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, status?: EstimateStatus) {
    return this.prisma.estimate.findMany({
      where: tenantWhere(orgId, status ? { status } : {}),
      include: { tender: { select: { id: true, tenderNo: true, projectName: true } }, _count: { select: { lines: true, quotations: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const est = await this.prisma.estimate.findFirst({
      where: { id, organisationId: orgId },
      include: { lines: { orderBy: { sortOrder: "asc" } }, tender: true, quotations: { orderBy: { revision: "desc" } } },
    });
    if (!est) throw new NotFoundException("Estimate not found");
    return est;
  }

  create(orgId: string, dto: CreateEstimateDto) {
    const { tenderId, ...rest } = dto;
    return this.prisma.estimate.create({ data: { ...rest, organisation: { connect: { id: orgId } }, tender: tenderId ? { connect: { id: tenderId } } : undefined } });
  }

  async update(orgId: string, id: string, dto: UpdateEstimateDto) {
    await this.get(orgId, id);
    const { tenderId, ...rest } = dto;
    return this.prisma.estimate.update({ where: { id }, data: { ...rest, tender: tenderId ? { connect: { id: tenderId } } : undefined } });
  }

  // ---- BOQ lines ----
  async addLine(orgId: string, estimateId: string, dto: CreateLineDto) {
    await this.get(orgId, estimateId);
    const { costItemId, ...rest } = dto;
    return this.prisma.estimateLine.create({
      data: {
        ...rest,
        estimate: { connect: { id: estimateId } },
        costItem: costItemId ? { connect: { id: costItemId } } : undefined,
      },
    });
  }

  async updateLine(orgId: string, estimateId: string, lineId: string, dto: UpdateLineDto) {
    await this.get(orgId, estimateId);
    const line = await this.prisma.estimateLine.findFirst({ where: { id: lineId, estimateId } });
    if (!line) throw new NotFoundException("Line not found");
    return this.prisma.estimateLine.update({ where: { id: lineId }, data: dto });
  }

  async removeLine(orgId: string, estimateId: string, lineId: string) {
    await this.get(orgId, estimateId);
    const line = await this.prisma.estimateLine.findFirst({ where: { id: lineId, estimateId } });
    if (!line) throw new NotFoundException("Line not found");
    return this.prisma.estimateLine.delete({ where: { id: lineId } });
  }

  // ---- Pricing summary (cost breakdown + markups + margin) ----
  async summary(orgId: string, id: string) {
    const est = await this.get(orgId, id);
    const lines: PricingLine[] = est.lines.map((l) => ({
      trade: l.trade, qty: Number(l.qty),
      labourRate: Number(l.labourRate), materialRate: Number(l.materialRate), plantRate: Number(l.plantRate), subRate: Number(l.subRate),
    }));
    const priced = priceEstimate({ overheadPct: Number(est.overheadPct), profitPct: Number(est.profitPct), contingencyPct: Number(est.contingencyPct), lines });
    return { estimateId: est.id, ref: est.ref, title: est.title, currency: est.currency, status: est.status, lineCount: est.lines.length, ...priced };
  }

  // ---- Generate a quotation at the current sell price (new revision each time) ----
  async generateQuotation(orgId: string, id: string) {
    const summary = await this.summary(orgId, id);
    const latest = await this.prisma.quotation.findFirst({ where: { estimateId: id }, orderBy: { revision: "desc" } });
    const revision = (latest?.revision ?? -1) + 1;
    return this.prisma.quotation.create({
      data: {
        estimate: { connect: { id } },
        quoteNo: `${summary.ref}-Q`,
        revision,
        total: summary.sellPrice,
        validUntil: new Date(Date.now() + 30 * 864e5),
        issuedAt: new Date(),
      },
    });
  }
}
