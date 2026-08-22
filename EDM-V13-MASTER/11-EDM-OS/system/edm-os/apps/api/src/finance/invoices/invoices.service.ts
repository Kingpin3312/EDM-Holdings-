import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InvoiceStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateInvoiceDto, UpdateInvoiceDto } from "./dto/invoice.dto";

// Applications for payment / invoices. Net = gross − retention (computed if not
// supplied). OVERDUE is derived (submitted/certified, past due, unpaid).
const isOverdue = (i: { status: InvoiceStatus; dueAt: Date | null; paidAt: Date | null }) =>
  (i.status === InvoiceStatus.SUBMITTED || i.status === InvoiceStatus.CERTIFIED) && !i.paidAt && !!i.dueAt && i.dueAt.getTime() < Date.now();

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  async list(orgId: string, projectId?: string, status?: InvoiceStatus) {
    const invoices = await this.prisma.invoice.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(status && { status }) }),
      include: { project: { select: { code: true } } },
      orderBy: { createdAt: "desc" },
    });
    return invoices.map((i) => ({ ...i, overdue: isOverdue(i) }));
  }

  async get(orgId: string, id: string) {
    const inv = await this.prisma.invoice.findFirst({ where: { id, organisationId: orgId }, include: { project: true } });
    if (!inv) throw new NotFoundException("Invoice not found");
    return { ...inv, overdue: isOverdue(inv) };
  }

  async create(orgId: string, dto: CreateInvoiceDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, dueAt, grossAmount, retentionAmount = 0, netAmount, ...rest } = dto;
    return this.prisma.invoice.create({
      data: { ...rest, grossAmount, retentionAmount, netAmount: netAmount ?? grossAmount - retentionAmount, dueAt: dueAt ? new Date(dueAt) : undefined, organisation: { connect: { id: orgId } }, project: { connect: { id: projectId } } },
    });
  }

  async update(orgId: string, id: string, dto: UpdateInvoiceDto) {
    await this.get(orgId, id);
    const { dueAt, ...rest } = dto;
    return this.prisma.invoice.update({ where: { id }, data: { ...rest, dueAt: dueAt ? new Date(dueAt) : undefined } });
  }

  async submit(orgId: string, id: string) { await this.get(orgId, id); return this.prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.SUBMITTED, issuedAt: new Date() } }); }
  async certify(orgId: string, id: string) { await this.get(orgId, id); return this.prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.CERTIFIED } }); }
  async markPaid(orgId: string, id: string) { await this.get(orgId, id); return this.prisma.invoice.update({ where: { id }, data: { status: InvoiceStatus.PAID, paidAt: new Date() } }); }
}
