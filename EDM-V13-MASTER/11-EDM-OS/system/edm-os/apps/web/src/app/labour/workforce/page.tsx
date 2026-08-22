import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { LabourTabs } from "@/components/LabourTabs";
import { workforce, tradeTone, AED } from "@/lib/data";

const statusTone: Record<string, string> = {
  Active: "bg-emerald-soft text-emerald",
  "On leave": "bg-bronze/15 text-bronze",
  Inactive: "bg-line text-charcoal-muted",
};

export default function WorkforcePage() {
  const active = workforce.filter((w) => w.status === "Active").length;
  const trades = new Set(workforce.map((w) => w.trade)).size;
  const avgRate = Math.round(workforce.reduce((a, w) => a + w.dayRate, 0) / workforce.length);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Workforce</h1>
          <p className="text-sm text-charcoal-muted">The labour register — operatives, trades and day rates</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Add operative</button>
      </div>

      <LabourTabs active="workforce" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Operatives" value={String(workforce.length)} accent />
        <StatTile label="Active" value={String(active)} />
        <StatTile label="Trades" value={String(trades)} />
        <StatTile label="Avg day rate" value={AED(avgRate)} />
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Code</th>
                <th className="font-semibold">Name</th>
                <th className="font-semibold">Trade</th>
                <th className="font-semibold">Grade</th>
                <th className="font-semibold text-right">Day rate</th>
                <th className="font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {workforce.map((w) => (
                <tr key={w.id} className="border-b border-line/60">
                  <td className="py-2.5 font-mono text-[12px] text-emerald font-semibold">{w.code}</td>
                  <td className="font-semibold text-charcoal">{w.name}</td>
                  <td><Badge className={tradeTone[w.trade] ?? "bg-line text-charcoal-muted"}>{w.trade}</Badge></td>
                  <td className="text-charcoal-muted">{w.grade}</td>
                  <td className="text-right tabular-nums">{AED(w.dayRate)}</td>
                  <td><Badge className={statusTone[w.status] ?? "bg-line text-charcoal-muted"}>{w.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Shell>
  );
}
