import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { tradeKpis as k, tradeCards, tradeLog } from "@/lib/data";

export default function TradesPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Trade progress</h1><p className="text-sm text-charcoal-muted">Installed quantities by trade — Sheikh Zayed Road HQ</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Log progress</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Overall completion</div><div className="mt-1 text-2xl font-bold">{k.avgCompletion}%</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Trades tracked</div><div className="mt-1 text-2xl font-bold">{k.tradesTracked}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Total installed</div><div className="mt-1 text-2xl font-bold">{k.totalInstalled.toLocaleString()} m²</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Records</div><div className="mt-1 text-2xl font-bold">{k.records}</div></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {tradeCards.map((t) => (
          <Card key={t.trade} className="p-5">
            <div className="flex items-baseline justify-between">
              <h3 className="font-bold text-charcoal">{t.trade}</h3>
              <span className="text-[12px] text-charcoal-muted">{t.installed.toLocaleString()} / {t.target.toLocaleString()} {t.unit}</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-bold text-emerald">{t.pct}%</span>
              <span className="text-[11px] text-charcoal-muted mb-1.5">installed</span>
            </div>
            <div className="mt-2 h-2 bg-line rounded-full overflow-hidden"><div className="h-full bg-emerald" style={{ width: `${t.pct}%` }} /></div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {t.attrs.map((a) => <Badge key={a} className="bg-bone text-charcoal-muted">{a}</Badge>)}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <SectionTitle>Progress log</SectionTitle>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
            <th className="py-2 font-semibold">Trade</th><th className="font-semibold">Area</th><th className="font-semibold text-right">Quantity</th><th className="font-semibold">Detail</th><th className="font-semibold text-right">Logged</th>
          </tr></thead>
          <tbody>
            {tradeLog.map((l, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-2.5"><Badge className="bg-emerald-soft text-emerald">{l.trade}</Badge></td>
                <td className="text-charcoal-muted">{l.area}</td>
                <td className="text-right font-semibold tabular-nums">{l.qty}</td>
                <td className="text-charcoal-muted">{l.detail}</td>
                <td className="text-right text-charcoal-muted">{l.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}
