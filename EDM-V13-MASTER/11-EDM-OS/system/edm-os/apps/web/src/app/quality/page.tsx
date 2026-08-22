import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { qualitySummary as q, snagsList, ncrsList, snagTone, severityTone } from "@/lib/data";

export default function QualityPage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">Quality</h1><p className="text-sm text-charcoal-muted">Inspections, snags and non-conformances</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New inspection</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Open snags</div><div className="mt-1 text-2xl font-bold">{q.openSnags}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open NCRs</div><div className="mt-1 text-2xl font-bold">{q.ncrsOpen}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Inspection pass rate</div><div className="mt-1 text-2xl font-bold">{q.passRate}%</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Critical items</div><div className={`mt-1 text-2xl font-bold ${q.critical ? "text-bronze" : ""}`}>{q.critical}</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Open snags</SectionTitle>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Ref</th><th className="font-semibold">Description</th><th className="font-semibold">Location</th><th className="font-semibold">Trade</th><th className="font-semibold">Status</th>
            </tr></thead>
            <tbody>
              {snagsList.map((s) => (
                <tr key={s.ref} className="border-b border-line/60">
                  <td className="py-2.5 font-mono text-[12px]">{s.ref}</td>
                  <td className="font-semibold text-charcoal">{s.description}</td>
                  <td className="text-charcoal-muted">{s.location}</td>
                  <td><Badge className="bg-emerald-soft text-emerald">{s.trade}</Badge></td>
                  <td><Badge className={snagTone[s.status] ?? "bg-line"}>{s.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          <SectionTitle>Non-conformances</SectionTitle>
          {ncrsList.map((n) => (
            <div key={n.ref} className="border border-line rounded-card p-4 mb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-mono text-[12px] text-charcoal-muted">{n.ref}</div>
                <Badge className={severityTone[n.severity] ?? "bg-line"}>{n.severity}</Badge>
              </div>
              <div className="font-semibold text-charcoal text-[13px] mt-1 leading-tight">{n.title}</div>
              <div className="mt-2"><Badge className="bg-emerald-soft text-emerald">{n.status}</Badge></div>
            </div>
          ))}
          <div className="text-[12px] text-charcoal-muted mt-2">Corrective actions tracked to closure with re-inspection.</div>
        </Card>
      </div>
    </Shell>
  );
}
