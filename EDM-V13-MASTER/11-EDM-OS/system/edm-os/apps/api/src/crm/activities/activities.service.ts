import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateActivityDto } from "./dto/create-activity.dto";

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, f: { leadId?: string; opportunityId?: string; contactId?: string; projectId?: string }) {
    return this.prisma.activity.findMany({
      where: tenantWhere(orgId, { ...(f.leadId && { leadId: f.leadId }), ...(f.opportunityId && { opportunityId: f.opportunityId }), ...(f.contactId && { contactId: f.contactId }), ...(f.projectId && { projectId: f.projectId }) }),
      orderBy: { createdAt: "desc" },
    });
  }

  create(orgId: string, dto: CreateActivityDto) {
    const { dueAt, ...rest } = dto;
    return this.prisma.activity.create({ data: { ...rest, dueAt: dueAt ? new Date(dueAt) : undefined, organisation: { connect: { id: orgId } } } });
  }

  async complete(orgId: string, id: string) {
    const act = await this.prisma.activity.findFirst({ where: { id, organisationId: orgId } });
    if (!act) throw new NotFoundException("Activity not found");
    return this.prisma.activity.update({ where: { id }, data: { completedAt: new Date() } });
  }

  // Open tasks/activities with a due date — the "what's next" feed.
  upcoming(orgId: string) {
    return this.prisma.activity.findMany({
      where: tenantWhere(orgId, { completedAt: null, dueAt: { not: null } }),
      orderBy: { dueAt: "asc" },
      take: 50,
    });
  }
}
