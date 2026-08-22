import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { AED, tenders, statusTone } from "@/lib/data";

export default function TendersPage() {
  const weighted = tenders.filter(t => t.prob > 0).reduce((s, t) => s + t.value * (t.prob / 100), 0);
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Tenders</h1><p className="text-sm text-charcoal-muted">Pipeline and submission tracking</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New tender</button>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Live tenders</div><div className="mt-1 text-2xl font-bold">{tenders.filter(t=>t.prob>0).length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Gross value</div><div className="mt-1 text-2xl font-bold">{AED(tenders.reduce((s,t)=>s+t.value,0))}</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Weighted value</div><div className="mt-1 text-2xl font-bold">{AED(weighted)}</div></Card>
      </div>
      <Card className="p-5">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
            <th className="py-2 font-semibold">Tender no.</th><th className="font-semibold">Project</th><th className="font-semibold">Main contractor</th>
            <th className="font-semibold text-right">Value</th><th className="font-semibold text-right">Win %</th><th className="font-semibold text-right">Due</th><th className="font-semibold text-right">Status</th>
          </tr></thead>
          <tbody>
            {tenders.map((t) => (
              <tr key={t.no} className="border-b border-line/60">
                <td className="py-2.5 font-mono text-[12px]">{t.no}</td>
                <td className="font-semibold text-charcoal">{t.project}</td>
                <td className="text-charcoal-muted">{t.contractor}</td>
                <td className="text-right font-semibold">{AED(t.value)}</td>
                <td className="text-right">{t.prob}%</td>
                <td className="text-right text-charcoal-muted">{t.due}</td>
                <td className="text-right"><Badge className={statusTone[t.status] ?? "bg-line"}>{t.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}
