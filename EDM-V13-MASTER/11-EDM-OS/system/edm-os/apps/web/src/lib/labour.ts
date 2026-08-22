// Mirror of apps/api/src/labour/labour.ts — lets the UI compute man-hours, cost,
// crew variance and productivity directly from raw attendance, rather than
// displaying hardcoded figures. Kept in sync with the API engine.

export type AttendanceStatus = "PRESENT" | "ABSENT" | "SICK" | "LEAVE";
export type AttendanceRow = { workerId: string; trade: string; status: AttendanceStatus; hours: number; dayRate: number };

export const STANDARD_DAY_HOURS = 9;
export const OT_MULTIPLIER = 1.25;
const r2 = (n: number) => Math.round(n * 100) / 100;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function splitHours(hours: number, standardDay = STANDARD_DAY_HOURS) {
  return { regular: r2(Math.min(hours, standardDay)), overtime: r2(Math.max(0, hours - standardDay)) };
}

export function dayCost(args: { hours: number; dayRate: number; standardDay?: number; otMultiplier?: number }): number {
  const sd = args.standardDay ?? STANDARD_DAY_HOURS;
  const otm = args.otMultiplier ?? OT_MULTIPLIER;
  const { regular, overtime } = splitHours(args.hours, sd);
  const hourly = args.dayRate / sd;
  return r2(regular * hourly + overtime * hourly * otm);
}

export function attendanceSummary(rows: AttendanceRow[]) {
  let present = 0, absent = 0, manHours = 0, overtimeHours = 0, cost = 0;
  const trades = new Map<string, { present: number; manHours: number }>();
  for (const row of rows) {
    if (row.status === "PRESENT") {
      present += 1; manHours += row.hours; overtimeHours += splitHours(row.hours).overtime;
      cost += dayCost({ hours: row.hours, dayRate: row.dayRate });
      const t = trades.get(row.trade) ?? { present: 0, manHours: 0 };
      t.present += 1; t.manHours += row.hours; trades.set(row.trade, t);
    } else absent += 1;
  }
  return {
    present, absent, manHours: r2(manHours), overtimeHours: r2(overtimeHours), cost: r2(cost),
    byTrade: [...trades.entries()].map(([trade, v]) => ({ trade, present: v.present, manHours: r2(v.manHours) })),
  };
}

export function allocationVariance(plannedHeadcount: number, actualPresent: number) {
  const variance = actualPresent - plannedHeadcount;
  const pct = plannedHeadcount ? r1((actualPresent / plannedHeadcount) * 100) : 0;
  const status: "short" | "on-plan" | "over" = variance < 0 ? "short" : variance > 0 ? "over" : "on-plan";
  return { variance, pct, status };
}

export function productivity(args: { installedQty: number; manHours: number; standardDay?: number }) {
  const sd = args.standardDay ?? STANDARD_DAY_HOURS;
  const manDays = args.manHours / sd;
  return { perManDay: manDays ? r2(args.installedQty / manDays) : 0, perManHour: args.manHours ? r2(args.installedQty / args.manHours) : 0 };
}

export function productivityVsTarget(actualPerManDay: number, targetPerManDay: number) {
  const pct = targetPerManDay ? r1((actualPerManDay / targetPerManDay) * 100) : 0;
  const status: "below" | "on-target" | "above" = pct < 95 ? "below" : pct > 105 ? "above" : "on-target";
  return { pct, status };
}

export type TimesheetDay = { date: string; status: AttendanceStatus; hours: number };

export function aggregateTimesheet(days: TimesheetDay[], dayRate: number, opts?: { standardDay?: number; otMultiplier?: number }) {
  const sd = opts?.standardDay ?? STANDARD_DAY_HOURS;
  const otm = opts?.otMultiplier ?? OT_MULTIPLIER;
  let daysWorked = 0, regularHours = 0, overtimeHours = 0, cost = 0;
  for (const d of days) {
    if (d.status === "PRESENT") {
      daysWorked += 1;
      const { regular, overtime } = splitHours(d.hours, sd);
      regularHours += regular; overtimeHours += overtime;
      cost += dayCost({ hours: d.hours, dayRate, standardDay: sd, otMultiplier: otm });
    }
  }
  return { daysWorked, regularHours: r2(regularHours), overtimeHours: r2(overtimeHours), totalHours: r2(regularHours + overtimeHours), cost: r2(cost) };
}

export function timesheetCharge(args: { regularHours: number; overtimeHours: number; chargeRate: number; otChargeMultiplier?: number }): number {
  const otm = args.otChargeMultiplier ?? OT_MULTIPLIER;
  return r2(args.regularHours * args.chargeRate + args.overtimeHours * args.chargeRate * otm);
}

export function timesheetMargin(cost: number, charge: number) {
  const margin = r2(charge - cost);
  const marginPct = charge ? r1((margin / charge) * 100) : 0;
  return { margin, marginPct };
}
