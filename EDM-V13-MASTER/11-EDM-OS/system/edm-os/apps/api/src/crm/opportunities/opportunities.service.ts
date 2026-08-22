import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { OpportunityStatus, OpportunityStage, ActivityType, ProjectStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { SettingsService } from "../../settings/settings.service";
import { tenantWhere } from "../../common/tenant";
import { CreateOpportunityDto } from "./dto/create-opportunity.dto";
import { UpdateOpportunityDto } from "./dto/update-opportunity.dto";
import { ConvertToProjectDto } from "./dto/convert-to-project.dto";

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService, private settings: SettingsService) {}

  list(orgId: string, status?: OpportunityStatus, stage?: OpportunityStage) {
    return this.prisma.opportunity.findMany({
      where: tenantWhere(orgId, { ...(status && { status }), ...(stage && { stage }) }),
      include: { company: { select: { id: true, name: true } } },
      orderBy: { expectedClose: "asc" },
    });
  }

  async get(orgId: string, id: string) {
    const opp = await this.prisma.opportunity.findFirst({ where: { id, organisationId: orgId }, include: { company: true, lead: true, activities: { orderBy: { createdAt: "desc" } }, tender: true } });
    if (!opp) throw new NotFoundException("Opportunity not found");
    return opp;
  }

  create(orgId: string, dto: CreateOpportunityDto) {
    const { companyId, leadId, expectedClose, ...rest } = dto;
    return this.prisma.opportunity.create({
      data: {
        ...rest,
        expectedClose: expectedClose ? new Date(expectedClose) : undefined,
        organisation: { connect: { id: orgId } },
        company: companyId ? { connect: { id: companyId } } : undefined,
        lead: leadId ? { connect: { id: leadId } } : undefined,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateOpportunityDto) {
    await this.get(orgId, id);
    const { companyId, leadId, expectedClose, ...rest } = dto;
    return this.prisma.opportunity.update({
      where: { id },
      data: { ...rest, expectedClose: expectedClose ? new Date(expectedClose) : undefined, company: companyId ? { connect: { id: companyId } } : undefined },
    });
  }

  // Move an opportunity along the pipeline. Allowed moves come from the org's
  // config (crmPipeline.transitions) — not hardcoded — and the move is logged
  // as an activity so the history is captured.
  async moveStage(orgId: string, id: string, stage: OpportunityStage) {
    const opp = await this.get(orgId, id);
    if (opp.stage === stage) return opp;
    const config = await this.settings.getOrCreate(orgId);
    const allowed = config.crmPipeline?.transitions?.[opp.stage] ?? [];
    if (!allowed.includes(stage)) {
      throw new BadRequestException(`Cannot move from ${opp.stage} to ${stage}`);
    }
    const [updated] = await this.prisma.$transaction([
      this.prisma.opportunity.update({ where: { id }, data: { stage } }),
      this.prisma.activity.create({
        data: { organisation: { connect: { id: orgId } }, type: ActivityType.NOTE, subject: `Stage changed: ${opp.stage} → ${stage}`, opportunity: { connect: { id } } },
      }),
    ]);
    return updated;
  }

  // Convert a won opportunity into a live project — the sales→delivery handoff.
  // Name, client and contract value carry over so nothing is re-keyed. The
  // opportunity is stamped WON and the handoff is logged on its activity trail.
  // Project code is auto-generated (EDM-P-####) unless the caller overrides it.
  async convertToProject(orgId: string, id: string, dto: ConvertToProjectDto) {
    const opp = await this.get(orgId, id);
    if (opp.status === OpportunityStatus.LOST) {
      throw new BadRequestException("Cannot convert a lost opportunity to a project");
    }
    const count = await this.prisma.project.count({ where: { organisationId: orgId } });
    const code = dto.code ?? `EDM-P-${String(count + 1).padStart(4, "0")}`;
    const [project] = await this.prisma.$transaction([
      this.prisma.project.create({
        data: {
          organisation: { connect: { id: orgId } },
          code,
          name: opp.name,
          status: ProjectStatus.PRECONSTRUCTION,
          contractValue: opp.value,
          emirate: dto.emirate,
          location: dto.location,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          client: opp.companyId ? { connect: { id: opp.companyId } } : undefined,
          manager: dto.managerUserId ? { connect: { id: dto.managerUserId } } : undefined,
        },
      }),
      this.prisma.opportunity.update({ where: { id }, data: { status: OpportunityStatus.WON } }),
      this.prisma.activity.create({
        data: { organisation: { connect: { id: orgId } }, type: ActivityType.NOTE, subject: `Won — converted to project ${code}`, opportunity: { connect: { id } } },
      }),
    ]);
    return project;
  }
  // each with count, gross and weighted value; plus the won rollup.
  async board(orgId: string) {
    const config = await this.settings.getOrCreate(orgId);
    const stages: string[] = config.crmPipeline?.stages ?? ["QUALIFYING", "ENGAGED", "PROPOSAL", "NEGOTIATION"];
    const open = await this.prisma.opportunity.findMany({
      where: tenantWhere(orgId, { status: OpportunityStatus.OPEN }),
      include: { company: { select: { id: true, name: true } } },
      orderBy: { expectedClose: "asc" },
    });
    const columns = stages.map((stage) => {
      const items = open.filter((o) => o.stage === stage);
      const gross = items.reduce((s, o) => s + Number(o.value), 0);
      const weighted = items.reduce((s, o) => s + Number(o.value) * (o.probability / 100), 0);
      return { stage, count: items.length, gross, weighted, items };
    });
    const won = await this.prisma.opportunity.aggregate({ where: tenantWhere(orgId, { status: OpportunityStatus.WON }), _count: true, _sum: { value: true } });
    const totals = {
      gross: columns.reduce((s, c) => s + c.gross, 0),
      weighted: columns.reduce((s, c) => s + c.weighted, 0),
      open: open.length,
    };
    return { columns, totals, won: { count: won._count, value: Number(won._sum.value ?? 0) } };
  }
}
