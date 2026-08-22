import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateRiskDto } from "./dto/create-risk.dto";
import { UpdateRiskDto } from "./dto/update-risk.dto";

@Injectable()
export class RiskService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string) {
    return this.prisma.riskAssessment.findMany({
      where: tenantWhere(orgId, projectId ? { projectId } : {}),
      include: { project: { select: { code: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const ra = await this.prisma.riskAssessment.findFirst({ where: { id, organisationId: orgId }, include: { project: true } });
    if (!ra) throw new NotFoundException("Risk assessment not found");
    return ra;
  }

  async create(orgId: string, dto: CreateRiskDto) {
    if (dto.projectId) await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, hazards, reviewedAt, ...rest } = dto;
    return this.prisma.riskAssessment.create({
      data: { ...rest, hazards: hazards as object, reviewedAt: reviewedAt ? new Date(reviewedAt) : undefined, organisation: { connect: { id: orgId } }, project: projectId ? { connect: { id: projectId } } : undefined },
    });
  }

  async update(orgId: string, id: string, dto: UpdateRiskDto) {
    await this.get(orgId, id);
    const { hazards, reviewedAt, ...rest } = dto;
    return this.prisma.riskAssessment.update({ where: { id }, data: { ...rest, hazards: hazards as object | undefined, reviewedAt: reviewedAt ? new Date(reviewedAt) : undefined } });
  }
}
