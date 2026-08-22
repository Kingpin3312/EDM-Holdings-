import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { SnagStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateSnagDto } from "./dto/create-snag.dto";
import { UpdateSnagDto } from "./dto/update-snag.dto";

// Snag has no organisationId — scoped through its Project (project.organisationId).
@Injectable()
export class SnagsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, status?: SnagStatus) {
    return this.prisma.snag.findMany({
      where: { project: { organisationId: orgId }, ...(projectId && { projectId }), ...(status && { status }) },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });
  }

  async get(orgId: string, id: string) {
    const snag = await this.prisma.snag.findFirst({ where: { id, project: { organisationId: orgId } }, include: { inspection: true } });
    if (!snag) throw new NotFoundException("Snag not found");
    return snag;
  }

  async create(orgId: string, dto: CreateSnagDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { inspectionId, projectId, ...rest } = dto;
    return this.prisma.snag.create({
      data: {
        ...rest,
        project: { connect: { id: projectId } },
        ...(inspectionId ? { inspection: { connect: { id: inspectionId } } } : {}),
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateSnagDto) {
    await this.get(orgId, id);
    // UpdateSnagDto deliberately carries no projectId or inspectionId: moving a
    // snag between projects is not an edit, and allowing it here would cross the
    // organisation boundary that get() has just checked.
    return this.prisma.snag.update({ where: { id }, data: dto });
  }

  async close(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.snag.update({ where: { id }, data: { status: SnagStatus.CLOSED, closedAt: new Date() } });
  }
}
