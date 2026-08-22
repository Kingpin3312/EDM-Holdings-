import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, estimatorLoad } from "@/lib/data";
import { getEstimators } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";

export default async function EstimatorsPage() {
  const teamS = await getEstimators();
  const team = teamS.data;

  const liveBids = team.reduce((s, e) => s + e.liveBids, 0);
  const liveValue = team.reduce((s, e) => s + e.liveValue, 0);
  const turnarounds = team.map((e) => e.avgTurnaroundDays ?? 0).filter((d) => d > 0);
  const avgTurnaround = turnarounds.length ? (turnarounds.reduce((s, d) => s + d, 0) / turnarounds.length).toFixed(1) : "—";
  const atCapacity = team.filter((e) => estimatorLoad(e).pct >= 100).length;

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Estimator workload &amp; turnaround — balance the bid queue</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Assign bid</button>
      </div>
      <CrmTabs active="estimators" />
      <DataSourceBanner source={teamS.source} reason={teamS.reason} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Estimating team</div><div className="mt-1 text-2xl font-bold">{team.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Live bids in flight</div><div className="mt-1 text-2xl font-bold">{liveBids}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Value being priced</div><div className="mt-1 text-2xl font-bold">{AED(liveValue)}</div></Card>
        <Card className={`p-4 ${atCapacity > 0 ? "bg-charcoal text-white border-charcoal" : "bg-emerald text-white border-emerald"}`}><div className={`text-[11px] uppercase tracking-wider font-semibold ${atCapacity > 0 ? "text-white/70" : "text-emerald-on"}`}>At capacity</div><div className="mt-1 text-2xl font-bold">{atCapacity}</div></Card>
      </div>

      <Card className="p-5">
        <div className="flex items-baseline justify-between mb-1">
          <SectionTitle>Workload by estimator</SectionTitle>
          <span className="text-[12px] text-charcoal-muted">Avg turnaround {avgTurnaround}{avgTurnaround !== "—" ? " days" : ""}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Estimator</th>
              <th className="font-semibold">Workload</th>
              <th className="font-semibold text-right">Value pricing</th>
              <th className="font-semibold">Win rate</th>
              <th className="font-semibold text-right">Turnaround</th>
              <th className="font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {team.map((e) => {
                const load = estimatorLoad(e);
                return (
                  <tr key={e.id} className="border-b border-line/60">
                    <td className="py-3"><div className="font-semibold text-charcoal">{e.name}</div><div className="text-[11px] text-charcoal-muted">{e.role}</div></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-line overflow-hidden">
                          <div className={`h-full rounded-full ${load.pct >= 100 ? "bg-bronze" : "bg-emerald"}`} style={{ width: `${Math.min(load.pct, 100)}%` }} />
                        </div>
                        <span className="text-[12px] text-charcoal-muted tabular-nums">{e.capacity ? `${e.liveBids}/${e.capacity}` : e.liveBids}</span>
                      </div>
                    </td>
                    <td className="text-right font-semibold">{AED(e.liveValue)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-line overflow-hidden"><div className="h-full bg-emerald rounded-full" style={{ width: `${e.winRatePct}%` }} /></div>
                        <span className="text-[12px] font-semibold text-charcoal tabular-nums">{e.winRatePct}%</span>
                      </div>
                    </td>
                    <td className="text-right text-charcoal-muted">{e.avgTurnaroundDays && e.avgTurnaroundDays > 0 ? `${e.avgTurnaroundDays.toFixed(1)} d` : "—"}</td>
                    <td><Badge className={load.tone}>{load.label}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          When a senior estimator hits capacity, route the next tender to whoever has headroom and a strong win rate — the estimating queue is the throughput limit on how many bids you can chase. Win rate by estimator also shows whose pricing converts.
        </p>
      </Card>
    </Shell>
  );
}
