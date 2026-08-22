import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { AED, projects, statusTone } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Projects</h1><p className="text-sm text-charcoal-muted">Active delivery across the UAE</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New project</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p) => (
          <Card key={p.code} className="p-5">
            <div className="flex items-start justify-between">
              <div><div className="font-semibold text-charcoal text-[15px]">{p.name}</div><div className="text-[11px] text-charcoal-muted">{p.code} · {p.emirate}</div></div>
              <Badge className={statusTone[p.status] ?? "bg-line"}>{p.status}</Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div><div className="text-lg font-bold">{p.progress}%</div><div className="text-[10px] uppercase tracking-wider text-charcoal-muted">Complete</div></div>
              <div><div className="text-lg font-bold">{p.rfis}</div><div className="text-[10px] uppercase tracking-wider text-charcoal-muted">Open RFIs</div></div>
              <div><div className="text-lg font-bold">{p.variations}</div><div className="text-[10px] uppercase tracking-wider text-charcoal-muted">Variations</div></div>
            </div>
            <div className="mt-4 h-1.5 bg-line rounded-full overflow-hidden"><div className="h-full bg-emerald" style={{ width: `${p.progress}%` }} /></div>
            <div className="mt-2 text-[12px] text-charcoal-muted">Contract value {AED(p.value)}</div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
