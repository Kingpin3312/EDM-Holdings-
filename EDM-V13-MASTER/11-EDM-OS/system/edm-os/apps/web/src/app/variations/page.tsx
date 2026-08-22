import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { AED, variationSummary as v, variationsList, variationTone } from "@/lib/data";

export default function VariationsPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Variations</h1><p className="text-sm text-charcoal-muted">Change orders and financial impact</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New variation</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Pending value</div><div className="mt-1 text-2xl font-bold">{AED(v.pendingValue)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Approved value</div><div className="mt-1 text-2xl font-bold">{AED(v.approvedValue)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Total raised</div><div className="mt-1 text-2xl font-bold">{AED(v.totalRaised)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open variations</div><div className="mt-1 text-2xl font-bold">{v.count}</div></Card>
      </div>

      <Card className="p-5">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
            <th className="py-2 font-semibold">Ref</th><th className="font-semibold">Variation</th><th className="font-semibold">Project</th>
            <th className="font-semibold text-right">Value</th><th className="font-semibold text-right">Submitted</th><th className="font-semibold">Status</th><th></th>
          </tr></thead>
          <tbody>
            {variationsList.map((x) => (
              <tr key={x.ref} className="border-b border-line/60">
                <td className="py-2.5 font-mono text-[12px]">{x.ref}</td>
                <td className="font-semibold text-charcoal">{x.title}</td>
                <td className="text-charcoal-muted">{x.project}</td>
                <td className="text-right font-semibold tabular-nums">{AED(x.value)}</td>
                <td className="text-right text-charcoal-muted">{x.submitted}</td>
                <td><Badge className={variationTone[x.status] ?? "bg-line"}>{x.status}</Badge></td>
                <td className="text-right"><span className="text-xs text-emerald font-semibold">Open →</span></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={3} className="pt-3 text-right text-[13px] font-semibold text-charcoal-muted">Total raised</td><td className="pt-3 text-right text-[15px] font-bold tabular-nums">{AED(v.totalRaised)}</td><td colSpan={3}></td></tr></tfoot>
        </table>
      </Card>
    </Shell>
  );
}
