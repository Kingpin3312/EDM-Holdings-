import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { siteReports, siteEventTone, tradeTone } from "@/lib/data";
import { delayImpact, headcountReconciliation, reportCompleteness } from "@/lib/reports";

const statusTone: Record<string, string> = {
  Submitted: "bg-emerald-soft text-emerald",
  Draft: "bg-line text-charcoal-muted",
};

export default function SiteReportsPage() {
  const rows = siteReports.map((r) => {
    const impact = delayImpact(r.events);
    const headcount = r.labour.reduce((a, l) => a + l.headcount, 0);
    const hours = r.labour.reduce((a, l) => a + l.hours, 0);
    const recon = headcountReconciliation(headcount, r.attendancePresent);
    const completeness = reportCompleteness(r);
    return { ...r, impact, headcount, hours, recon, completeness };
  });

  const hoursLost = rows.reduce((a, r) => a + r.impact.hoursLost, 0);
  const instructions = rows.reduce((a, r) => a + r.impact.instructions, 0);
  const chargeable = rows.reduce((a, r) => a + r.impact.chargeableEvents, 0);
  const drafts = rows.filter((r) => r.status === "Draft").length;

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Site reports</h1>
          <p className="text-sm text-charcoal-muted">Supervisor daily reports — the site diary that backs your claims</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/site/claims" className="bg-white border border-emerald text-emerald text-sm font-semibold px-4 py-2 rounded-card">Claims register</Link>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New daily report</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5">
        <StatTile label="Reports (week)" value={String(rows.length)} accent />
        <StatTile label="Delay hours lost" value={String(hoursLost)} sub={hoursLost ? "claim evidence" : "none"} />
        <StatTile label="Instructions logged" value={String(instructions)} />
        <StatTile label="Chargeable events" value={String(chargeable)} />
        <StatTile label="Drafts pending" value={String(drafts)} />
      </div>

      <Card className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Date</th>
                <th className="font-semibold">Project</th>
                <th className="font-semibold">Supervisor</th>
                <th className="font-semibold text-right">Crew</th>
                <th className="font-semibold text-right">Hours</th>
                <th className="font-semibold">Events</th>
                <th className="font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-line/60 hover:bg-bone/60">
                  <td className="py-2.5">
                    <Link href={`/site/${r.id}`} className="font-semibold text-emerald hover:underline">{r.date}</Link>
                    <div className="text-[11px] text-charcoal-muted font-mono">{r.id}</div>
                  </td>
                  <td className="text-charcoal">{r.project}</td>
                  <td className="text-charcoal-muted">{r.supervisor}</td>
                  <td className="text-right">
                    <span className="tabular-nums">{r.headcount}</span>
                    {!r.recon.match && <Badge className="ml-1 bg-bronze/15 text-bronze">≠att {r.recon.variance > 0 ? "+" : ""}{r.recon.variance}</Badge>}
                  </td>
                  <td className="text-right tabular-nums">{r.hours}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {r.impact.delays > 0 && <Badge className={siteEventTone.DELAY}>{r.impact.delays} delay · {r.impact.hoursLost}h</Badge>}
                      {r.impact.instructions > 0 && <Badge className={siteEventTone.INSTRUCTION}>{r.impact.instructions} instr</Badge>}
                      {r.events.length === 0 && <span className="text-charcoal-muted text-xs">—</span>}
                    </div>
                  </td>
                  <td>
                    <Badge className={statusTone[r.status]}>{r.status}</Badge>
                    {r.status === "Draft" && !r.completeness.canSubmit && <div className="text-[10px] text-bronze mt-0.5">needs: {r.completeness.missing.join(", ")}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">≠att flags where the report&apos;s headcount doesn&apos;t match recorded attendance. Delays and instructions carry the hours and chargeable status that build a claim.</p>
      </Card>
    </Shell>
  );
}
