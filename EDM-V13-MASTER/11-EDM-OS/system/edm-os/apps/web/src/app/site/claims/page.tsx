import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Card, Badge, StatTile } from "@/components/ui";
import { siteReports, siteEventTone, AED } from "@/lib/data";
import { claimRegisterSummary, claimValue } from "@/lib/reports";

// Blended crew charge-out rate used to value lost time (AED / man-hour).
const RECOVERY_RATE = 78;

export default function ClaimsRegisterPage() {
  // flatten every site event with its report context
  const allEvents = siteReports.flatMap((r) =>
    r.events.map((e) => ({ ...e, project: r.project, projectCode: r.projectCode, date: r.date, reportId: r.id, supervisor: r.supervisor })),
  );

  const summary = claimRegisterSummary(allEvents, RECOVERY_RATE);
  const delays = allEvents.filter((e) => e.chargeable && (e.type === "DELAY" || e.type === "DISRUPTION"));
  const instructions = allEvents.filter((e) => e.chargeable && e.type === "INSTRUCTION");
  const nonChargeable = allEvents.filter((e) => !e.chargeable && (e.type === "DELAY" || e.type === "DISRUPTION"));

  return (
    <Shell>
      <div className="mb-2">
        <Link href="/site" className="text-emerald font-semibold text-[13px]">← Site reports</Link>
      </div>
      <div className="mb-5 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Claims register</h1>
          <p className="text-sm text-charcoal-muted">Chargeable delays and instructions from the site diary, rolled into a recoverable position</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Build claim pack</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatTile label="Chargeable delays" value={String(summary.chargeableDelays)} accent />
        <StatTile label="Hours lost" value={String(summary.hoursLost)} />
        <StatTile label="Recoverable value" value={AED(summary.recoverableValue)} sub={`@ AED ${RECOVERY_RATE}/hr blended`} />
        <StatTile label="Variation candidates" value={String(summary.variationCandidates)} />
      </div>

      {/* Time-based claims */}
      <Card className="p-5 mb-5">
        <h2 className="text-sm font-bold text-charcoal mb-3">Delay &amp; disruption claims</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-charcoal-muted border-b border-line">
                <th className="py-2 font-semibold">Date</th>
                <th className="font-semibold">Project</th>
                <th className="font-semibold">Event</th>
                <th className="font-semibold">Cause</th>
                <th className="font-semibold text-right">Hours</th>
                <th className="font-semibold text-right">Recoverable</th>
              </tr>
            </thead>
            <tbody>
              {delays.map((e, i) => (
                <tr key={i} className="border-b border-line/60">
                  <td className="py-2.5"><Link href={`/site/${e.reportId}`} className="text-emerald font-semibold hover:underline whitespace-nowrap">{e.date}</Link></td>
                  <td className="text-charcoal whitespace-nowrap">{e.project}</td>
                  <td><div className="flex items-center gap-2"><Badge className={siteEventTone[e.type]}>{e.type}</Badge><span className="text-[12px] text-charcoal">{e.description}</span></div></td>
                  <td className="text-charcoal-muted text-[12px]">{e.cause}</td>
                  <td className="text-right tabular-nums text-bronze font-semibold">{e.hoursLost}</td>
                  <td className="text-right tabular-nums font-semibold">{AED(claimValue(e.hoursLost, RECOVERY_RATE))}</td>
                </tr>
              ))}
              <tr className="bg-bone/60">
                <td className="py-2.5 font-bold" colSpan={4}>Total recoverable (time)</td>
                <td className="text-right tabular-nums font-bold text-bronze">{summary.hoursLost}</td>
                <td className="text-right tabular-nums font-bold">{AED(summary.recoverableValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[12px] text-charcoal-muted">Lost time valued at a blended crew charge-out rate of AED {RECOVERY_RATE}/man-hour. Each row links back to the dated report that evidences it.</p>
      </Card>

      {/* Instruction -> variation candidates */}
      <Card className="p-5 mb-5">
        <h2 className="text-sm font-bold text-charcoal mb-3">Instructions to convert to variations</h2>
        {instructions.length === 0 ? (
          <p className="text-[13px] text-charcoal-muted">No outstanding instructions.</p>
        ) : (
          <div className="space-y-2.5">
            {instructions.map((e, i) => (
              <div key={i} className="flex items-start justify-between gap-3 border-b border-line/60 pb-2.5 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={siteEventTone.INSTRUCTION}>INSTRUCTION</Badge>
                    <span className="text-[11px] text-charcoal-muted">{e.date} · {e.project}</span>
                  </div>
                  <p className="text-[13px] text-charcoal mt-1">{e.description}</p>
                </div>
                <Link href="/variations" className="text-emerald font-semibold text-[12px] whitespace-nowrap self-center">Raise variation →</Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {nonChargeable.length > 0 && (
        <Card className="p-5">
          <h2 className="text-sm font-bold text-charcoal mb-1">Logged, not chargeable</h2>
          <p className="text-[12px] text-charcoal-muted mb-3">Recorded for the diary, but our own or not recoverable — kept for completeness.</p>
          <div className="space-y-1.5">
            {nonChargeable.map((e, i) => (
              <div key={i} className="flex justify-between text-[13px] py-1.5 border-b border-line/60 last:border-0">
                <span className="text-charcoal">{e.description}</span>
                <span className="text-charcoal-muted whitespace-nowrap">{e.hoursLost}h · {e.cause}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Shell>
  );
}
