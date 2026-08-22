import { Shell } from "@/components/Shell";
import { Card, StatTile, Badge, SectionTitle } from "@/components/ui";
import { AED, executiveKpis as k, revenueByMonth, tenders, projects, statusTone } from "@/lib/data";

export default function Dashboard() {
  const maxRev = Math.max(...revenueByMonth.map((r) => r.v));
  return (
    <Shell>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">Executive dashboard</h1>
        <p className="text-sm text-charcoal-muted">Live view of pipeline, projects and cash — August 2026</p>
      </div>

      {/* KPI band */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <StatTile label="Weighted pipeline" value={AED(k.weightedPipeline)} sub={`${AED(k.tenderGross)} gross`} accent />
        <StatTile label="Active projects" value={String(k.activeProjects)} sub="3 emirates" />
        <StatTile label="Revenue (month)" value={AED(k.monthRevenue)} sub={`${k.grossProfitPct}% gross profit`} />
        <StatTile label="Cash position" value={AED(k.cashPosition)} sub="net of facilities" />
        <StatTile label="Outstanding" value={AED(k.outstandingInvoices)} sub={`${AED(k.retentionsHeld)} retention held`} />
        <StatTile label="Labour utilisation" value={`${k.labourUtilisation}%`} sub="vetted crews" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Revenue — trailing 8 months (AED 000s)</SectionTitle>
          <div className="flex items-end gap-3 h-44 mt-4">
            {revenueByMonth.map((r) => (
              <div key={r.m} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                <div className="w-full bg-emerald rounded-t" style={{ height: `${(r.v / maxRev) * 100}%` }} />
                <div className="text-[11px] text-charcoal-muted">{r.m}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Approvals / risk column */}
        <div className="space-y-3">
          <Card className="p-4">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Variations pending</div>
            <div className="mt-1 text-2xl font-bold">{AED(k.variationsPendingValue)}</div>
            <div className="text-xs text-charcoal-muted">{k.variationsPendingCount} awaiting client decision</div>
          </Card>
          <Card className="p-4">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Retentions held</div>
            <div className="mt-1 text-2xl font-bold">{AED(k.retentionsHeld)}</div>
            <div className="text-xs text-charcoal-muted">across active + closing projects</div>
          </Card>
          <Card className="p-4 bg-emerald-soft border-emerald/20">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald">Win probability (weighted)</div>
            <div className="mt-1 text-2xl font-bold text-emerald-dark">43%</div>
            <div className="text-xs text-emerald">blended across live tenders</div>
          </Card>
        </div>
      </div>

      {/* Tender pipeline */}
      <Card className="mt-5 p-5">
        <SectionTitle action={<a className="text-xs text-emerald font-semibold" href="/tenders">View all</a>}>Tender pipeline</SectionTitle>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Tender</th><th className="font-semibold">Main contractor</th>
              <th className="font-semibold text-right">Value</th><th className="font-semibold text-right">Win %</th>
              <th className="font-semibold text-right">Due</th><th className="font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((t) => (
              <tr key={t.no} className="border-b border-line/60">
                <td className="py-2.5"><div className="font-semibold text-charcoal">{t.project}</div><div className="text-[11px] text-charcoal-muted">{t.no}</div></td>
                <td className="text-charcoal-muted">{t.contractor}</td>
                <td className="text-right font-semibold">{AED(t.value)}</td>
                <td className="text-right">{t.prob}%</td>
                <td className="text-right text-charcoal-muted">{t.due}</td>
                <td className="text-right"><Badge className={statusTone[t.status] ?? "bg-line"}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Active projects */}
      <Card className="mt-5 p-5">
        <SectionTitle action={<a className="text-xs text-emerald font-semibold" href="/projects">View all</a>}>Active projects</SectionTitle>
        <div className="grid md:grid-cols-2 gap-3">
          {projects.map((p) => (
            <div key={p.code} className="border border-line rounded-card p-4">
              <div className="flex items-start justify-between">
                <div><div className="font-semibold text-charcoal">{p.name}</div><div className="text-[11px] text-charcoal-muted">{p.code} · {p.emirate}</div></div>
                <Badge className={statusTone[p.status] ?? "bg-line"}>{p.status}</Badge>
              </div>
              <div className="mt-3 h-1.5 bg-line rounded-full overflow-hidden">
                <div className="h-full bg-emerald" style={{ width: `${p.progress}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-charcoal-muted">
                <span>{p.progress}% complete · {AED(p.value)}</span><span>{p.rfis} RFIs · {p.variations} VOs</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
