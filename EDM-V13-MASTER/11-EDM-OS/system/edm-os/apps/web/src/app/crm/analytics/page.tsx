import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, companyTone } from "@/lib/data";
import { getAnalytics } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";

export default async function CrmAnalyticsPage() {
  const aS = await getAnalytics();
  const a = aS.data;
  const closed = a.wonCount + a.lostCount;
  const wonW = closed ? (a.wonCount / closed) * 100 : 0;
  const sortedTypes = [...a.byType].sort((x, y) => y.winRatePct - x.winRatePct);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Pipeline intelligence — where you win, and where you don&apos;t</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Export</button>
      </div>
      <CrmTabs active="analytics" />
      <DataSourceBanner source={aS.source} reason={aS.reason} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Hit rate (by count)</div><div className="mt-1 text-2xl font-bold">{a.winRatePct}%</div><div className="mt-0.5 text-xs text-emerald-soft">{a.wonCount} won · {a.lostCount} lost</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Hit rate (by value)</div><div className="mt-1 text-2xl font-bold">{a.valueWinRatePct}%</div><div className="mt-0.5 text-xs text-charcoal-muted">of bid value pursued</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Won value</div><div className="mt-1 text-2xl font-bold">{AED(a.wonValue)}</div><div className="mt-0.5 text-xs text-charcoal-muted">{AED(a.lostValue)} lost</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Weighted open pipeline</div><div className="mt-1 text-2xl font-bold">{AED(a.weightedOpen)}</div><div className="mt-0.5 text-xs text-charcoal-muted">{a.openCount} live pursuits</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
        {/* Bid hit rate */}
        <Card className="p-5">
          <SectionTitle>Bid hit rate</SectionTitle>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-emerald">{a.winRatePct}%</span>
            <span className="text-sm text-charcoal-muted">of {closed} closed bids won</span>
          </div>
          <div className="flex h-7 rounded overflow-hidden border border-line">
            <div className="bg-emerald h-full" style={{ width: `${wonW}%` }} />
            <div className="bg-sage/40 h-full" style={{ width: `${100 - wonW}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[12px]">
            <span className="font-semibold text-emerald">Won · {a.wonCount} · {AED(a.wonValue)}</span>
            <span className="text-charcoal-muted">Lost · {a.lostCount} · {AED(a.lostValue)}</span>
          </div>
        </Card>

        {/* Conversion */}
        <Card className="p-5">
          <SectionTitle>Lead → win conversion</SectionTitle>
          <div className="flex items-stretch gap-2">
            {a.funnel.map((f, i) => (
              <div key={f.label} className="flex items-center gap-2 flex-1">
                <div className="flex-1 bg-bone rounded-card p-3 text-center">
                  <div className="text-2xl font-bold text-charcoal">{f.count}</div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mt-0.5">{f.label}</div>
                  <div className="text-[11px] text-charcoal-muted mt-1">{AED(f.value)}</div>
                </div>
                {i < a.funnel.length - 1 && <span className="text-charcoal-muted text-lg shrink-0">→</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Win rate by client type */}
      <Card className="p-5">
        <SectionTitle>Win rate by client type</SectionTitle>
        <div className="space-y-4">
          {sortedTypes.map((t) => (
            <div key={t.type}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Badge className={companyTone[t.type] ?? "bg-line"}>{t.type}</Badge>
                  <span className="text-[12px] text-charcoal-muted">{t.won} won · {t.lost} lost</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] text-charcoal-muted">{AED(t.wonValue)} won</span>
                  <span className="text-sm font-bold text-charcoal w-10 text-right">{t.winRatePct}%</span>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-bone overflow-hidden">
                <div className="h-full bg-emerald rounded-full" style={{ width: `${t.winRatePct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Concentrate bid effort where the hit rate is highest — the same pipeline intelligence Procore uses to steer firms away from low-probability work.
        </p>
      </Card>
    </Shell>
  );
}
