import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge } from "@/components/ui";
import { AED, pipelineBoard, wonRollup } from "@/lib/data";
import Link from "next/link";

export default function PipelinePage() {
  const grandWeighted = pipelineBoard.reduce((s, c) => s + c.items.reduce((a, o) => a + o.value * (o.prob / 100), 0), 0);
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Opportunity pipeline — weighted {AED(grandWeighted)}</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New opportunity</button>
      </div>
      <CrmTabs active="pipeline" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open opportunities</div><div className="mt-1 text-2xl font-bold">{pipelineBoard.reduce((s, c) => s + c.items.length, 0)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Weighted pipeline</div><div className="mt-1 text-2xl font-bold">{AED(grandWeighted)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Won (count)</div><div className="mt-1 text-2xl font-bold">{wonRollup.count}</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Won value</div><div className="mt-1 text-2xl font-bold">{AED(wonRollup.value)}</div></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {pipelineBoard.map((col) => {
          const gross = col.items.reduce((s, o) => s + o.value, 0);
          const weighted = col.items.reduce((s, o) => s + o.value * (o.prob / 100), 0);
          return (
            <div key={col.stage} className="bg-bone rounded-card p-3">
              <div className="mb-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald">{col.stage}</span>
                  <span className="text-[11px] text-charcoal-muted">{col.items.length}</span>
                </div>
                <div className="text-[11px] text-charcoal-muted mt-1">{AED(gross)} · weighted {AED(weighted)}</div>
              </div>
              <div className="space-y-2">
                {col.items.map((o) => (
                  <Link key={o.name} href={`/crm/opportunities/${o.id}`} className="block bg-white border border-line rounded p-3 hover:border-emerald transition-colors">
                    <div className="font-semibold text-[13px] text-charcoal leading-tight">{o.name}</div>
                    <div className="text-[11px] text-charcoal-muted mt-0.5">{o.co}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[12px] font-semibold">{AED(o.value)}</span>
                      <Badge className="bg-emerald-soft text-emerald">{o.prob}%</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
