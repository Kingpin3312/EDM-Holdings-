import { Injectable, NotFoundException } from "@nestjs/common";
import { RateType } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateRateDto } from "./dto/create-rate.dto";
import { UpdateRateDto } from "./dto/update-rate.dto";

// Labour / material / plant / subcontract / prelim rates, optionally tied to a
// supplier and a cost item, with validity dates so pricing can be kept current.
@Injectable()
export class RatesService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, type?: RateType) {
    return this.prisma.rate.findMany({
      where: tenantWhere(orgId, type ? { type } : {}),
      include: { supplier: { select: { id: true, name: true } }, costItem: { select: { id: true, code: true } } },
      orderBy: { validFrom: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const rate = await this.prisma.rate.findFirst({ where: { id, organisationId: orgId } });
    if (!rate) throw new NotFoundException("Rate not found");
    return rate;
  }

  create(orgId: string, dto: CreateRateDto) {
    const { costItemId, supplierId, validFrom, validTo, ...rest } = dto;
    return this.prisma.rate.create({
      data: {
        ...rest,
        validFrom: validFrom ? new Date(validFrom) : undefined,
        validTo: validTo ? new Date(validTo) : undefined,
        organisation: { connect: { id: orgId } },
        costItem: costItemId ? { connect: { id: costItemId } } : undefined,
        supplier: supplierId ? { connect: { id: supplierId } } : undefined,
      },
    });
  }

  async update(orgId: string, id: string, dto: UpdateRateDto) {
    await this.get(orgId, id);
    const { costItemId, supplierId, validFrom, validTo, ...rest } = dto;
    return this.prisma.rate.update({
      where: { id },
      data: { ...rest, validFrom: validFrom ? new Date(validFrom) : undefined, validTo: validTo ? new Date(validTo) : undefined, supplier: supplierId ? { connect: { id: supplierId } } : undefined },
    });
  }
}
