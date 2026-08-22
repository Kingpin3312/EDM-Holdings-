import { Injectable, NotFoundException } from "@nestjs/common";
import { LeadStage, OpportunityStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { ConvertLeadDto } from "./dto/convert-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, stage?: LeadStage) {
    return this.prisma.lead.findMany({
      where: tenantWhere(orgId, stage ? { stage } : {}),
      include: { company: { select: { id: true, name: true, type: true } }, _count: { select: { activities: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, organisationId: orgId },
      include: { company: true, opportunities: true, activities: { orderBy: { createdAt: "desc" } } },
    });
    if (!lead) throw new NotFoundException("Lead not found");
    return lead;
  }

  // Open leads whose follow-up is due (or overdue) — drives the CRM reminders.
  followUpsDue(orgId: string, withinDays = 7) {
    const horizon = new Date(Date.now() + withinDays * 864e5);
    return this.prisma.lead.findMany({
      where: {
        organisationId: orgId,
        stage: { notIn: [LeadStage.WON, LeadStage.LOST] },
        nextFollowUpAt: { not: null, lte: horizon },
      },
      include: { company: { select: { name: true } } },
      orderBy: { nextFollowUpAt: "asc" },
    });
  }

  create(orgId: string, dto: CreateLeadDto) {
    const { companyId, nextFollowUpAt, ...rest } = dto;
    return this.prisma.lead.create({
      data: {
        ...rest,
        nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : undefined,
        organisation: { connect: { id: orgId } },
        company: companyId ? { connect: { id: companyId } } : undefined,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateLeadDto) {
    await this.get(orgId, id);
    const { companyId, nextFollowUpAt, ...rest } = dto;
    return this.prisma.lead.update({
      where: { id },
      data: { ...rest, nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : undefined, company: companyId ? { connect: { id: companyId } } : undefined },
    });
  }

  // Qualify a lead into the opportunity pipeline (atomic): create the
  // opportunity, then mark the lead WON so it leaves the lead funnel.
  async convert(orgId: string, id: string, dto: ConvertLeadDto) {
    const lead = await this.get(orgId, id);
    const [opportunity] = await this.prisma.$transaction([
      this.prisma.opportunity.create({
        data: {
          organisation: { connect: { id: orgId } },
          name: dto.name ?? lead.title,
          value: dto.value,
          probability: dto.probability ?? 20,
          status: OpportunityStatus.OPEN,
          expectedClose: dto.expectedClose ? new Date(dto.expectedClose) : undefined,
          company: lead.companyId ? { connect: { id: lead.companyId } } : undefined,
          lead: { connect: { id: lead.id } },
        },
      }),
      this.prisma.lead.update({ where: { id }, data: { stage: LeadStage.WON } }),
    ]);
    return opportunity;
  }
}
