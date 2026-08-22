import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto/budget.dto";

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string) {
    return this.prisma.budget.findMany({
      where: tenantWhere(orgId, projectId ? { projectId } : {}),
      include: { costCode: { select: { code: true, trade: true } }, project: { select: { code: true } } },
      orderBy: { description: "asc" },
    });
  }

  async create(orgId: string, dto: CreateBudgetDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, costCodeId, ...rest } = dto;
    return this.prisma.budget.create({ data: { ...rest, organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } }, costCode: costCodeId ? { connect: { id: costCodeId } } : undefined } });
  }

  async update(orgId: string, id: string, dto: UpdateBudgetDto) {
    const b = await this.prisma.budget.findFirst({ where: { id, organisationId: orgId } });
    if (!b) throw new NotFoundException("Budget line not found");
    return this.prisma.budget.update({ where: { id }, data: dto });
  }
}
