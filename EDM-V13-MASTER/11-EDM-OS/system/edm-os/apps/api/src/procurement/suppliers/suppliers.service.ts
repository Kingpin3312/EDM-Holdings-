import { Injectable, NotFoundException } from "@nestjs/common";
import { Trade } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, trade?: Trade) {
    return this.prisma.supplier.findMany({
      where: tenantWhere(orgId, trade ? { trade } : {}),
      include: { _count: { select: { purchaseOrders: true } } },
      orderBy: { name: "asc" },
    });
  }

  async get(orgId: string, id: string) {
    const s = await this.prisma.supplier.findFirst({ where: { id, organisationId: orgId }, include: { purchaseOrders: { orderBy: { createdAt: "desc" }, take: 10 } } });
    if (!s) throw new NotFoundException("Supplier not found");
    return s;
  }

  create(orgId: string, dto: CreateSupplierDto) {
    return this.prisma.supplier.create({ data: { ...dto, organisation: { connect: { id: orgId } } } });
  }

  async update(orgId: string, id: string, dto: UpdateSupplierDto) {
    await this.get(orgId, id);
    return this.prisma.supplier.update({ where: { id }, data: dto });
  }
}
