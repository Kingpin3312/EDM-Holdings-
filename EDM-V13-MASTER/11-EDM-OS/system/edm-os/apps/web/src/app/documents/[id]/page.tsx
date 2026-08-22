import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { documentsRegister, transmittals } from "@/lib/data";
import Link from "next/link";

const statusTone: Record<string, string> = {
  "For Construction": "bg-emerald text-white",
  Approved: "bg-emerald-soft text-emerald",
  "Approved w/ comments": "bg-emerald text-white",
  "For Review": "bg-sage/40 text-emerald-dark",
  Draft: "bg-line text-charcoal-muted",
  Superseded: "bg-charcoal/10 text-charcoal-muted",
  Returned: "bg-bronze/15 text-bronze",
};
const purposeTone: Record<string, string> = {
  "For Construction": "bg-emerald text-white",
  "For Approval": "bg-sage/40 text-emerald-dark",
  "For Information": "bg-line text-charcoal-muted",
};

export default function DocumentRecord({ params }: { params: { id: string } }) {
  const doc = documentsRegister.find((d) => d.id === params.id);

  if (!doc) {
    return (
      <Shell>
        <div className="py-16 text-center">
          <p className="text-charcoal-muted">Document not found.</p>
          <Link href="/documents" className="text-emerald font-semibold text-sm">← Back to register</Link>
        </div>
      </Shell>
    );
  }

  const related = transmittals.filter((t) => t.docs.some((dc) => dc.number === doc.number));
  const history = [...doc.revisions].reverse();

  return (
    <Shell>
      <Link href="/documents" className="text-[13px] text-emerald font-semibold">← Document register</Link>

      <div className="mt-3 mb-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="font-mono text-[12px] font-semibold text-charcoal-muted">{doc.number}</div>
          <h1 className="text-xl font-bold tracking-tight mt-0.5">{doc.title}</h1>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-soft text-emerald">{doc.discipline}</Badge>
            <Badge className="bg-bone text-charcoal-muted font-mono">Rev {doc.currentRev}</Badge>
            <Badge className={statusTone[doc.status] ?? "bg-line"}>{doc.status}</Badge>
          </div>
        </div>
        <div className="text-right text-[12px] text-charcoal-muted">
          <div>Updated {doc.updated}</div>
          <div>by {doc.by}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionTitle>Revision history</SectionTitle>
          <div>
            {history.map((r) => (
              <div key={r.rev} className="flex gap-3 py-3 border-b border-line/60 last:border-0">
                <div className={`w-9 h-9 shrink-0 rounded grid place-items-center font-mono font-bold text-[14px] ${r.current ? "bg-emerald text-white" : "bg-bone text-charcoal-muted"}`}>{r.rev}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={statusTone[r.status] ?? "bg-line"}>{r.status}</Badge>
                    {r.current && <span className="text-[11px] font-semibold text-emerald">Current</span>}
                    <span className="text-[11px] text-charcoal-muted">{r.date} · {r.by}</span>
                  </div>
                  <div className="text-[13px] text-charcoal mt-1">{r.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <SectionTitle>Transmittals</SectionTitle>
          {related.length === 0 ? (
            <p className="text-[13px] text-charcoal-muted">Not yet issued under a transmittal.</p>
          ) : (
            <div className="space-y-3">
              {related.map((t) => {
                const thisRev = t.docs.find((dc) => dc.number === doc.number)?.rev;
                return (
                  <div key={t.id} className="border-b border-line/60 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[12px] font-semibold text-charcoal">{t.number}</span>
                      <span className="text-[11px] text-charcoal-muted">{t.date}</span>
                    </div>
                    <div className="text-[12px] text-charcoal-muted mt-0.5">to {t.to} · Rev {thisRev}</div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Badge className={purposeTone[t.purpose] ?? "bg-line"}>{t.purpose}</Badge>
                      <span className="text-[11px] text-charcoal-muted">{t.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
