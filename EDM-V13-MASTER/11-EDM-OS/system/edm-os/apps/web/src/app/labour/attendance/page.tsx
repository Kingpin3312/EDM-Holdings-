import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { attendanceToday, tradeTone, AED } from "@/lib/data";
import { attendanceSummary, allocationVariance } from "@/lib/labour";

const statusTone: Record<string, string> = {
  PRESENT: "bg-emerald-soft text-emerald",
  ABSENT: "bg-bronze/15 text-bronze",
  SICK: "bg-amber-100 text-amber-800",
  LEAVE: "bg-line text-charcoal-muted",
};
const varianceTone: Record<string, string> = {
  short: "bg-bronze/15 text-bronze",
  "on-plan": "bg-emerald-soft text-emerald",
  over: "bg-sage/30 text-emerald-dark",
};

export default function AttendancePage() {
  const summaries = attendanceToday.map((p) => {
    const s = attendanceSummary(p.entries);
    const planned = p.plannedByTrade.reduce((a, t) => a + t.planned, 0);
    return { ...p, s, planned, v: allocationVariance(planned, s.present) };
  });
  const present = summaries.reduce((a, p) => a + p.s.present, 0);
  const manHours = summaries.reduce((a, p) => a + p.s.manHours, 0);
  const overtime = summaries.reduce((a, p) => a + p.s.overtimeHours, 0);
  const cost = summaries.reduce((a, p) => a + p.s.cost, 0);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Attendance — today</h1>
          <p className="text-sm text-charcoal-muted">Who is on site, by project. Hours and cost calculate as you mark them.</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Submit attendance</button>
      </div>

      <LabourTabs active="attendance" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="On site" value={String(present)} accent />
        <StatTile label="Man-hours" value={String(manHours)} sub={`${overtime} OT`} />
        <StatTile label="Labour cost" value={AED(cost)} />
        <StatTile label="Projects active" value={String(summaries.length)} />
      </div>

      <div className="space-y-4">
        {summaries.map((p) => (
          <Card key={p.projectCode} className="p-5">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-sm font-bold text-charcoal">{p.project}</h2>
                <p className="text-[11px] text-charcoal-muted">{p.projectCode}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={varianceTone[p.v.status]}>
                  {p.s.present}/{p.planned} present · {p.v.variance > 0 ? `+${p.v.variance}` : p.v.variance}
                </Badge>
                <span className="text-[12px] text-charcoal-muted">{p.s.manHours} hrs · {AED(p.s.cost)}</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                    <th className="py-2 font-semibold">Operative</th>
                    <th className="font-semibold">Trade</th>
                    <th className="font-semibold">Status</th>
                    <th className="font-semibold text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {p.entries.map((e) => (
                    <tr key={e.workerId} className="border-b border-line/60">
                      <td className="py-2.5 font-semibold text-charcoal">{e.name}</td>
                      <td><Badge className={tradeTone[e.trade] ?? "bg-line text-charcoal-muted"}>{e.trade}</Badge></td>
                      <td><Badge className={statusTone[e.status]}>{e.status}</Badge></td>
                      <td className="text-right tabular-nums">{e.hours > 9 ? <span>9 <span className="text-bronze">+{e.hours - 9} OT</span></span> : e.hours || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
