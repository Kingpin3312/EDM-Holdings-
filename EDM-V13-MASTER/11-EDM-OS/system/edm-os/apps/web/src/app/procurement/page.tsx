import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, procurementSummary as p, posList, suppliersList, poStatusTone } from "@/lib/data";

const stars = (n: number) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

export default function ProcurementPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Procurement</h1><p className="text-sm text-charcoal-muted">Suppliers, purchase orders and spend</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New PO</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Committed spend</div><div className="mt-1 text-2xl font-bold">{AED(p.committedSpend)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open POs</div><div className="mt-1 text-2xl font-bold">{p.openPOs}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Awaiting delivery</div><div className="mt-1 text-2xl font-bold">{AED(p.awaitingDelivery)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Suppliers</div><div className="mt-1 text-2xl font-bold">{p.suppliers}</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Purchase orders</SectionTitle>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">PO</th><th className="font-semibold">Supplier</th><th className="font-semibold text-right">Lines</th>
              <th className="font-semibold text-right">Value</th><th className="font-semibold">Status</th><th className="font-semibold text-right">Expected</th>
            </tr></thead>
            <tbody>
              {posList.map((o) => (
                <tr key={o.poNo} className="border-b border-line/60">
                  <td className="py-2.5 font-mono text-[12px]">{o.poNo}</td>
                  <td className="font-semibold text-charcoal">{o.supplier}</td>
                  <td className="text-right tabular-nums">{o.lines}</td>
                  <td className="text-right font-semibold tabular-nums">{AED(o.value)}</td>
                  <td><Badge className={poStatusTone[o.status] ?? "bg-line"}>{o.status}</Badge></td>
                  <td className="text-right text-charcoal-muted">{o.expected}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan={3} className="pt-3 text-right text-[13px] font-semibold text-charcoal-muted">Committed</td><td className="pt-3 text-right text-[15px] font-bold tabular-nums">{AED(p.committedSpend)}</td><td colSpan={2}></td></tr></tfoot>
          </table>
        </Card>

        <Card className="p-5">
          <SectionTitle>Suppliers</SectionTitle>
          {suppliersList.map((s) => (
            <div key={s.name} className="py-3 border-b border-line/60 last:border-0">
              <div className="flex justify-between items-start gap-2">
                <div className="font-semibold text-[13px] text-charcoal">{s.name}</div>
                <span className="text-bronze text-[13px] tracking-tight">{stars(s.rating)}</span>
              </div>
              <div className="text-[11px] text-charcoal-muted mt-0.5">{s.trade} · {s.pos} PO{s.pos === 1 ? "" : "s"}</div>
            </div>
          ))}
        </Card>
      </div>
    </Shell>
  );
}
