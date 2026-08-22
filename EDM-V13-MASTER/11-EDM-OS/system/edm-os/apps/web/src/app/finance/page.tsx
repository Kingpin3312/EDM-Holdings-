import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, finVal, finCost, finMargin, finCash, cvrRows, cvrTotals } from "@/lib/data";

export default function FinancePage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Finance</h1><p className="text-sm text-charcoal-muted">Cost-value reconciliation — Sheikh Zayed Road HQ</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New application</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Forecast value</div><div className="mt-1 text-xl font-bold">{AED(finVal.forecast)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Forecast cost</div><div className="mt-1 text-xl font-bold">{AED(finCost.budget)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Forecast margin</div><div className="mt-1 text-xl font-bold text-emerald">{AED(finMargin.forecast)}</div><div className="text-[11px] text-charcoal-muted">{finMargin.pct}% of value</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Cash outstanding</div><div className="mt-1 text-xl font-bold text-bronze">{AED(finCash.outstanding)}</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Cost-value reconciliation</SectionTitle>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Code</th><th className="font-semibold">Cost head</th>
              <th className="font-semibold text-right">Budget</th><th className="font-semibold text-right">Committed</th><th className="font-semibold text-right">Actual</th><th className="font-semibold text-right">Variance</th>
            </tr></thead>
            <tbody>
              {cvrRows.map((r) => (
                <tr key={r.code} className="border-b border-line/60">
                  <td className="py-2.5 font-mono text-[12px]">{r.code}</td>
                  <td className="font-semibold text-charcoal">{r.desc}</td>
                  <td className="text-right tabular-nums">{AED(r.budget)}</td>
                  <td className="text-right tabular-nums text-charcoal-muted">{AED(r.committed)}</td>
                  <td className="text-right tabular-nums text-charcoal-muted">{AED(r.actual)}</td>
                  <td className={`text-right tabular-nums font-semibold ${r.variance > 0 ? "text-emerald" : "text-charcoal-muted"}`}>{AED(r.variance)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr className="border-t-2 border-line font-bold">
              <td colSpan={2} className="pt-2.5 text-[12px] uppercase tracking-wider text-charcoal-muted">Total</td>
              <td className="pt-2.5 text-right tabular-nums">{AED(cvrTotals.budget)}</td>
              <td className="pt-2.5 text-right tabular-nums">{AED(cvrTotals.committed)}</td>
              <td className="pt-2.5 text-right tabular-nums">{AED(cvrTotals.actual)}</td>
              <td className="pt-2.5 text-right tabular-nums text-emerald">{AED(cvrTotals.variance)}</td>
            </tr></tfoot>
          </table>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <SectionTitle>Value bridge</SectionTitle>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-charcoal-muted">Contract sum</span><span className="font-semibold tabular-nums">{AED(finVal.contract)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-muted">Approved variations</span><span className="font-semibold tabular-nums text-emerald">+ {AED(finVal.variations)}</span></div>
              <div className="flex justify-between pt-2 border-t border-line"><span className="font-semibold">Forecast value</span><span className="font-bold tabular-nums">{AED(finVal.forecast)}</span></div>
            </div>
          </Card>
          <Card className="p-5">
            <SectionTitle>Cash position</SectionTitle>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-charcoal-muted">Certified to date</span><span className="font-semibold tabular-nums">{AED(finCash.certified)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-muted">Paid</span><span className="font-semibold tabular-nums">{AED(finCash.paid)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-muted">Outstanding</span><span className="font-semibold tabular-nums text-bronze">{AED(finCash.outstanding)}</span></div>
              <div className="flex justify-between"><span className="text-charcoal-muted">Retention held</span><span className="font-semibold tabular-nums">{AED(finCash.retention)}</span></div>
              <div className="flex justify-between pt-2 border-t border-line"><span className="text-charcoal-muted">Application pending</span><span className="font-semibold tabular-nums">{AED(finCash.pending)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
