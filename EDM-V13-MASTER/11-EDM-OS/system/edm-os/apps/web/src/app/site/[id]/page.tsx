import { Shell } from "@/components/Shell";
import { Card, Badge } from "@/components/ui";
import { reportById, siteEventTone, tradeTone } from "@/lib/data";
import { delayImpact, headcountReconciliation, reportCompleteness } from "@/lib/reports";
import Link from "next/link";

const statusTone: Record<string, string> = {
  Submitted: "bg-emerald-soft text-emerald",
  Draft: "bg-line text-charcoal-muted",
};

export default function SiteReportDetail({ params }: { params: { id: string } }) {
  const r = reportById(params.id);

  if (!r) {
    return (
      <Shell>
        <div className="py-16 text-center">
          <p className="text-charcoal-muted">Report not found.</p>
          <Link href="/site" className="text-emerald font-semibold text-sm">← Back to site reports</Link>
        </div>
      </Shell>
    );
  }

  const impact = delayImpact(r.events);
  const headcount = r.labour.reduce((a, l) => a + l.headcount, 0);
  const hours = r.labour.reduce((a, l) => a + l.hours, 0);
  const recon = headcountReconciliation(headcount, r.attendancePresent);
  const completeness = reportCompleteness(r);

  return (
    <Shell>
      <Link href="/site" className="text-emerald font-semibold text-[13px]">← Site reports</Link>

      <div className="mt-3 mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">{r.project}</h1>
          <p className="text-sm text-charcoal-muted">{r.dateLong} · {r.supervisor} · {r.weather}</p>
          <p className="text-[11px] text-charcoal-muted font-mono mt-0.5">{r.id}</p>
        </div>
        <div className="text-right">
          <Badge className={statusTone[r.status]}>{r.status}</Badge>
          {r.status === "Draft" && (
            <div className="mt-1 text-[11px]">{completeness.canSubmit ? <span className="text-emerald font-semibold">Ready to submit</span> : <span className="text-bronze">Needs: {completeness.missing.join(", ")}</span>}</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Crew</div><div className="mt-1 text-2xl font-bold flex items-center gap-2">{headcount}{!recon.match && <Badge className="bg-bronze/15 text-bronze text-[10px]">vs att {recon.variance > 0 ? "+" : ""}{recon.variance}</Badge>}</div><div className="text-[11px] text-charcoal-muted mt-0.5">{recon.match ? "matches attendance" : `attendance recorded ${r.attendancePresent}`}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Man-hours</div><div className="mt-1 text-2xl font-bold">{hours}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Delay hours</div><div className={`mt-1 text-2xl font-bold ${impact.hoursLost ? "text-bronze" : ""}`}>{impact.hoursLost}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Chargeable events</div><div className="mt-1 text-2xl font-bold">{impact.chargeableEvents}</div></Card>
      </div>

      {/* Progress narrative */}
      <Card className="p-5 mb-5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald mb-2">Progress</div>
        {r.progress ? <p className="text-[13px] text-charcoal leading-relaxed">{r.progress}</p> : <p className="text-[13px] text-bronze">No progress recorded — required before this report can be submitted.</p>}
        {r.quantities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {r.quantities.map((q) => (
              <span key={q.trade} className="text-[12px] bg-bone px-2.5 py-1 rounded"><span className="font-semibold">{q.qty} {q.unit}</span> <span className="text-charcoal-muted">{q.trade}</span></span>
            ))}
          </div>
        )}
      </Card>

      {/* Claim evidence: delays & instructions */}
      <Card className="p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-emerald">Delays &amp; instructions</div>
          {impact.chargeableEvents > 0 && <Badge className="bg-bronze/15 text-bronze">{impact.chargeableEvents} potentially chargeable</Badge>}
        </div>
        {r.events.length === 0 ? (
          <p className="text-[13px] text-charcoal-muted">No delays or instructions logged.</p>
        ) : (
          <div className="space-y-2.5">
            {r.events.map((e, i) => (
              <div key={i} className="flex items-start justify-between gap-3 border-b border-line/60 pb-2.5 last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={siteEventTone[e.type]}>{e.type}</Badge>
                    {e.chargeable && <Badge className="bg-emerald text-white">Chargeable</Badge>}
                    {e.hoursLost > 0 && <span className="text-[12px] text-bronze font-semibold">{e.hoursLost}h lost</span>}
                  </div>
                  <p className="text-[13px] text-charcoal mt-1">{e.description}</p>
                  <p className="text-[11px] text-charcoal-muted mt-0.5">Cause: {e.cause}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-[12px] text-charcoal-muted">Logged here on the day, these become the contemporaneous record behind a delay or variation claim.</p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-2">Labour by trade</div>
          {r.labour.map((l) => (
            <div key={l.trade} className="flex justify-between items-center py-1.5 border-b border-line/60 last:border-0 text-[13px]">
              <Badge className={tradeTone[l.trade] ?? "bg-line text-charcoal-muted"}>{l.trade}</Badge>
              <span className="text-charcoal-muted">{l.headcount} × {(l.hours / l.headcount).toFixed(0)}h</span>
            </div>
          ))}
        </Card>
        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-2">Deliveries</div>
          {r.deliveries.length ? r.deliveries.map((d) => (
            <div key={d.material} className="flex justify-between py-1.5 border-b border-line/60 last:border-0 text-[13px]"><span>{d.material}</span><span className="text-charcoal-muted whitespace-nowrap">{d.qty} {d.unit}</span></div>
          )) : <p className="text-[13px] text-charcoal-muted">None</p>}
        </Card>
        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-2">Plant</div>
          {r.plant.length ? r.plant.map((p) => (
            <div key={p.item} className="flex justify-between py-1.5 border-b border-line/60 last:border-0 text-[13px]"><span>{p.item}</span><span className="text-charcoal-muted whitespace-nowrap">×{p.qty}{p.hours ? ` · ${p.hours}h` : ""}</span></div>
          )) : <p className="text-[13px] text-charcoal-muted">None</p>}
        </Card>
      </div>

      <Card className="p-5 mt-5">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">Safety</div>
        <p className="text-[13px] text-charcoal">{r.safety}</p>
      </Card>
    </Shell>
  );
}
