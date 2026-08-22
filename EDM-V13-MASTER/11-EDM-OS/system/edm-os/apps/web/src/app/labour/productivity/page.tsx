import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { labourProductivity, tradeTone } from "@/lib/data";
import { productivity, productivityVsTarget } from "@/lib/labour";

const tone: Record<string, string> = {
  below: "bg-bronze/15 text-bronze",
  "on-target": "bg-emerald-soft text-emerald",
  above: "bg-sage/30 text-emerald-dark",
};

export default function ProductivityPage() {
  const rows = labourProductivity.map((t) => {
    const p = productivity({ installedQty: t.installed, manHours: t.manHours });
    const vt = productivityVsTarget(p.perManDay, t.targetPerManDay);
    return { ...t, ...p, vt };
  });
  const totalManHours = rows.reduce((a, r) => a + r.manHours, 0);
  const belowTarget = rows.filter((r) => r.vt.status === "below").length;

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Productivity</h1>
          <p className="text-sm text-charcoal-muted">Installed output per man-day against the rate the work was priced at</p>
        </div>
      </div>

      <LabourTabs active="productivity" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Trades tracked" value={String(rows.length)} accent />
        <StatTile label="Man-hours logged" value={String(totalManHours)} />
        <StatTile label="Below target" value={String(belowTarget)} sub={belowTarget ? "needs attention" : "all on/above"} />
        <StatTile label="Standard day" value="9 hrs" />
      </div>

      <Card className="p-5 mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Trade</th>
                <th className="font-semibold text-right">Installed</th>
                <th className="font-semibold text-right">Man-hours</th>
                <th className="font-semibold text-right">Per man-day</th>
                <th className="font-semibold text-right">Target</th>
                <th className="font-semibold text-right">vs target</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.trade} className="border-b border-line/60">
                  <td className="py-2.5"><Badge className={tradeTone[r.trade] ?? "bg-line text-charcoal-muted"}>{r.trade}</Badge></td>
                  <td className="text-right tabular-nums">{r.installed} {r.unit}</td>
                  <td className="text-right tabular-nums">{r.manHours}</td>
                  <td className="text-right tabular-nums font-semibold">{r.perManDay} {r.unit}</td>
                  <td className="text-right tabular-nums text-charcoal-muted">{r.targetPerManDay} {r.unit}</td>
                  <td className="text-right"><Badge className={tone[r.vt.status]}>{r.vt.pct}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">Per man-day is installed quantity ÷ man-days (man-hours ÷ 9). Below 95% of target is the early warning that a trade is eroding the margin it was priced at.</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((r) => (
          <Card key={r.trade} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={tradeTone[r.trade] ?? "bg-line text-charcoal-muted"}>{r.trade}</Badge>
              <Badge className={tone[r.vt.status]}>{r.vt.status}</Badge>
            </div>
            <div className="text-2xl font-bold text-charcoal">{r.perManDay} <span className="text-sm font-medium text-charcoal-muted">{r.unit}/man-day</span></div>
            <div className="mt-2 h-1.5 bg-line rounded-full overflow-hidden">
              <div className={`h-full ${r.vt.status === "below" ? "bg-bronze" : "bg-emerald"}`} style={{ width: `${Math.min(r.vt.pct, 100)}%` }} />
            </div>
            <div className="mt-1.5 text-[11px] text-charcoal-muted">{r.vt.pct}% of target ({r.targetPerManDay} {r.unit})</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
