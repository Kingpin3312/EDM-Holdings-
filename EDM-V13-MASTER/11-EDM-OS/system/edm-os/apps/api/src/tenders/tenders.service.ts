import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TenderStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { assertOwned } from "../common/tenant";
import { CreateTenderDto } from "./dto/create-tender.dto";
import { UpdateTenderDto } from "./dto/update-tender.dto";

// Every method is scoped to organisationId — the tenant boundary.
@Injectable()
export class TendersService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, status?: TenderStatus) {
    return this.prisma.tender.findMany({
      where: { organisationId: orgId, ...(status ? { status } : {}) },
      include: { client: true, mainContractor: true },
      orderBy: { dueDate: "asc" },
    });
  }

  async get(orgId: string, id: string) {
    const tender = await this.prisma.tender.findFirst({
      where: { id, organisationId: orgId },
      include: { client: true, consultant: true, mainContractor: true, estimates: true, events: { orderBy: { createdAt: "desc" } } },
    });
    if (!tender) throw new NotFoundException("Tender not found");
    return tender;
  }

  create(orgId: string, dto: CreateTenderDto) {
    const data: Prisma.TenderCreateInput = {
      organisation: { connect: { id: orgId } },
      tenderNo: dto.tenderNo,
      projectName: dto.projectName,
      trades: dto.trades ?? [],
      value: dto.value,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      status: dto.status,
      awardProbability: dto.awardProbability,
      notes: dto.notes,
      client: dto.clientId ? { connect: { id: dto.clientId } } : undefined,
      consultant: dto.consultantId ? { connect: { id: dto.consultantId } } : undefined,
      mainContractor: dto.mainContractorId ? { connect: { id: dto.mainContractorId } } : undefined,
    };
    return this.prisma.tender.create({ data });
  }

  async update(orgId: string, id: string, dto: UpdateTenderDto) {
    await this.get(orgId, id); // ownership check
    const { clientId, consultantId, mainContractorId, dueDate, ...rest } = dto;
    await assertOwned(this.prisma, orgId, { company: clientId });
    await assertOwned(this.prisma, orgId, { company: consultantId });
    await assertOwned(this.prisma, orgId, { company: mainContractorId });
    return this.prisma.tender.update({
      where: { id },
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        client: clientId ? { connect: { id: clientId } } : undefined,
        consultant: consultantId ? { connect: { id: consultantId } } : undefined,
        mainContractor: mainContractorId ? { connect: { id: mainContractorId } } : undefined,
      },
    });
  }

  // Status transition writes an immutable audit event — the tender history.
  async moveStatus(orgId: string, id: string, status: TenderStatus, note?: string) {
    await this.get(orgId, id);
    return this.prisma.$transaction([
      this.prisma.tender.update({ where: { id }, data: { status } }),
      this.prisma.tenderEvent.create({ data: { tenderId: id, status, note } }),
    ]);
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.tender.delete({ where: { id } });
  }

  // Weighted pipeline value = sum(value * awardProbability%) for live tenders.
  async pipeline(orgId: string) {
    const live = await this.prisma.tender.findMany({
      where: { organisationId: orgId, status: { in: [TenderStatus.IN_PROGRESS, TenderStatus.SUBMITTED, TenderStatus.SHORTLISTED] } },
      select: { value: true, awardProbability: true },
    });
    const weighted = live.reduce((s, t) => s + Number(t.value ?? 0) * (t.awardProbability / 100), 0);
    const gross = live.reduce((s, t) => s + Number(t.value ?? 0), 0);
    return { count: live.length, grossValue: gross, weightedValue: weighted };
  }
}
