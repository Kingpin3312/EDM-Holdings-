import { apiGet } from "./api";
import { getApiToken } from "./auth";
import { crmAgenda, crmAnalytics, crmForecast, clientScorecards, crmCalendar, estimators, type ClientScore, type CalendarEvent, type Estimator } from "./data";

// Live-or-mock data layer. Each getter tries the live API; on any failure
// (no token, API down, unexpected shape) it falls back to the seeded mock in
// `lib/data.ts`, so screens always render. When the API is reachable and a
// token is present, screens show real data from Postgres.

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

export async function getAgenda(): Promise<typeof crmAgenda> {
  try {
    const r = await apiGet<RawAgenda>("/crm/dashboard/agenda", getApiToken());
    return {
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
  } catch {
    return crmAgenda;
  }
}

type RawAnalytics = {
  wonCount: number; lostCount: number; winRatePct: number; wonValue: number; lostValue: number;
  valueWinRatePct: number; weightedOpen: number; openValue: number; openCount: number;
  byType: { type: string; won: number; lost: number; wonValue: number; winRatePct: number }[];
  funnel: { leads: number; opportunities: number; won: number };
};

export async function getAnalytics(): Promise<typeof crmAnalytics> {
  try {
    const a = await apiGet<RawAnalytics>("/crm/dashboard/analytics", getApiToken());
    return {
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
  } catch {
    return crmAnalytics;
  }
}

export async function getForecast(): Promise<typeof crmForecast> {
  try {
    const f = await apiGet<typeof crmForecast>("/crm/dashboard/forecast", getApiToken());
    if (!f?.months?.length) return crmForecast;
    return f;
  } catch {
    return crmForecast;
  }
}

export async function getAccounts(): Promise<ClientScore[]> {
  try {
    const rows = await apiGet<ClientScore[]>("/crm/dashboard/accounts", getApiToken());
    return Array.isArray(rows) && rows.length ? rows : clientScorecards;
  } catch {
    return clientScorecards;
  }
}

export async function getCalendar(): Promise<typeof crmCalendar> {
  try {
    const r = await apiGet<RawAgenda>("/crm/dashboard/agenda", getApiToken());
    const events: CalendarEvent[] = [
      ...r.bidDeadlines.filter((o) => o.expectedClose).map((o) => ({ date: o.expectedClose as string, title: o.name, type: "bid" as const, company: o.company?.name ?? "", href: `/crm/opportunities/${o.id}` })),
      ...r.followUps.filter((l) => l.nextFollowUpAt).map((l) => ({ date: l.nextFollowUpAt as string, title: l.title, type: "follow-up" as const, company: l.company?.name ?? "", href: `/crm/leads/${l.id}` })),
      ...r.tasks.filter((a) => a.dueAt).map((a) => ({ date: a.dueAt as string, title: a.subject, type: "task" as const, company: "", href: a.opportunityId ? `/crm/opportunities/${a.opportunityId}` : a.leadId ? `/crm/leads/${a.leadId}` : "/crm/calendar" })),
    ];
    return events.length ? { events } : crmCalendar;
  } catch {
    return crmCalendar;
  }
}

export async function getEstimators(): Promise<Estimator[]> {
  try {
    const rows = await apiGet<Estimator[]>("/crm/dashboard/estimators", getApiToken());
    return Array.isArray(rows) && rows.length ? rows : estimators;
  } catch {
    return estimators;
  }
}
