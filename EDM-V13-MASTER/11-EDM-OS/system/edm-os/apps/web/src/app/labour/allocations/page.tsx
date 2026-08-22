import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { labourAllocations, tradeTone } from "@/lib/data";

export default function AllocationsPage() {
  const projects = new Set(labourAllocations.map((a) => a.projectCode)).size;
  const plannedTotal = labourAllocations.reduce((a, x) => a + x.planned, 0);

  // group by project
  const byProject = labourAllocations.reduce<Record<string, typeof labourAllocations>>((acc, a) => {
    (acc[a.projectCode] = acc[a.projectCode] ?? []).push(a);
    return acc;
  }, {});

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Allocations</h1>
          <p className="text-sm text-charcoal-muted">Which crews are committed to which projects this week</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Allocate crew</button>
      </div>

      <LabourTabs active="allocations" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Active projects" value={String(projects)} accent />
        <StatTile label="Crews allocated" value={String(labourAllocations.length)} />
        <StatTile label="Heads planned" value={String(plannedTotal)} />
        <StatTile label="Period" value="This week" />
      </div>

      <div className="space-y-4">
        {Object.entries(byProject).map(([code, rows]) => (
          <Card key={code} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-charcoal">{rows[0].project}</h2>
                <p className="text-[11px] text-charcoal-muted">{code}</p>
              </div>
              <Badge className="bg-emerald-soft text-emerald">{rows.reduce((a, r) => a + r.planned, 0)} heads planned</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                    <th className="py-2 font-semibold">Trade</th>
                    <th className="font-semibold">Zone</th>
                    <th className="font-semibold">Supervisor</th>
                    <th className="font-semibold text-right">Planned</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => (
                    <tr key={a.id} className="border-b border-line/60">
                      <td className="py-2.5"><Badge className={tradeTone[a.trade] ?? "bg-line text-charcoal-muted"}>{a.trade}</Badge></td>
                      <td className="text-charcoal-muted">{a.zone}</td>
                      <td className="text-charcoal">{a.supervisor}</td>
                      <td className="text-right tabular-nums font-semibold">{a.planned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
