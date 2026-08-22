// Pure labour-operations engine for a labour-only subcontractor. No I/O — every
// function is deterministic and unit-tested. This is the core that turns raw
// attendance into man-hours, cost, allocation variance and productivity.

export type AttendanceStatus = "PRESENT" | "ABSENT" | "SICK" | "LEAVE";

export type AttendanceRow = {
  workerId: string;
  trade: string;
  status: AttendanceStatus;
  hours: number; // total hours worked that day
  dayRate: number; // labour cost of a standard day, in the org/region currency
};

export const STANDARD_DAY_HOURS = 9;
export const OT_MULTIPLIER = 1.25;

const r2 = (n: number) => Math.round(n * 100) / 100;
const r1 = (n: number) => Math.round(n * 10) / 10;

// Split a day's hours into regular vs overtime against a standard working day.
export function splitHours(hours: number, standardDay = STANDARD_DAY_HOURS): { regular: number; overtime: number } {
  const regular = Math.min(hours, standardDay);
  const overtime = Math.max(0, hours - standardDay);
  return { regular: r2(regular), overtime: r2(overtime) };
}

// Labour cost for one worker-day. dayRate is the cost of a standard day; overtime
// hours are charged at the standard hourly rate × multiplier.
export function dayCost(args: { hours: number; dayRate: number; standardDay?: number; otMultiplier?: number }): number {
  const sd = args.standardDay ?? STANDARD_DAY_HOURS;
  const otm = args.otMultiplier ?? OT_MULTIPLIER;
  const { regular, overtime } = splitHours(args.hours, sd);
  const hourly = args.dayRate / sd;
  return r2(regular * hourly + overtime * hourly * otm);
}

// Summarise one day's attendance for a crew (one project).
export function attendanceSummary(rows: AttendanceRow[]): {
  present: number;
  absent: number;
  manHours: number;
  overtimeHours: number;
  cost: number;
  byTrade: { trade: string; present: number; manHours: number }[];
} {
  let present = 0, absent = 0, manHours = 0, overtimeHours = 0, cost = 0;
  const trades = new Map<string, { present: number; manHours: number }>();
  for (const row of rows) {
    if (row.status === "PRESENT") {
      present += 1;
      manHours += row.hours;
      overtimeHours += splitHours(row.hours).overtime;
      cost += dayCost({ hours: row.hours, dayRate: row.dayRate });
      const t = trades.get(row.trade) ?? { present: 0, manHours: 0 };
      t.present += 1;
      t.manHours += row.hours;
      trades.set(row.trade, t);
    } else {
      absent += 1;
    }
  }
  return {
    present,
    absent,
    manHours: r2(manHours),
    overtimeHours: r2(overtimeHours),
    cost: r2(cost),
    byTrade: [...trades.entries()].map(([trade, v]) => ({ trade, present: v.present, manHours: r2(v.manHours) })),
  };
}

// Planned crew vs who actually turned up.
export function allocationVariance(plannedHeadcount: number, actualPresent: number): {
  variance: number;
  pct: number;
  status: "short" | "on-plan" | "over";
} {
  const variance = actualPresent - plannedHeadcount;
  const pct = plannedHeadcount ? r1((actualPresent / plannedHeadcount) * 100) : 0;
  const status = variance < 0 ? "short" : variance > 0 ? "over" : "on-plan";
  return { variance, pct, status };
}

// Productivity: installed output per man-day and per man-hour.
export function productivity(args: { installedQty: number; manHours: number; standardDay?: number }): {
  perManDay: number;
  perManHour: number;
} {
  const sd = args.standardDay ?? STANDARD_DAY_HOURS;
  const manDays = args.manHours / sd;
  return {
    perManDay: manDays ? r2(args.installedQty / manDays) : 0,
    perManHour: args.manHours ? r2(args.installedQty / args.manHours) : 0,
  };
}

// Actual productivity against the estimated/target rate (the basis of the price).
export function productivityVsTarget(actualPerManDay: number, targetPerManDay: number): {
  pct: number;
  status: "below" | "on-target" | "above";
} {
  const pct = targetPerManDay ? r1((actualPerManDay / targetPerManDay) * 100) : 0;
  const status = pct < 95 ? "below" : pct > 105 ? "above" : "on-target";
  return { pct, status };
}

// ---- Timesheets: attendance over a period -> cost, charge and margin ----

export type TimesheetDay = { date: string; status: AttendanceStatus; hours: number };

// Aggregate one worker's days into a weekly timesheet (the cost side / payroll).
export function aggregateTimesheet(days: TimesheetDay[], dayRate: number, opts?: { standardDay?: number; otMultiplier?: number }): {
  daysWorked: number;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  cost: number;
} {
  const sd = opts?.standardDay ?? STANDARD_DAY_HOURS;
  const otm = opts?.otMultiplier ?? OT_MULTIPLIER;
  let daysWorked = 0, regularHours = 0, overtimeHours = 0, cost = 0;
  for (const d of days) {
    if (d.status === "PRESENT") {
      daysWorked += 1;
      const { regular, overtime } = splitHours(d.hours, sd);
      regularHours += regular;
      overtimeHours += overtime;
      cost += dayCost({ hours: d.hours, dayRate, standardDay: sd, otMultiplier: otm });
    }
  }
  return { daysWorked, regularHours: r2(regularHours), overtimeHours: r2(overtimeHours), totalHours: r2(regularHours + overtimeHours), cost: r2(cost) };
}

// Billing side: man-hours charged to the main contractor at the agreed rate.
export function timesheetCharge(args: { regularHours: number; overtimeHours: number; chargeRate: number; otChargeMultiplier?: number }): number {
  const otm = args.otChargeMultiplier ?? OT_MULTIPLIER;
  return r2(args.regularHours * args.chargeRate + args.overtimeHours * args.chargeRate * otm);
}

// Margin = what you bill minus what it costs you to field the labour.
export function timesheetMargin(cost: number, charge: number): { margin: number; marginPct: number } {
  const margin = r2(charge - cost);
  const marginPct = charge ? r1((margin / charge) * 100) : 0;
  return { margin, marginPct };
}
