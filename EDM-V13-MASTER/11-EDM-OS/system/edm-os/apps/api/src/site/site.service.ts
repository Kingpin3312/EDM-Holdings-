import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDailyReportDto } from "./dto/create-daily-report.dto";
import { UpdateDailyReportDto } from "./dto/update-daily-report.dto";
import { LabourEntryDto, PlantEntryDto, DeliveryEntryDto } from "./dto/entries.dto";
import { claimRegisterSummary, claimValue } from "./reports";

const r2 = (n: number) => Math.round(n * 100) / 100;

// DailyReport is scoped THROUGH its Project (project.organisationId), like the
// CRM contact-through-company pattern. Every query enforces that boundary.
@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, from?: string, to?: string) {
    return this.prisma.dailyReport.findMany({
      where: {
        project: { organisationId: orgId },
        ...(projectId ? { projectId } : {}),
        ...(from || to ? { reportDate: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } } : {}),
      },
      include: { project: { select: { id: true, code: true, name: true } }, _count: { select: { labour: true, plant: true, deliveries: true } } },
      orderBy: { reportDate: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const report = await this.prisma.dailyReport.findFirst({
      where: { id, project: { organisationId: orgId } },
      include: { project: true, author: { select: { firstName: true, lastName: true } }, labour: true, plant: true, deliveries: { include: { supplier: { select: { name: true } } } } },
    });
    if (!report) throw new NotFoundException("Daily report not found");
    return report;
  }

  async create(orgId: string, dto: CreateDailyReportDto) {
    await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, reportDate, labour, plant, deliveries, ...rest } = dto;
    return this.prisma.dailyReport.create({
      data: {
        ...rest,
        reportDate: new Date(reportDate),
        project: { connect: { id: projectId } },
        labour: labour?.length ? { create: labour } : undefined,
        plant: plant?.length ? { create: plant } : undefined,
        deliveries: deliveries?.length
          ? { create: deliveries.map((d) => ({ material: d.material, quantity: d.quantity, unit: d.unit, supplier: d.supplierId ? { connect: { id: d.supplierId } } : undefined })) }
          : undefined,
      },
      include: { labour: true, plant: true, deliveries: true },
    });
  }

  async update(orgId: string, id: string, dto: UpdateDailyReportDto) {
    await this.get(orgId, id);
    return this.prisma.dailyReport.update({ where: { id }, data: dto });
  }

  async addLabour(orgId: string, id: string, dto: LabourEntryDto) {
    await this.get(orgId, id);
    return this.prisma.labourEntry.create({ data: { ...dto, dailyReport: { connect: { id } } } });
  }
  async addPlant(orgId: string, id: string, dto: PlantEntryDto) {
    await this.get(orgId, id);
    return this.prisma.plantEntry.create({ data: { ...dto, dailyReport: { connect: { id } } } });
  }
  async addDelivery(orgId: string, id: string, dto: DeliveryEntryDto) {
    await this.get(orgId, id);
    const { supplierId, ...rest } = dto;
    return this.prisma.deliveryEntry.create({ data: { ...rest, dailyReport: { connect: { id } }, supplier: supplierId ? { connect: { id: supplierId } } : undefined } });
  }

  // ---- Period rollups (the weekly / monthly reports) ----
  private async rollup(orgId: string, projectId: string, from: Date, to: Date) {
    await this.assertProjectInOrg(orgId, projectId);
    const reports = await this.prisma.dailyReport.findMany({
      where: { projectId, reportDate: { gte: from, lt: to } },
      include: { labour: true, plant: true, deliveries: true },
      orderBy: { reportDate: "asc" },
    });

    const labourByTrade: Record<string, { headcountDays: number; hours: number }> = {};
    const plant: Record<string, number> = {};
    const deliveries: { date: Date; material: string; quantity: number; unit: string }[] = [];
    const delays: { date: Date; note: string }[] = [];
    const weather: { date: Date; weather: string | null; temperatureC: number | null }[] = [];
    let totalHours = 0, peakHeadcount = 0;

    for (const r of reports) {
      let dayHead = 0;
      for (const l of r.labour) {
        labourByTrade[l.trade] ??= { headcountDays: 0, hours: 0 };
        labourByTrade[l.trade].headcountDays += l.headcount;
        labourByTrade[l.trade].hours += Number(l.hours);
        totalHours += Number(l.hours);
        dayHead += l.headcount;
      }
      peakHeadcount = Math.max(peakHeadcount, dayHead);
      for (const p of r.plant) plant[p.item] = (plant[p.item] ?? 0) + p.quantity;
      for (const d of r.deliveries) deliveries.push({ date: r.reportDate, material: d.material, quantity: Number(d.quantity), unit: d.unit });
      if (r.delays) delays.push({ date: r.reportDate, note: r.delays });
      weather.push({ date: r.reportDate, weather: r.weather, temperatureC: r.temperatureC });
    }

    return {
      period: { from, to },
      daysReported: reports.length,
      totalLabourHours: r2(totalHours),
      peakHeadcount,
      labourByTrade: Object.fromEntries(Object.entries(labourByTrade).map(([k, v]) => [k, { headcountDays: v.headcountDays, hours: r2(v.hours) }])),
      plant,
      deliveries,
      delays,
      weather,
    };
  }

  weekly(orgId: string, projectId: string, weekOf: string) {
    const from = new Date(weekOf);
    const to = new Date(from.getTime() + 7 * 864e5);
    return this.rollup(orgId, projectId, from, to);
  }

  monthly(orgId: string, projectId: string, month: string) {
    // month = "YYYY-MM"
    const [y, m] = month.split("-").map(Number);
    const from = new Date(Date.UTC(y, m - 1, 1));
    const to = new Date(Date.UTC(y, m, 1));
    return this.rollup(orgId, projectId, from, to);
  }

  // Claims register: chargeable site events across the org's reports, valued at a
  // blended crew charge-out rate. Scoped through project.organisationId as above.
  async claims(orgId: string, recoveryRate = 78) {
    const events = await this.prisma.siteEvent.findMany({
      where: { chargeable: true, dailyReport: { project: { organisationId: orgId } } },
      include: { dailyReport: { include: { project: { select: { id: true, code: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
    });
    const flat = events.map((e) => ({
      type: e.type,
      description: e.description,
      cause: e.cause,
      hoursLost: Number(e.hoursLost),
      chargeable: e.chargeable,
      project: e.dailyReport.project.name,
      projectCode: e.dailyReport.project.code,
      reportDate: e.dailyReport.reportDate,
      reportId: e.dailyReportId,
      recoverableValue: claimValue(Number(e.hoursLost), recoveryRate),
    }));
    return { recoveryRate, summary: claimRegisterSummary(flat, recoveryRate), events: flat };
  }
}
