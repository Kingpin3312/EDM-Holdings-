import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, estimateSheet as e, estStatusTone } from "@/lib/data";

function Row({ label, value, strong, accent }: { label: string; value: string; strong?: boolean; accent?: boolean }) {
  return (
    <div className={`flex justify-between py-2 ${accent ? "bg-emerald text-white px-3 rounded" : ""}`}>
      <span className={`text-[13px] ${strong ? "font-bold" : ""} ${accent ? "text-white" : "text-charcoal-muted"}`}>{label}</span>
      <span className={`text-[13px] font-semibold ${accent ? "text-white" : "text-charcoal"}`}>{value}</span>
    </div>
  );
}

export default function EstimateSheet() {
  const cat = e.categories;
  return (
    <Shell>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">{e.ref}</h1>
            <Badge className={estStatusTone[e.status] ?? "bg-line"}>{e.status}</Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-0.5">{e.title}</p>
        </div>
        <div className="flex gap-2">
          <button className="border border-line text-charcoal text-sm font-semibold px-4 py-2 rounded-card">Add line</button>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Generate quotation</button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* BOQ lines */}
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Bill of quantities</SectionTitle>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Description</th><th className="font-semibold">Trade</th>
              <th className="font-semibold text-right">Qty</th><th className="font-semibold">Unit</th>
              <th className="font-semibold text-right">Rate</th><th className="font-semibold text-right">Total</th>
            </tr></thead>
            <tbody>
              {e.lines.map((l) => (
                <tr key={l.desc} className="border-b border-line/60">
                  <td className="py-2.5 text-charcoal">{l.desc}</td>
                  <td><Badge className="bg-emerald-soft text-emerald">{l.trade}</Badge></td>
                  <td className="text-right tabular-nums">{l.qty.toLocaleString()}</td>
                  <td className="text-charcoal-muted">{l.unit}</td>
                  <td className="text-right tabular-nums">{l.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="text-right font-semibold tabular-nums">{AED(l.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={5} className="pt-3 text-right text-[13px] font-semibold text-charcoal-muted">Direct cost</td><td className="pt-3 text-right text-[15px] font-bold">{AED(e.directCost)}</td></tr>
            </tfoot>
          </table>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[["Labour", cat.labour], ["Material", cat.material], ["Plant", cat.plant], ["Subcontract", cat.subcontract]].map(([k, v]) => (
              <div key={k as string} className="bg-bone rounded p-3">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-charcoal-muted">{k}</div>
                <div className="text-[15px] font-bold mt-1">{AED(v as number)}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing summary */}
        <div className="space-y-5">
          <Card className="p-5">
            <SectionTitle>Pricing summary</SectionTitle>
            <Row label="Direct cost" value={AED(e.directCost)} />
            <Row label={`Overhead (${e.markups.overheadPct}%)`} value={AED(e.overhead)} />
            <Row label={`Contingency (${e.markups.contingencyPct}%)`} value={AED(e.contingency)} />
            <Row label={`Profit (${e.markups.profitPct}%)`} value={AED(e.profit)} />
            <div className="border-t border-line my-2" />
            <Row label="Sell price" value={AED(e.sellPrice)} strong accent />
            <div className="mt-3 flex justify-between items-center bg-emerald-soft rounded px-3 py-2">
              <span className="text-[12px] font-semibold text-emerald uppercase tracking-wider">Margin</span>
              <span className="text-lg font-bold text-emerald-dark">{e.marginPct}%</span>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>Cost by trade</SectionTitle>
            <div className="space-y-2">
              {Object.entries(e.byTrade).map(([trade, val]) => {
                const pct = Math.round((val / e.directCost) * 100);
                return (
                  <div key={trade}>
                    <div className="flex justify-between text-[12px] mb-1"><span className="font-semibold text-charcoal">{trade}</span><span className="text-charcoal-muted">{AED(val)} · {pct}%</span></div>
                    <div className="h-1.5 bg-line rounded-full overflow-hidden"><div className="h-full bg-emerald" style={{ width: `${pct}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
