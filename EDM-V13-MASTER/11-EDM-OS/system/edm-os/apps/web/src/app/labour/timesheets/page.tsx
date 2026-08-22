import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { weeklyTimesheets, timesheetWeekLabel, tradeTone, AED, chargeRateFor, gradeForWorker } from "@/lib/data";
import { aggregateTimesheet, timesheetCharge, timesheetMargin } from "@/lib/labour";

const marginTone = (pct: number) => (pct < 20 ? "bg-bronze/15 text-bronze" : pct >= 35 ? "bg-emerald-soft text-emerald" : "bg-sage/30 text-emerald-dark");

export default function TimesheetsPage() {
  const rows = weeklyTimesheets.map((t) => {
    const agg = aggregateTimesheet(t.days, t.dayRate);
    const grade = gradeForWorker(t.workerId);
    const chargeRate = chargeRateFor(t.trade, grade); // from the rate card, by trade + grade
    const charge = timesheetCharge({ regularHours: agg.regularHours, overtimeHours: agg.overtimeHours, chargeRate });
    const m = timesheetMargin(agg.cost, charge);
    return { ...t, ...agg, grade, chargeRate, charge, ...m };
  });

  const totalHours = rows.reduce((a, r) => a + r.totalHours, 0);
  const totalCost = rows.reduce((a, r) => a + r.cost, 0);
  const totalCharge = rows.reduce((a, r) => a + r.charge, 0);
  const totalMargin = totalCharge - totalCost;
  const marginPct = totalCharge ? Math.round((totalMargin / totalCharge) * 1000) / 10 : 0;

  // roll up by project
  const projects = rows.reduce<Record<string, { project: string; hours: number; cost: number; charge: number }>>((acc, r) => {
    const p = (acc[r.projectCode] = acc[r.projectCode] ?? { project: r.project, hours: 0, cost: 0, charge: 0 });
    p.hours += r.totalHours; p.cost += r.cost; p.charge += r.charge;
    return acc;
  }, {});

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Timesheets</h1>
          <p className="text-sm text-charcoal-muted">{timesheetWeekLabel} — attendance turned into payable cost and billable charge</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Export for payroll</button>
      </div>

      <LabourTabs active="timesheets" />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
        <StatTile label="Man-hours" value={String(Math.round(totalHours))} accent />
        <StatTile label="Labour cost" value={AED(totalCost)} />
        <StatTile label="Billable charge" value={AED(totalCharge)} />
        <StatTile label="Margin" value={AED(totalMargin)} />
        <StatTile label="Margin %" value={`${marginPct}%`} />
      </div>

      <Card className="p-5 mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Operative</th>
                <th className="font-semibold">Trade</th>
                <th className="font-semibold text-right">Days</th>
                <th className="font-semibold text-right">Reg</th>
                <th className="font-semibold text-right">OT</th>
                <th className="font-semibold text-right">Cost</th>
                <th className="font-semibold text-right">Charge</th>
                <th className="font-semibold text-right">Margin</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.workerId} className="border-b border-line/60">
                  <td className="py-2.5"><div className="font-semibold text-charcoal">{r.name}</div><div className="text-[11px] text-charcoal-muted">{r.grade} · {r.project}</div></td>
                  <td><Badge className={tradeTone[r.trade] ?? "bg-line text-charcoal-muted"}>{r.trade}</Badge></td>
                  <td className="text-right tabular-nums">{r.daysWorked}</td>
                  <td className="text-right tabular-nums">{r.regularHours}</td>
                  <td className="text-right tabular-nums">{r.overtimeHours ? <span className="text-bronze">{r.overtimeHours}</span> : "—"}</td>
                  <td className="text-right tabular-nums">{AED(r.cost)}</td>
                  <td className="text-right tabular-nums">{AED(r.charge)}</td>
                  <td className="text-right"><Badge className={marginTone(r.marginPct)}>{AED(r.margin)} · {r.marginPct}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">Cost is the day rate split into regular and overtime; charge is each operative&apos;s man-hours at the <a href="/labour/rates" className="text-emerald font-semibold">rate-card</a> rate for their trade and grade. Margin is the gap — the number that says whether a crew is actually earning.</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-charcoal mb-3">By project</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Project</th>
                <th className="font-semibold text-right">Man-hours</th>
                <th className="font-semibold text-right">Cost</th>
                <th className="font-semibold text-right">Charge</th>
                <th className="font-semibold text-right">Margin %</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(projects).map((p) => {
                const mpct = p.charge ? Math.round(((p.charge - p.cost) / p.charge) * 1000) / 10 : 0;
                return (
                  <tr key={p.project} className="border-b border-line/60">
                    <td className="py-2.5 font-semibold text-charcoal">{p.project}</td>
                    <td className="text-right tabular-nums">{Math.round(p.hours)}</td>
                    <td className="text-right tabular-nums">{AED(p.cost)}</td>
                    <td className="text-right tabular-nums">{AED(p.charge)}</td>
                    <td className="text-right"><Badge className={marginTone(mpct)}>{mpct}%</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
