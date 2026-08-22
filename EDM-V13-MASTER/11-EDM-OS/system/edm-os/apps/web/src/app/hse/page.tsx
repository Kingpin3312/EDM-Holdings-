import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { hseSummary as h, incidentsList, toolboxList, riskList, incidentTypeTone, severityTone } from "@/lib/data";

export default function HsePage() {
  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">HSE</h1><p className="text-sm text-charcoal-muted">Health, safety &amp; environment</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Report incident</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Lost-time incidents</div><div className="mt-1 text-2xl font-bold">{h.lostTime}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Near misses</div><div className="mt-1 text-2xl font-bold">{h.nearMiss}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Toolbox talks</div><div className="mt-1 text-2xl font-bold">{h.toolboxTalks}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Risk assessments</div><div className="mt-1 text-2xl font-bold">{h.riskAssessments}</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Incident log</SectionTitle>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
              <th className="py-2 font-semibold">Ref</th><th className="font-semibold">Type</th><th className="font-semibold">Description</th><th className="font-semibold">Severity</th><th className="font-semibold text-right">When</th>
            </tr></thead>
            <tbody>
              {incidentsList.map((i) => (
                <tr key={i.ref} className="border-b border-line/60">
                  <td className="py-2.5 font-mono text-[12px]">{i.ref}</td>
                  <td><Badge className={incidentTypeTone[i.type] ?? "bg-line"}>{i.type}</Badge></td>
                  <td className="font-semibold text-charcoal">{i.description}</td>
                  <td><Badge className={severityTone[i.severity] ?? "bg-line"}>{i.severity}</Badge></td>
                  <td className="text-right text-charcoal-muted">{i.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 bg-emerald-soft rounded px-4 py-2.5 text-[13px] text-emerald-dark"><span className="font-semibold">0 lost-time incidents</span> across the active project — all near misses closed out with corrective actions.</div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <SectionTitle>Toolbox talks</SectionTitle>
            {toolboxList.map((t) => (
              <div key={t.topic} className="py-2.5 border-b border-line/60 last:border-0">
                <div className="text-[13px] font-semibold text-charcoal leading-tight">{t.topic}</div>
                <div className="text-[11px] text-charcoal-muted mt-0.5">{t.date} · {t.attendees} attended</div>
              </div>
            ))}
          </Card>
          <Card className="p-5">
            <SectionTitle>Risk assessments</SectionTitle>
            {riskList.map((r) => (
              <div key={r.ref} className="border border-line rounded-card p-3">
                <div className="flex justify-between items-start gap-2"><span className="font-mono text-[12px] text-charcoal-muted">{r.ref}</span><Badge className={severityTone[r.residual] ?? "bg-line"}>{r.residual} residual</Badge></div>
                <div className="text-[13px] font-semibold text-charcoal mt-1 leading-tight">{r.activity}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </Shell>
  );
}
