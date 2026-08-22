import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { attendanceSummary, allocationVariance, aggregateTimesheet, timesheetCharge, timesheetMargin, AttendanceRow, AttendanceStatus, TimesheetDay } from "./labour";

@Injectable()
export class LabourService {
  constructor(private prisma: PrismaService) {}

  // ---- Workforce ----
  workers(orgId: string) {
    return this.prisma.worker.findMany({ where: { organisationId: orgId }, orderBy: [{ trade: "asc" }, { name: "asc" }] });
  }
  createWorker(orgId: string, data: { code: string; name: string; trade: any; grade?: string; dayRate: number; phone?: string }) {
    return this.prisma.worker.create({ data: { organisationId: orgId, ...data } });
  }

  // ---- Allocation ----
  allocations(orgId: string, projectId?: string) {
    return this.prisma.labourAllocation.findMany({
      where: { organisationId: orgId, ...(projectId ? { projectId } : {}) },
      orderBy: { startDate: "desc" },
    });
  }
  allocateCrew(orgId: string, data: { projectId: string; trade: any; plannedHeadcount: number; zone?: string; supervisor?: string; startDate: Date; endDate?: Date; workerId?: string }) {
    return this.prisma.labourAllocation.create({ data: { organisationId: orgId, ...data } });
  }

  // ---- Attendance ----
  attendance(orgId: string, projectId: string, date: Date) {
    return this.prisma.attendanceDay.findMany({ where: { organisationId: orgId, projectId, date }, include: { worker: true } });
  }
  markAttendance(orgId: string, data: { projectId: string; workerId: string; date: Date; status: AttendanceStatus; hours: number; overtimeHours?: number }) {
    return this.prisma.attendanceDay.upsert({
      where: { workerId_date: { workerId: data.workerId, date: data.date } },
      create: { organisationId: orgId, projectId: data.projectId, workerId: data.workerId, date: data.date, status: data.status, hours: data.hours, overtimeHours: data.overtimeHours ?? 0 },
      update: { projectId: data.projectId, status: data.status, hours: data.hours, overtimeHours: data.overtimeHours ?? 0 },
    });
  }

  // ---- Deployment summary (engine-driven), project by project for a date ----
  async deployment(orgId: string, date: Date) {
    const [allocations, attendance] = await Promise.all([
      this.prisma.labourAllocation.findMany({ where: { organisationId: orgId } }),
      this.prisma.attendanceDay.findMany({ where: { organisationId: orgId, date }, include: { worker: true } }),
    ]);

    const byProject = new Map<string, { planned: number; rows: AttendanceRow[] }>();
    for (const a of allocations) {
      const cur = byProject.get(a.projectId) ?? { planned: 0, rows: [] };
      cur.planned += a.plannedHeadcount;
      byProject.set(a.projectId, cur);
    }
    for (const r of attendance) {
      const cur = byProject.get(r.projectId) ?? { planned: 0, rows: [] };
      cur.rows.push({ workerId: r.workerId, trade: r.worker.trade, status: r.status as AttendanceStatus, hours: Number(r.hours), dayRate: Number(r.worker.dayRate) });
      byProject.set(r.projectId, cur);
    }

    return [...byProject.entries()].map(([projectId, v]) => {
      const summary = attendanceSummary(v.rows);
      return { projectId, planned: v.planned, ...summary, variance: allocationVariance(v.planned, summary.present) };
    });
  }

  // ---- Charge-out rate card ----
  rates(orgId: string) {
    return this.prisma.labourRate.findMany({ where: { organisationId: orgId }, orderBy: [{ trade: "asc" }, { grade: "asc" }] });
  }

  // ---- Timesheets: aggregate attendance per worker over a date range, priced
  // against the rate card (cost from day rate, charge from trade+grade rate).
  async timesheets(orgId: string, from: Date, to: Date) {
    const [records, rateCard] = await Promise.all([
      this.prisma.attendanceDay.findMany({
        where: { organisationId: orgId, date: { gte: from, lte: to } },
        include: { worker: true },
        orderBy: { date: "asc" },
      }),
      this.prisma.labourRate.findMany({ where: { organisationId: orgId } }),
    ]);

    const rateFor = new Map(rateCard.map((r) => [`${r.trade}::${r.grade}`, Number(r.chargeRate)]));

    const byWorker = new Map<string, { worker: { id: string; name: string; trade: string; grade: string | null; dayRate: number }; days: TimesheetDay[] }>();
    for (const r of records) {
      const cur = byWorker.get(r.workerId) ?? { worker: { id: r.worker.id, name: r.worker.name, trade: r.worker.trade, grade: r.worker.grade, dayRate: Number(r.worker.dayRate) }, days: [] };
      cur.days.push({ date: r.date.toISOString().slice(0, 10), status: r.status as AttendanceStatus, hours: Number(r.hours) });
      byWorker.set(r.workerId, cur);
    }

    return [...byWorker.values()].map(({ worker, days }) => {
      const agg = aggregateTimesheet(days, worker.dayRate);
      const chargeRate = rateFor.get(`${worker.trade}::${worker.grade ?? ""}`) ?? 0;
      const charge = timesheetCharge({ regularHours: agg.regularHours, overtimeHours: agg.overtimeHours, chargeRate });
      const margin = timesheetMargin(agg.cost, charge);
      return { workerId: worker.id, name: worker.name, trade: worker.trade, grade: worker.grade, dayRate: worker.dayRate, chargeRate, ...agg, charge, ...margin };
    });
  }
}
