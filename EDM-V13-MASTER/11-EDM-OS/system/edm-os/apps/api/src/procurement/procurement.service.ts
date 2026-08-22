import { Injectable } from "@nestjs/common";
import { PoStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";

@Injectable()
export class ProcurementService {
  constructor(private prisma: PrismaService) {}

  async summary(orgId: string, projectId?: string) {
    const where = tenantWhere(orgId, projectId ? { projectId } : {});
    const [open, committed, received, suppliers] = await Promise.all([
      this.prisma.purchaseOrder.count({ where: { ...where, status: { in: [PoStatus.ISSUED, PoStatus.PARTIALLY_RECEIVED] } } }),
      this.prisma.purchaseOrder.aggregate({ where: { ...where, status: { notIn: [PoStatus.DRAFT, PoStatus.CANCELLED] } }, _sum: { total: true } }),
      this.prisma.purchaseOrder.aggregate({ where: { ...where, status: PoStatus.RECEIVED }, _sum: { total: true } }),
      this.prisma.supplier.count({ where: tenantWhere(orgId, {}) }),
    ]);
    return {
      openPurchaseOrders: open,
      committedSpend: Number(committed._sum.total ?? 0),
      receivedValue: Number(received._sum.total ?? 0),
      suppliers,
    };
  }
}
