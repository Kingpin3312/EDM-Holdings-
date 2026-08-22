import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { NcrStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateNcrDto } from "./dto/create-ncr.dto";
import { UpdateNcrDto } from "./dto/update-ncr.dto";

@Injectable()
export class NcrsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, status?: NcrStatus) {
    return this.prisma.ncr.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(status && { status }) }),
      include: { project: { select: { code: true, name: true } } },
      orderBy: [{ severity: "desc" }, { createdAt: "desc" }],
    });
  }

  async get(orgId: string, id: string) {
    const ncr = await this.prisma.ncr.findFirst({ where: { id, organisationId: orgId }, include: { project: true } });
    if (!ncr) throw new NotFoundException("NCR not found");
    return ncr;
  }

  async create(orgId: string, dto: CreateNcrDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, ...rest } = dto;
    return this.prisma.ncr.create({ data: { ...rest, organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } } } });
  }

  async update(orgId: string, id: string, dto: UpdateNcrDto) {
    await this.get(orgId, id);
    return this.prisma.ncr.update({ where: { id }, data: dto });
  }

  // Log the corrective action and move the NCR into remediation.
  async correctiveAction(orgId: string, id: string, action: string) {
    await this.get(orgId, id);
    return this.prisma.ncr.update({ where: { id }, data: { correctiveAction: action, status: NcrStatus.CORRECTIVE_ACTION } });
  }

  async close(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.ncr.update({ where: { id }, data: { status: NcrStatus.CLOSED, closedAt: new Date() } });
  }
}
