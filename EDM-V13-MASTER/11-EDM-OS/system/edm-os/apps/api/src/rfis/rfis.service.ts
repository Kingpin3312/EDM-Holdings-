import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { RfiStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";
import { CreateRfiDto } from "./dto/create-rfi.dto";
import { UpdateRfiDto } from "./dto/update-rfi.dto";

// "Overdue" is derived (OPEN + past due) rather than stored, so it is always
// accurate without a cron. In production a scheduled job (n8n) can additionally
// flip status to OVERDUE for reporting; the read model here does not depend on it.
const isOverdue = (r: { status: RfiStatus; dueDate: Date | null }) =>
  r.status === RfiStatus.OPEN && !!r.dueDate && r.dueDate.getTime() < Date.now();

@Injectable()
export class RfisService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  async list(orgId: string, projectId?: string, status?: RfiStatus) {
    const rfis = await this.prisma.rfi.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(status && { status }) }),
      include: { project: { select: { id: true, code: true, name: true } }, raisedBy: { select: { firstName: true, lastName: true } } },
      orderBy: [{ status: "asc" }, { dueDate: "asc" }],
    });
    return rfis.map((r) => ({ ...r, overdue: isOverdue(r) }));
  }

  async get(orgId: string, id: string) {
    const rfi = await this.prisma.rfi.findFirst({ where: { id, organisationId: orgId }, include: { project: true, raisedBy: true, documents: true } });
    if (!rfi) throw new NotFoundException("RFI not found");
    return { ...rfi, overdue: isOverdue(rfi) };
  }

  async create(orgId: string, dto: CreateRfiDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, raisedById, dueDate, ...rest } = dto;
    return this.prisma.rfi.create({
      data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined, organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } }, raisedBy: raisedById ? { connect: { id: raisedById } } : undefined },
    });
  }

  async update(orgId: string, id: string, dto: UpdateRfiDto) {
    await this.get(orgId, id);
    const { dueDate, ...rest } = dto;
    return this.prisma.rfi.update({ where: { id }, data: { ...rest, dueDate: dueDate ? new Date(dueDate) : undefined } });
  }

  // Answer an RFI — records the response and stamps the turnaround.
  async respond(orgId: string, id: string, response: string) {
    await this.get(orgId, id);
    return this.prisma.rfi.update({ where: { id }, data: { response, status: RfiStatus.ANSWERED, answeredAt: new Date() } });
  }

  async close(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.rfi.update({ where: { id }, data: { status: RfiStatus.CLOSED } });
  }

  async overdue(orgId: string, projectId?: string) {
    const open = await this.prisma.rfi.findMany({
      where: tenantWhere(orgId, { status: RfiStatus.OPEN, dueDate: { not: null, lt: new Date() }, ...(projectId && { projectId }) }),
      include: { project: { select: { code: true } } },
      orderBy: { dueDate: "asc" },
    });
    return open;
  }

  async summary(orgId: string, projectId?: string) {
    const where = tenantWhere(orgId, projectId ? { projectId } : {});
    const [open, answered, closed, overdueCount] = await Promise.all([
      this.prisma.rfi.count({ where: { ...where, status: RfiStatus.OPEN } }),
      this.prisma.rfi.count({ where: { ...where, status: RfiStatus.ANSWERED } }),
      this.prisma.rfi.count({ where: { ...where, status: RfiStatus.CLOSED } }),
      this.prisma.rfi.count({ where: { ...where, status: RfiStatus.OPEN, dueDate: { not: null, lt: new Date() } } }),
    ]);
    return { open, answered, closed, overdue: overdueCount, total: open + answered + closed };
  }
}
