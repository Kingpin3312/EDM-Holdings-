import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { IncidentType, Severity } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, type?: IncidentType) {
    return this.prisma.incident.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(type && { type }) }),
      include: { project: { select: { code: true, name: true } } },
      orderBy: { occurredAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const inc = await this.prisma.incident.findFirst({ where: { id, organisationId: orgId }, include: { project: true } });
    if (!inc) throw new NotFoundException("Incident not found");
    return inc;
  }

  async create(orgId: string, dto: CreateIncidentDto) {
    if (dto.projectId) await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, occurredAt, ...rest } = dto;
    return this.prisma.incident.create({
      data: { ...rest, occurredAt: new Date(occurredAt), organisation: { connect: { id: orgId } }, project: projectId ? { connect: { id: projectId } } : undefined },
    });
  }

  async update(orgId: string, id: string, dto: UpdateIncidentDto) {
    await this.get(orgId, id);
    return this.prisma.incident.update({ where: { id }, data: dto });
  }
}
