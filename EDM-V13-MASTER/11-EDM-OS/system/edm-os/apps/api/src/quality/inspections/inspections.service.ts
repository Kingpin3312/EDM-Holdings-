import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InspectionResult } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";

@Injectable()
export class InspectionsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, result?: InspectionResult) {
    return this.prisma.inspection.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(result && { result }) }),
      include: { project: { select: { code: true, name: true } }, inspector: { select: { firstName: true, lastName: true } }, _count: { select: { snags: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const ins = await this.prisma.inspection.findFirst({ where: { id, organisationId: orgId }, include: { project: true, template: true, inspector: true, snags: true } });
    if (!ins) throw new NotFoundException("Inspection not found");
    return ins;
  }

  async create(orgId: string, dto: CreateInspectionDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, templateId, inspectorId, inspectedAt, responses, ...rest } = dto;
    return this.prisma.inspection.create({
      data: {
        ...rest, responses: responses as object | undefined, inspectedAt: inspectedAt ? new Date(inspectedAt) : undefined,
        organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } },
        template: templateId ? { connect: { id: templateId } } : undefined,
        inspector: inspectorId ? { connect: { id: inspectorId } } : undefined,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateInspectionDto) {
    await this.get(orgId, id);
    const { inspectedAt, responses, ...rest } = dto;
    return this.prisma.inspection.update({ where: { id }, data: { ...rest, responses: responses as object | undefined, inspectedAt: inspectedAt ? new Date(inspectedAt) : undefined } });
  }
}
