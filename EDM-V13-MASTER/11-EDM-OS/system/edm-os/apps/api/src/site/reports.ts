// Pure engine for supervisor daily reports. Turns the site diary into something
// commercially useful: the claim/disruption impact, a check that the report's
// headcount matches the attendance actually recorded, and submit-readiness.

export type SiteEventType = "DELAY" | "INSTRUCTION" | "DISRUPTION";
export type SiteEvent = {
  type: SiteEventType;
  description: string;
  cause: string;
  hoursLost: number;
  chargeable: boolean; // potentially recoverable from the main contractor / client
};

const r2 = (n: number) => Math.round(n * 100) / 100;

// Aggregate the events on a report — the basis of a delay/disruption claim.
export function delayImpact(events: SiteEvent[]): {
  delays: number;
  instructions: number;
  hoursLost: number;
  chargeableEvents: number;
} {
  let delays = 0, instructions = 0, hoursLost = 0, chargeableEvents = 0;
  for (const e of events) {
    if (e.type === "DELAY" || e.type === "DISRUPTION") {
      delays += 1;
      hoursLost += e.hoursLost;
    }
    if (e.type === "INSTRUCTION") instructions += 1;
    if (e.chargeable) chargeableEvents += 1;
  }
  return { delays, instructions, hoursLost: r2(hoursLost), chargeableEvents };
}

// Does the headcount the supervisor wrote down match the attendance recorded?
// A mismatch is the early sign of an unrecorded man, a no-show, or a padded report.
export function headcountReconciliation(reportHeadcount: number, attendancePresent: number): {
  match: boolean;
  variance: number;
} {
  return { match: reportHeadcount === attendancePresent, variance: reportHeadcount - attendancePresent };
}

// Required fields before a report can be submitted (and become a contractual record).
export function reportCompleteness(r: { weather?: string | null; labour: unknown[]; progress?: string | null }): {
  missing: string[];
  canSubmit: boolean;
} {
  const missing: string[] = [];
  if (!r.weather) missing.push("weather");
  if (!r.labour || r.labour.length === 0) missing.push("labour");
  if (!r.progress || !String(r.progress).trim()) missing.push("progress");
  return { missing, canSubmit: missing.length === 0 };
}

// ---- Claims: roll the chargeable site events into a recoverable position ----

// Recoverable value of lost time at a blended crew charge-out rate.
export function claimValue(hoursLost: number, recoveryRate: number): number {
  return r2(hoursLost * recoveryRate);
}

// Summarise chargeable events into a claim position: time-based delay/disruption
// claims (hours × rate) and instruction-based variation candidates.
export function claimRegisterSummary(
  events: { type: SiteEventType; hoursLost: number; chargeable: boolean }[],
  recoveryRate: number,
): { chargeableDelays: number; hoursLost: number; recoverableValue: number; variationCandidates: number } {
  let chargeableDelays = 0, hoursLost = 0, variationCandidates = 0;
  for (const e of events) {
    if (!e.chargeable) continue;
    if (e.type === "DELAY" || e.type === "DISRUPTION") {
      chargeableDelays += 1;
      hoursLost += e.hoursLost;
    } else if (e.type === "INSTRUCTION") {
      variationCandidates += 1;
    }
  }
  return { chargeableDelays, hoursLost: r2(hoursLost), recoverableValue: r2(hoursLost * recoveryRate), variationCandidates };
}
