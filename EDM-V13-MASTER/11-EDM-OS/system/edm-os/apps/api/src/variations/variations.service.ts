import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { VariationStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { SettingsService } from "../settings/settings.service";
import { tenantWhere } from "../common/tenant";
import { CreateVariationDto } from "./dto/create-variation.dto";
import { UpdateVariationDto } from "./dto/update-variation.dto";

@Injectable()
export class VariationsService {
  constructor(private prisma: PrismaService, private settings: SettingsService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, status?: VariationStatus) {
    return this.prisma.variation.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(status && { status }) }),
      include: { project: { select: { id: true, code: true, name: true } }, raisedBy: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const v = await this.prisma.variation.findFirst({ where: { id, organisationId: orgId }, include: { project: true, raisedBy: true, documents: true } });
    if (!v) throw new NotFoundException("Variation not found");
    return v;
  }

  async create(orgId: string, dto: CreateVariationDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, raisedById, ...rest } = dto;
    return this.prisma.variation.create({
      data: { ...rest, organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } }, raisedBy: raisedById ? { connect: { id: raisedById } } : undefined },
    });
  }

  async update(orgId: string, id: string, dto: UpdateVariationDto) {
    await this.get(orgId, id);
    return this.prisma.variation.update({ where: { id }, data: dto });
  }

  // Status flow is config-driven (variationWorkflow.transitions). Moving to
  // SUBMITTED stamps submittedAt; APPROVED/REJECTED stamp decidedAt.
  async moveStatus(orgId: string, id: string, status: VariationStatus) {
    const v = await this.get(orgId, id);
    if (v.status === status) return v;
    const config = await this.settings.getOrCreate(orgId);
    const allowed = config.variationWorkflow?.transitions?.[v.status] ?? [];
    if (!allowed.includes(status)) throw new BadRequestException(`Cannot move variation from ${v.status} to ${status}`);
    const now = new Date();
    return this.prisma.variation.update({
      where: { id },
      data: {
        status,
        submittedAt: status === VariationStatus.SUBMITTED ? now : undefined,
        decidedAt: status === VariationStatus.APPROVED || status === VariationStatus.REJECTED ? now : undefined,
      },
    });
  }

  // Financial impact: value by status, plus the headline figures a PM/QS needs.
  async summary(orgId: string, projectId?: string) {
    const grouped = await this.prisma.variation.groupBy({
      by: ["status"],
      where: tenantWhere(orgId, projectId ? { projectId } : {}),
      _count: true,
      _sum: { value: true },
    });
    const byStatus: Record<string, { count: number; value: number }> = {};
    for (const g of grouped) byStatus[g.status] = { count: g._count, value: Number(g._sum.value ?? 0) };
    const val = (s: VariationStatus) => byStatus[s]?.value ?? 0;
    return {
      byStatus,
      pendingValue: val(VariationStatus.SUBMITTED) + val(VariationStatus.UNDER_REVIEW),
      approvedValue: val(VariationStatus.APPROVED) + val(VariationStatus.PAID),
      paidValue: val(VariationStatus.PAID),
      rejectedValue: val(VariationStatus.REJECTED),
      totalRaised: Object.values(byStatus).reduce((s, x) => s + x.value, 0),
    };
  }
}
