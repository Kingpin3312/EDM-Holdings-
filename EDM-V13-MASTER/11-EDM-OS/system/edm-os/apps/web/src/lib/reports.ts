// Mirror of apps/api/src/site/reports.ts — lets the supervisor report screens
// compute claim impact, headcount reconciliation and submit-readiness live.

export type SiteEventType = "DELAY" | "INSTRUCTION" | "DISRUPTION";
export type SiteEvent = { type: SiteEventType; description: string; cause: string; hoursLost: number; chargeable: boolean };

const r2 = (n: number) => Math.round(n * 100) / 100;

export function delayImpact(events: SiteEvent[]) {
  let delays = 0, instructions = 0, hoursLost = 0, chargeableEvents = 0;
  for (const e of events) {
    if (e.type === "DELAY" || e.type === "DISRUPTION") { delays += 1; hoursLost += e.hoursLost; }
    if (e.type === "INSTRUCTION") instructions += 1;
    if (e.chargeable) chargeableEvents += 1;
  }
  return { delays, instructions, hoursLost: r2(hoursLost), chargeableEvents };
}

export function headcountReconciliation(reportHeadcount: number, attendancePresent: number) {
  return { match: reportHeadcount === attendancePresent, variance: reportHeadcount - attendancePresent };
}

export function reportCompleteness(r: { weather?: string | null; labour: unknown[]; progress?: string | null }) {
  const missing: string[] = [];
  if (!r.weather) missing.push("weather");
  if (!r.labour || r.labour.length === 0) missing.push("labour");
  if (!r.progress || !String(r.progress).trim()) missing.push("progress");
  return { missing, canSubmit: missing.length === 0 };
}

export function claimValue(hoursLost: number, recoveryRate: number): number {
  return r2(hoursLost * recoveryRate);
}

export function claimRegisterSummary(
  events: { type: SiteEventType; hoursLost: number; chargeable: boolean }[],
  recoveryRate: number,
) {
  let chargeableDelays = 0, hoursLost = 0, variationCandidates = 0;
  for (const e of events) {
    if (!e.chargeable) continue;
    if (e.type === "DELAY" || e.type === "DISRUPTION") { chargeableDelays += 1; hoursLost += e.hoursLost; }
    else if (e.type === "INSTRUCTION") variationCandidates += 1;
  }
  return { chargeableDelays, hoursLost: r2(hoursLost), recoverableValue: r2(hoursLost * recoveryRate), variationCandidates };
}
