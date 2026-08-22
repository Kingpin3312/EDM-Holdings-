import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateToolboxDto } from "./dto/create-toolbox.dto";
import { UpdateToolboxDto } from "./dto/update-toolbox.dto";

@Injectable()
export class ToolboxService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string) {
    return this.prisma.toolboxTalk.findMany({
      where: tenantWhere(orgId, projectId ? { projectId } : {}),
      include: { project: { select: { code: true } } },
      orderBy: { conductedAt: "desc" },
    });
  }

  async create(orgId: string, dto: CreateToolboxDto) {
    if (dto.projectId) await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, conductedAt, ...rest } = dto;
    return this.prisma.toolboxTalk.create({ data: { ...rest, conductedAt: new Date(conductedAt), organisation: { connect: { id: orgId } }, project: projectId ? { connect: { id: projectId } } : undefined } });
  }

  async update(orgId: string, id: string, dto: UpdateToolboxDto) {
    const t = await this.prisma.toolboxTalk.findFirst({ where: { id, organisationId: orgId } });
    if (!t) throw new NotFoundException("Toolbox talk not found");
    return this.prisma.toolboxTalk.update({ where: { id }, data: dto });
  }
}
