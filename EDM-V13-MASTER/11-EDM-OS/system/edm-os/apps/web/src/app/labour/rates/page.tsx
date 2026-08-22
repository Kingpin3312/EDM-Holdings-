import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { labourRateCard, workforce, chargeRateFor, AED, tradeTone } from "@/lib/data";

const GRADES = ["Charge hand", "Operative", "Apprentice"];

export default function RateCardPage() {
  const trades = [...new Set(labourRateCard.map((r) => r.trade))];

  // average cost-vs-charge spread to show the rate card actually protects margin
  const sample = workforce
    .filter((w) => w.status === "Active")
    .map((w) => {
      const costHr = w.dayRate / 9;
      const chargeHr = chargeRateFor(w.trade, w.grade);
      return { ...w, costHr, chargeHr, markupPct: costHr ? Math.round(((chargeHr - costHr) / costHr) * 100) : 0 };
    });
  const avgMarkup = Math.round(sample.reduce((a, s) => a + s.markupPct, 0) / sample.length);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Rate card</h1>
          <p className="text-sm text-charcoal-muted">Charge-out rates billed to the main contractor — the source for timesheet billing</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Edit rates</button>
      </div>

      <LabourTabs active="rates" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Trades priced" value={String(trades.length)} accent />
        <StatTile label="Rate lines" value={String(labourRateCard.length)} />
        <StatTile label="Avg markup on cost" value={`${avgMarkup}%`} />
        <StatTile label="Basis" value="Per man-hour" />
      </div>

      <Card className="p-5 mb-5">
        <h2 className="text-sm font-bold text-charcoal mb-3">Charge-out matrix (AED / man-hour)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Trade</th>
                {GRADES.map((g) => <th key={g} className="font-semibold text-right">{g}</th>)}
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t} className="border-b border-line/60">
                  <td className="py-2.5"><Badge className={tradeTone[t] ?? "bg-line text-charcoal-muted"}>{t}</Badge></td>
                  {GRADES.map((g) => {
                    const rate = chargeRateFor(t, g);
                    return <td key={g} className="text-right tabular-nums font-semibold">{rate ? AED(rate) : <span className="text-charcoal-muted">—</span>}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">These rates feed the <a href="/labour/timesheets" className="text-emerald font-semibold">timesheets</a> directly — change a rate here and every margin recalculates.</p>
      </Card>

      <Card className="p-5">
        <h2 className="text-sm font-bold text-charcoal mb-3">Cost vs charge — current crew</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[620px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Operative</th>
                <th className="font-semibold">Grade</th>
                <th className="font-semibold text-right">Cost /hr</th>
                <th className="font-semibold text-right">Charge /hr</th>
                <th className="font-semibold text-right">Markup</th>
              </tr>
            </thead>
            <tbody>
              {sample.map((s) => (
                <tr key={s.id} className="border-b border-line/60">
                  <td className="py-2.5"><div className="font-semibold text-charcoal">{s.name}</div><div className="text-[11px] text-charcoal-muted">{s.trade}</div></td>
                  <td className="text-charcoal-muted">{s.grade}</td>
                  <td className="text-right tabular-nums">{AED(Math.round(s.costHr))}</td>
                  <td className="text-right tabular-nums">{AED(s.chargeHr)}</td>
                  <td className="text-right"><Badge className={s.markupPct < 40 ? "bg-bronze/15 text-bronze" : "bg-emerald-soft text-emerald"}>{s.markupPct}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
