import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { rfiSummary as r, rfisList, rfiTone } from "@/lib/data";

export default function RfisPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">RFIs</h1><p className="text-sm text-charcoal-muted">Requests for information — register and tracking</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Raise RFI</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Open</div><div className="mt-1 text-2xl font-bold">{r.open}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Overdue</div><div className={`mt-1 text-2xl font-bold ${r.overdue ? "text-bronze" : ""}`}>{r.overdue}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Answered</div><div className="mt-1 text-2xl font-bold">{r.answered}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Closed</div><div className="mt-1 text-2xl font-bold">{r.closed}</div></Card>
      </div>

      <Card className="p-5">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
            <th className="py-2 font-semibold">Ref</th><th className="font-semibold">Subject</th><th className="font-semibold">Project</th>
            <th className="font-semibold">Due / response</th><th className="font-semibold">Status</th><th></th>
          </tr></thead>
          <tbody>
            {rfisList.map((x) => (
              <tr key={x.ref} className="border-b border-line/60">
                <td className="py-2.5 font-mono text-[12px]">{x.ref}</td>
                <td className="font-semibold text-charcoal">{x.subject}</td>
                <td className="text-charcoal-muted">{x.project}</td>
                <td className={x.overdue ? "text-bronze font-semibold" : "text-charcoal-muted"}>{x.due}</td>
                <td>
                  {x.overdue
                    ? <Badge className="bg-bronze/15 text-bronze">Overdue</Badge>
                    : <Badge className={rfiTone[x.status] ?? "bg-line"}>{x.status}</Badge>}
                </td>
                <td className="text-right"><span className="text-xs text-emerald font-semibold">Open →</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Shell>
  );
}
