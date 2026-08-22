import { Injectable } from "@nestjs/common";
import { LeadStage, OpportunityStatus, ActivityType } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";

// One call that returns everything the CRM overview needs, so the frontend
// makes a single request instead of stitching five together.
@Injectable()
export class CrmDashboardService {
  constructor(private prisma: PrismaService) {}

  async summary(orgId: string) {
    const horizon = new Date(Date.now() + 7 * 864e5);
    const [openOpps, openLeadsCount, followUpsDue, companies, recent] = await Promise.all([
      this.prisma.opportunity.findMany({ where: tenantWhere(orgId, { status: OpportunityStatus.OPEN }), select: { value: true, probability: true } }),
      this.prisma.lead.count({ where: tenantWhere(orgId, { stage: { notIn: [LeadStage.WON, LeadStage.LOST] } }) }),
      this.prisma.lead.count({ where: { organisationId: orgId, stage: { notIn: [LeadStage.WON, LeadStage.LOST] }, nextFollowUpAt: { not: null, lte: horizon } } }),
      this.prisma.company.count({ where: { organisationId: orgId } }),
      this.prisma.activity.findMany({ where: tenantWhere(orgId, {}), orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    return {
      weightedPipeline: openOpps.reduce((s, o) => s + Number(o.value) * (o.probability / 100), 0),
      grossPipeline: openOpps.reduce((s, o) => s + Number(o.value), 0),
      openOpportunities: openOpps.length,
      openLeads: openLeadsCount,
      followUpsDue,
      companies,
      recentActivity: recent,
    };
  }

  // Pipeline intelligence — hit rate, win rate by client type, and the
  // lead→opportunity→won conversion funnel. Win/loss is read from
  // OpportunityStatus; client type from the linked company.
  async analytics(orgId: string) {
    const [closed, openOpps, leadCount, oppCount] = await Promise.all([
      this.prisma.opportunity.findMany({
        where: tenantWhere(orgId, { status: { in: [OpportunityStatus.WON, OpportunityStatus.LOST] } }),
        select: { value: true, status: true, company: { select: { type: true } } },
      }),
      this.prisma.opportunity.findMany({ where: tenantWhere(orgId, { status: OpportunityStatus.OPEN }), select: { value: true, probability: true } }),
      this.prisma.lead.count({ where: tenantWhere(orgId, {}) }),
      this.prisma.opportunity.count({ where: tenantWhere(orgId, {}) }),
    ]);

    const won = closed.filter((o) => o.status === OpportunityStatus.WON);
    const lost = closed.filter((o) => o.status === OpportunityStatus.LOST);
    const sum = (a: { value: unknown }[]) => a.reduce((s, o) => s + Number(o.value), 0);
    const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

    const byTypeMap = new Map<string, { won: number; lost: number; wonValue: number }>();
    for (const o of closed) {
      const t = o.company?.type ?? "OTHER";
      const e = byTypeMap.get(t) ?? { won: 0, lost: 0, wonValue: 0 };
      if (o.status === OpportunityStatus.WON) { e.won += 1; e.wonValue += Number(o.value); } else { e.lost += 1; }
      byTypeMap.set(t, e);
    }

    return {
      wonCount: won.length,
      lostCount: lost.length,
      winRatePct: pct(won.length, won.length + lost.length),
      wonValue: sum(won),
      lostValue: sum(lost),
      valueWinRatePct: pct(sum(won), sum(closed)),
      weightedOpen: openOpps.reduce((s, o) => s + Number(o.value) * (o.probability / 100), 0),
      openValue: sum(openOpps),
      openCount: openOpps.length,
      byType: [...byTypeMap.entries()].map(([type, e]) => ({ type, ...e, winRatePct: pct(e.won, e.won + e.lost) })),
      funnel: { leads: leadCount, opportunities: oppCount, won: won.length },
    };
  }

  // The action inbox — everything with a date attached so nothing slips:
  // open bid deadlines, lead follow-ups due, and open tasks, each sorted by
  // urgency. This is the "never miss a submission" view.
  async agenda(orgId: string) {
    const [bidDeadlines, followUps, tasks] = await Promise.all([
      this.prisma.opportunity.findMany({
        where: tenantWhere(orgId, { status: OpportunityStatus.OPEN, expectedClose: { not: null } }),
        include: { company: { select: { id: true, name: true } } },
        orderBy: { expectedClose: "asc" },
      }),
      this.prisma.lead.findMany({
        where: { organisationId: orgId, stage: { notIn: [LeadStage.WON, LeadStage.LOST] }, nextFollowUpAt: { not: null } },
        include: { company: { select: { id: true, name: true } } },
        orderBy: { nextFollowUpAt: "asc" },
      }),
      this.prisma.activity.findMany({
        where: tenantWhere(orgId, { type: ActivityType.TASK, completedAt: null, dueAt: { not: null } }),
        orderBy: { dueAt: "asc" },
      }),
    ]);
    return { bidDeadlines, followUps, tasks };
  }

  // Revenue forecast vs delivery capacity. Buckets weighted open pipeline by
  // expected close month for the next `monthsAhead` months and compares each
  // month against a delivery-capacity assumption — the "can we resource what we
  // win" view that generic CRMs don't provide. Capacity is configurable.
  async forecast(orgId: string, capacityPerMonth = 3_500_000, monthsAhead = 6) {
    const now = new Date();
    const open = await this.prisma.opportunity.findMany({
      where: tenantWhere(orgId, { status: OpportunityStatus.OPEN, expectedClose: { not: null } }),
      select: { value: true, probability: true, expectedClose: true },
    });

    const buckets = new Map<string, number>();
    const labels: { key: string; label: string }[] = [];
    for (let i = 0; i < monthsAhead; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      labels.push({ key, label: d.toLocaleString("en", { month: "short", year: "numeric" }) });
      buckets.set(key, 0);
    }
    for (const o of open) {
      const d = new Date(o.expectedClose as Date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + Number(o.value) * (o.probability / 100));
    }

    const months = labels.map((l) => {
      const projected = Math.round(buckets.get(l.key) ?? 0);
      return { label: l.label, projected, capacity: capacityPerMonth, gap: projected - capacityPerMonth };
    });
    return { capacityPerMonth, months };
  }

  // Account intelligence: aggregate opportunities per client and rank by a score
  // that rewards both win rate with that client and value at stake.
  async accounts(orgId: string) {
    const opps = await this.prisma.opportunity.findMany({
      where: tenantWhere(orgId, {}),
      select: { value: true, probability: true, status: true, company: { select: { id: true, name: true, type: true } } },
    });
    type Row = { id: string; name: string; type: string; wonCount: number; lostCount: number; wonValue: number; openCount: number; openWeighted: number };
    const map = new Map<string, Row>();
    for (const o of opps) {
      if (!o.company) continue;
      const e = map.get(o.company.id) ?? { id: o.company.id, name: o.company.name, type: o.company.type, wonCount: 0, lostCount: 0, wonValue: 0, openCount: 0, openWeighted: 0 };
      if (o.status === OpportunityStatus.WON) { e.wonCount++; e.wonValue += Number(o.value); }
      else if (o.status === OpportunityStatus.LOST) { e.lostCount++; }
      else if (o.status === OpportunityStatus.OPEN) { e.openCount++; e.openWeighted += Number(o.value) * (o.probability / 100); }
      map.set(o.company.id, e);
    }
    return [...map.values()]
      .map((e) => {
        const closed = e.wonCount + e.lostCount;
        return {
          ...e,
          openWeighted: Math.round(e.openWeighted),
          winRatePct: closed ? Math.round((e.wonCount / closed) * 100) : 0,
          score: Math.round((closed ? e.wonCount / closed : 0) * (e.wonValue + e.openWeighted)),
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  // Estimator workload: live bids, value being priced and win rate per estimator,
  // from opportunities assigned via estimatorUserId. Sorted by load.
  async estimators(orgId: string) {
    const opps = await this.prisma.opportunity.findMany({
      where: tenantWhere(orgId, { estimatorUserId: { not: null } }),
      select: { value: true, probability: true, status: true, estimator: { select: { id: true, firstName: true, lastName: true, jobTitle: true } } },
    });
    type Row = { id: string; name: string; role: string; liveBids: number; liveValue: number; weighted: number; wonCount: number; lostCount: number };
    const map = new Map<string, Row>();
    for (const o of opps) {
      if (!o.estimator) continue;
      const e = map.get(o.estimator.id) ?? { id: o.estimator.id, name: `${o.estimator.firstName} ${o.estimator.lastName}`, role: o.estimator.jobTitle ?? "Estimator", liveBids: 0, liveValue: 0, weighted: 0, wonCount: 0, lostCount: 0 };
      if (o.status === OpportunityStatus.OPEN) { e.liveBids++; e.liveValue += Number(o.value); e.weighted += Number(o.value) * (o.probability / 100); }
      else if (o.status === OpportunityStatus.WON) e.wonCount++;
      else if (o.status === OpportunityStatus.LOST) e.lostCount++;
      map.set(o.estimator.id, e);
    }
    return [...map.values()]
      .map((e) => {
        const closed = e.wonCount + e.lostCount;
        return { ...e, weighted: Math.round(e.weighted), capacity: Math.max(e.liveBids, 6), avgTurnaroundDays: 0, winRatePct: closed ? Math.round((e.wonCount / closed) * 100) : 0 };
      })
      .sort((a, b) => b.liveBids - a.liveBids);
  }
}
