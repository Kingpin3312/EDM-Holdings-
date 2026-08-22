import { apiGet } from "./api";
import { getApiToken } from "./auth";
import { crmAgenda, crmAnalytics, crmForecast, clientScorecards, crmCalendar, estimators, type ClientScore, type CalendarEvent, type Estimator } from "./data";

// Live-or-demonstration data layer.
//
// Each getter tries the live API and falls back to the fixture in `lib/data.ts`
// so a screen always renders. The fallback used to be silent, which is the
// dangerous part: with the API down, the token missing or a query throwing, a
// director saw convincing invented numbers with nothing to say they were not
// real. An empty live result did the same — "no accounts yet" rendered as a
// list of demonstration accounts.
//
// Every getter now returns { data, source, reason }. `source` is one of:
//   "live"  — served by the API
//   "empty" — the API answered, and there is genuinely nothing yet
//   "demo"  — the API could not be reached; these numbers are illustrative
//
// Screens must show the source. <DataSource> in components/DataSource.tsx does
// it consistently; a screen that drops it is a screen that can lie.

export type DataSource = "live" | "empty" | "demo";
export type Sourced<T> = { data: T; source: DataSource; reason?: string };

function demo<T>(data: T, e: unknown): Sourced<T> {
  const reason = e instanceof Error ? e.message : "the API could not be reached";
  return { data, source: "demo", reason };
}

function rel(dateStr?: string | null): { days: number; label: string; overdue: boolean } {
  if (!dateStr) return { days: 9999, label: "—", overdue: false };
  const days = Math.round((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  const overdue = days < 0;
  const label = overdue ? "Overdue" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `in ${days} days`;
  return { days, label, overdue };
}

type RawCompany = { id: string; name: string } | null;
type RawOpp = { id: string; name: string; expectedClose?: string | null; company?: RawCompany };
type RawLead = { id: string; title: string; nextFollowUpAt?: string | null; company?: RawCompany };
type RawTask = { id: string; subject: string; dueAt?: string | null; opportunityId?: string | null; leadId?: string | null; companyId?: string | null };
type RawAgenda = { bidDeadlines: RawOpp[]; followUps: RawLead[]; tasks: RawTask[] };

export async function getAgenda(): Promise<Sourced<typeof crmAgenda>> {
  try {
    const r = await apiGet<RawAgenda>("/crm/dashboard/agenda", getApiToken());
    const mapped = {
      bidDeadlines: r.bidDeadlines.map((o) => {
        const d = rel(o.expectedClose);
        return { id: o.id, title: o.name, sub: o.company?.name ?? "", owner: "", due: d.label, days: d.days, overdue: d.overdue, href: `/crm/opportunities/${o.id}` };
      }),
      followUps: r.followUps.map((l) => {
        const d = rel(l.nextFollowUpAt);
        return { id: l.id, title: l.title, sub: l.company?.name ?? "", owner: "", due: d.label, days: d.days, overdue: d.overdue, href: `/crm/leads/${l.id}` };
      }),
      tasks: r.tasks.map((a) => {
        const d = rel(a.dueAt);
        const href = a.opportunityId ? `/crm/opportunities/${a.opportunityId}` : a.leadId ? `/crm/leads/${a.leadId}` : a.companyId ? `/crm/companies/${a.companyId}` : "/crm/follow-ups";
        return { id: a.id, title: a.subject, sub: "", owner: "", due: d.label, days: d.days, overdue: d.overdue, href };
      }),
    };
    const empty = !mapped.bidDeadlines.length && !mapped.followUps.length && !mapped.tasks.length;
    return { data: mapped, source: empty ? "empty" : "live" };
  } catch (e) {
    return demo(crmAgenda, e);
  }
}

type RawAnalytics = {
  wonCount: number; lostCount: number; winRatePct: number; wonValue: number; lostValue: number;
  valueWinRatePct: number; weightedOpen: number; openValue: number; openCount: number;
  byType: { type: string; won: number; lost: number; wonValue: number; winRatePct: number }[];
  funnel: { leads: number; opportunities: number; won: number };
};

export async function getAnalytics(): Promise<Sourced<typeof crmAnalytics>> {
  try {
    const a = await apiGet<RawAnalytics>("/crm/dashboard/analytics", getApiToken());
    const mapped = {
      wonCount: a.wonCount, lostCount: a.lostCount, winRatePct: a.winRatePct,
      wonValue: a.wonValue, lostValue: a.lostValue, valueWinRatePct: a.valueWinRatePct,
      weightedOpen: a.weightedOpen, openValue: a.openValue, openCount: a.openCount,
      byType: a.byType,
      funnel: [
        { label: "Leads", count: a.funnel?.leads ?? 0, value: 0 },
        { label: "Opportunities", count: a.funnel?.opportunities ?? 0, value: 0 },
        { label: "Won", count: a.funnel?.won ?? 0, value: 0 },
      ],
    };
    const empty = !mapped.wonCount && !mapped.lostCount && !mapped.openCount;
    return { data: mapped, source: empty ? "empty" : "live" };
  } catch (e) {
    return demo(crmAnalytics, e);
  }
}

export async function getForecast(): Promise<Sourced<typeof crmForecast>> {
  try {
    const f = await apiGet<typeof crmForecast>("/crm/dashboard/forecast", getApiToken());
    if (!f?.months?.length) return { data: crmForecast, source: "empty" };
    const empty = f.months.every((m) => !m.projected);
    return { data: f, source: empty ? "empty" : "live" };
  } catch (e) {
    return demo(crmForecast, e);
  }
}

export async function getAccounts(): Promise<Sourced<ClientScore[]>> {
  try {
    const rows = await apiGet<ClientScore[]>("/crm/dashboard/accounts", getApiToken());
    if (!Array.isArray(rows)) throw new Error("unexpected shape from /crm/dashboard/accounts");
    // An empty list is a real answer — no clients yet — not a reason to show demo data.
    return rows.length ? { data: rows, source: "live" } : { data: [], source: "empty" };
  } catch (e) {
    return demo(clientScorecards, e);
  }
}

export async function getCalendar(): Promise<Sourced<typeof crmCalendar>> {
  try {
    const r = await apiGet<RawAgenda>("/crm/dashboard/agenda", getApiToken());
    const events: CalendarEvent[] = [
      ...r.bidDeadlines.filter((o) => o.expectedClose).map((o) => ({ date: o.expectedClose as string, title: o.name, type: "bid" as const, company: o.company?.name ?? "", href: `/crm/opportunities/${o.id}` })),
      ...r.followUps.filter((l) => l.nextFollowUpAt).map((l) => ({ date: l.nextFollowUpAt as string, title: l.title, type: "follow-up" as const, company: l.company?.name ?? "", href: `/crm/leads/${l.id}` })),
      ...r.tasks.filter((a) => a.dueAt).map((a) => ({ date: a.dueAt as string, title: a.subject, type: "task" as const, company: "", href: a.opportunityId ? `/crm/opportunities/${a.opportunityId}` : a.leadId ? `/crm/leads/${a.leadId}` : "/crm/calendar" })),
    ];
    return events.length ? { data: { events }, source: "live" } : { data: { events: [] }, source: "empty" };
  } catch (e) {
    return demo(crmCalendar, e);
  }
}

export async function getEstimators(): Promise<Sourced<Estimator[]>> {
  try {
    const rows = await apiGet<Estimator[]>("/crm/dashboard/estimators", getApiToken());
    if (!Array.isArray(rows)) throw new Error("unexpected shape from /crm/dashboard/estimators");
    return rows.length ? { data: rows, source: "live" } : { data: [], source: "empty" };
  } catch (e) {
    return demo(estimators, e);
  }
}
