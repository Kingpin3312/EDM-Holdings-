import { Injectable, NotFoundException } from "@nestjs/common";
import { Trade } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateCostItemDto } from "./dto/create-cost-item.dto";
import { UpdateCostItemDto } from "./dto/update-cost-item.dto";

// The cost library — reusable priced items the estimator pulls into estimates.
@Injectable()
export class CostItemsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, trade?: Trade) {
    return this.prisma.costItem.findMany({
      where: tenantWhere(orgId, trade ? { trade } : {}),
      include: { rates: { orderBy: { validFrom: "desc" }, take: 1 } },
      orderBy: { code: "asc" },
    });
  }

  async get(orgId: string, id: string) {
    const item = await this.prisma.costItem.findFirst({ where: { id, organisationId: orgId }, include: { rates: true } });
    if (!item) throw new NotFoundException("Cost item not found");
    return item;
  }

  create(orgId: string, dto: CreateCostItemDto) {
    return this.prisma.costItem.create({ data: { ...dto, organisation: { connect: { id: orgId } } } });
  }

  async update(orgId: string, id: string, dto: UpdateCostItemDto) {
    await this.get(orgId, id);
    return this.prisma.costItem.update({ where: { id }, data: dto });
  }
}
