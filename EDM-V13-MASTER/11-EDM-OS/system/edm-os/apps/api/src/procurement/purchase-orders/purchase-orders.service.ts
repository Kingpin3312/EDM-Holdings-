import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PoStatus } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreatePoDto, PoLineDto } from "./dto/create-po.dto";
import { UpdatePoDto } from "./dto/update-po.dto";
import { ReceiveDto } from "./dto/receive.dto";

const r2 = (n: number) => Math.round(n * 100) / 100;

@Injectable()
export class PurchaseOrdersService {
  constructor(private prisma: PrismaService) {}

  private async assertSupplierInOrg(orgId: string, supplierId: string) {
    const s = await this.prisma.supplier.findFirst({ where: { id: supplierId, organisationId: orgId }, select: { id: true } });
    if (!s) throw new BadRequestException("Supplier not in your organisation");
  }
  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  private async recomputeTotal(poId: string) {
    const lines = await this.prisma.purchaseOrderLine.findMany({ where: { purchaseOrderId: poId }, select: { qty: true, unitPrice: true } });
    const total = r2(lines.reduce((s, l) => s + Number(l.qty) * Number(l.unitPrice), 0));
    await this.prisma.purchaseOrder.update({ where: { id: poId }, data: { total } });
    return total;
  }

  list(orgId: string, projectId?: string, status?: PoStatus, supplierId?: string) {
    return this.prisma.purchaseOrder.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(status && { status }), ...(supplierId && { supplierId }) }),
      include: { supplier: { select: { id: true, name: true } }, project: { select: { code: true } }, _count: { select: { lines: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const po = await this.prisma.purchaseOrder.findFirst({ where: { id, organisationId: orgId }, include: { supplier: true, project: true, lines: true } });
    if (!po) throw new NotFoundException("Purchase order not found");
    return po;
  }

  async create(orgId: string, dto: CreatePoDto) {
    await this.assertSupplierInOrg(orgId, dto.supplierId);
    if (dto.projectId) await this.assertProjectInOrg(orgId, dto.projectId);
    const { supplierId, projectId, lines, ...rest } = dto;
    const po = await this.prisma.purchaseOrder.create({
      data: {
        ...rest, organisation: { connect: { id: orgId } }, supplier: { connect: { id: supplierId } }, project: projectId ? { connect: { id: projectId } } : undefined,
        lines: lines?.length ? { create: lines.map((l: PoLineDto) => ({ description: l.description, qty: l.qty, unit: l.unit, unitPrice: l.unitPrice })) } : undefined,
      },
    });
    await this.recomputeTotal(po.id);
    return this.get(orgId, po.id);
  }

  async update(orgId: string, id: string, dto: UpdatePoDto) {
    await this.get(orgId, id);
    const { expectedAt, ...rest } = dto;
    return this.prisma.purchaseOrder.update({ where: { id }, data: { ...rest, expectedAt: expectedAt ? new Date(expectedAt) : undefined } });
  }

  async addLine(orgId: string, id: string, line: PoLineDto) {
    await this.get(orgId, id);
    await this.prisma.purchaseOrderLine.create({ data: { ...line, purchaseOrder: { connect: { id } } } });
    await this.recomputeTotal(id);
    return this.get(orgId, id);
  }

  async issue(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.purchaseOrder.update({ where: { id }, data: { status: PoStatus.ISSUED, issuedAt: new Date() } });
  }

  // Record goods received against lines; set PO status from fulfilment.
  async receive(orgId: string, id: string, dto: ReceiveDto) {
    const po = await this.get(orgId, id);
    for (const r of dto.receipts) {
      const line = po.lines.find((l) => l.id === r.lineId);
      if (!line) throw new BadRequestException(`Line ${r.lineId} not on this PO`);
      const newReceived = Math.min(Number(line.qty), Number(line.receivedQty) + r.quantity);
      await this.prisma.purchaseOrderLine.update({ where: { id: line.id }, data: { receivedQty: newReceived } });
    }
    const lines = await this.prisma.purchaseOrderLine.findMany({ where: { purchaseOrderId: id } });
    const allReceived = lines.every((l) => Number(l.receivedQty) >= Number(l.qty));
    const anyReceived = lines.some((l) => Number(l.receivedQty) > 0);
    const status = allReceived ? PoStatus.RECEIVED : anyReceived ? PoStatus.PARTIALLY_RECEIVED : po.status;
    await this.prisma.purchaseOrder.update({ where: { id }, data: { status } });
    return this.get(orgId, id);
  }
}
