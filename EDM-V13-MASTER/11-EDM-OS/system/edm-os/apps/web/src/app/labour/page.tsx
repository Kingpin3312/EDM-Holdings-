import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { workforce, attendanceToday, labourAllocations, tradeTone, AED } from "@/lib/data";
import { attendanceSummary, allocationVariance } from "@/lib/labour";

const varianceTone: Record<string, string> = {
  short: "bg-bronze/15 text-bronze",
  "on-plan": "bg-emerald-soft text-emerald",
  over: "bg-sage/30 text-emerald-dark",
};

export default function LabourOverviewPage() {
  const summaries = attendanceToday.map((p) => {
    const s = attendanceSummary(p.entries);
    const planned = p.plannedByTrade.reduce((a, t) => a + t.planned, 0);
    return { ...p, s, planned, v: allocationVariance(planned, s.present) };
  });

  const deployed = summaries.reduce((a, p) => a + p.s.present, 0);
  const absent = summaries.reduce((a, p) => a + p.s.absent, 0);
  const manHours = summaries.reduce((a, p) => a + p.s.manHours, 0);
  const cost = summaries.reduce((a, p) => a + p.s.cost, 0);
  const attendancePct = deployed + absent ? Math.round((deployed / (deployed + absent)) * 100) : 0;
  const active = workforce.filter((w) => w.status === "Active").length;

  const byTrade = workforce.reduce<Record<string, number>>((acc, w) => {
    acc[w.trade] = (acc[w.trade] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Labour</h1>
          <p className="text-sm text-charcoal-muted">Workforce, allocation, attendance and productivity — the operations core</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Take attendance</button>
      </div>

      <LabourTabs active="overview" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        <StatTile label="Workforce" value={String(workforce.length)} sub={`${active} active`} accent />
        <StatTile label="Deployed today" value={String(deployed)} sub={`${absent} absent`} />
        <StatTile label="Attendance" value={`${attendancePct}%`} />
        <StatTile label="Man-hours today" value={String(manHours)} />
        <StatTile label="Labour cost today" value={AED(cost)} />
        <StatTile label="On bench" value={String(active - deployed)} />
      </div>

      <Card className="p-5 mb-5">
        <SectionTitle action={<span className="text-xs text-emerald font-semibold">Attendance →</span>}>Deployment today</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Project</th>
                <th className="font-semibold text-right">Planned</th>
                <th className="font-semibold text-right">Present</th>
                <th className="font-semibold text-right">Man-hours</th>
                <th className="font-semibold text-right">Labour cost</th>
                <th className="font-semibold text-right">Variance</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((p) => (
                <tr key={p.projectCode} className="border-b border-line/60">
                  <td className="py-2.5"><div className="font-semibold text-charcoal">{p.project}</div><div className="text-[11px] text-charcoal-muted">{p.projectCode}</div></td>
                  <td className="text-right tabular-nums">{p.planned}</td>
                  <td className="text-right tabular-nums font-semibold">{p.s.present}</td>
                  <td className="text-right tabular-nums">{p.s.manHours}</td>
                  <td className="text-right tabular-nums">{AED(p.s.cost)}</td>
                  <td className="text-right"><Badge className={varianceTone[p.v.status]}>{p.v.variance > 0 ? `+${p.v.variance}` : p.v.variance} · {p.v.pct}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">Computed live from today&apos;s attendance — headcount, man-hours and cost flow from the same engine that feeds timesheets.</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle>Workforce by trade</SectionTitle>
          <div className="space-y-2.5">
            {Object.entries(byTrade).sort((a, b) => b[1] - a[1]).map(([trade, n]) => (
              <div key={trade} className="flex items-center justify-between">
                <Badge className={tradeTone[trade] ?? "bg-line text-charcoal-muted"}>{trade}</Badge>
                <span className="text-sm font-semibold tabular-nums">{n}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle action={<span className="text-xs text-emerald font-semibold">Allocations →</span>}>Crews allocated this week</SectionTitle>
          <div className="space-y-2.5">
            {labourAllocations.map((a) => (
              <div key={a.id} className="flex items-center justify-between border-b border-line/60 pb-2 last:border-0">
                <div>
                  <div className="text-[13px] font-semibold text-charcoal">{a.project}</div>
                  <div className="text-[11px] text-charcoal-muted">{a.zone} · {a.supervisor}</div>
                </div>
                <div className="text-right"><Badge className={tradeTone[a.trade] ?? "bg-line text-charcoal-muted"}>{a.trade}</Badge><div className="text-[11px] text-charcoal-muted mt-1">{a.planned} planned</div></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
