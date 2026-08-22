import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, ProjectStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { assertOwned } from "../common/tenant";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, status?: ProjectStatus) {
    return this.prisma.project.findMany({
      where: { organisationId: orgId, ...(status ? { status } : {}) },
      include: { client: true, manager: true, _count: { select: { rfis: true, variations: true, tasks: true } } },
      orderBy: { updatedAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, organisationId: orgId },
      include: { client: true, manager: true, milestones: true, phases: { include: { tasks: true } } },
    });
    if (!project) throw new NotFoundException("Project not found");
    return project;
  }

  create(orgId: string, dto: CreateProjectDto) {
    const data: Prisma.ProjectCreateInput = {
      organisation: { connect: { id: orgId } },
      code: dto.code,
      name: dto.name,
      trades: dto.trades ?? [],
      status: dto.status,
      contractValue: dto.contractValue,
      emirate: dto.emirate,
      location: dto.location,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      client: dto.clientId ? { connect: { id: dto.clientId } } : undefined,
      tender: dto.tenderId ? { connect: { id: dto.tenderId } } : undefined,
      manager: dto.managerUserId ? { connect: { id: dto.managerUserId } } : undefined,
    };
    return this.prisma.project.create({ data });
  }

  async update(orgId: string, id: string, dto: UpdateProjectDto) {
    await this.get(orgId, id);
    const { clientId, tenderId, managerUserId, startDate, endDate, ...rest } = dto;
    await assertOwned(this.prisma, orgId, { company: clientId, tender: tenderId, user: managerUserId });
    return this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        client: clientId ? { connect: { id: clientId } } : undefined,
        tender: tenderId ? { connect: { id: tenderId } } : undefined,
        manager: managerUserId ? { connect: { id: managerUserId } } : undefined,
      },
    });
  }

  // Earned-value style summary for the project dashboard.
  async financials(orgId: string, id: string) {
    await this.get(orgId, id);
    const [budget, invoiced] = await Promise.all([
      this.prisma.budget.aggregate({ where: { projectId: id }, _sum: { budgetAmount: true, committedAmount: true, actualAmount: true } }),
      this.prisma.invoice.aggregate({ where: { projectId: id }, _sum: { netAmount: true } }),
    ]);
    const b = budget._sum;
    return {
      budget: Number(b.budgetAmount ?? 0),
      committed: Number(b.committedAmount ?? 0),
      actual: Number(b.actualAmount ?? 0),
      invoicedNet: Number(invoiced._sum.netAmount ?? 0),
      varianceToBudget: Number(b.budgetAmount ?? 0) - Number(b.actualAmount ?? 0),
    };
  }
}
