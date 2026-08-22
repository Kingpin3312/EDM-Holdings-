import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { CrmTable } from "@/components/CrmTable";
import { documentsRegister, transmittals } from "@/lib/data";
import Link from "next/link";

const statusTone: Record<string, string> = {
  "For Construction": "bg-emerald text-white",
  Approved: "bg-emerald-soft text-emerald",
  "For Review": "bg-sage/40 text-emerald-dark",
  Draft: "bg-line text-charcoal-muted",
  Superseded: "bg-charcoal/10 text-charcoal-muted",
  Returned: "bg-bronze/15 text-bronze",
};
const disciplineTone: Record<string, string> = {
  "Drywall/Partition": "bg-emerald-soft text-emerald",
  Ceilings: "bg-sage/30 text-emerald-dark",
  Fire: "bg-bronze/15 text-bronze",
  "Method/QA": "bg-line text-charcoal-muted",
};
const purposeTone: Record<string, string> = {
  "For Construction": "bg-emerald text-white",
  "For Approval": "bg-sage/40 text-emerald-dark",
  "For Information": "bg-line text-charcoal-muted",
};
const trStatusTone: Record<string, string> = {
  Issued: "bg-emerald-soft text-emerald",
  Acknowledged: "bg-sage/30 text-emerald-dark",
  "Approved w/ comments": "bg-emerald text-white",
  Returned: "bg-bronze/15 text-bronze",
};

export default function DocumentsPage() {
  const total = documentsRegister.length;
  const forReview = documentsRegister.filter((d) => d.status === "For Review").length;
  const forConstruction = documentsRegister.filter((d) => d.status === "For Construction").length;
  const openTransmittals = transmittals.filter((t) => t.status !== "Approved w/ comments").length;

  const rows = documentsRegister.map((d) => ({
    key: d.id,
    search: `${d.number} ${d.title} ${d.discipline} ${d.status}`.toLowerCase(),
    cells: [
      <Link href={`/documents/${d.id}`} className="font-mono text-[12px] font-semibold text-emerald hover:underline">{d.number}</Link>,
      <Link href={`/documents/${d.id}`} className="font-semibold text-charcoal hover:text-emerald transition-colors">{d.title}</Link>,
      <Badge className={disciplineTone[d.discipline] ?? "bg-line"}>{d.discipline}</Badge>,
      <span className="font-mono font-semibold">{d.currentRev}</span>,
      <Badge className={statusTone[d.status] ?? "bg-line"}>{d.status}</Badge>,
      <span className="text-charcoal-muted">{d.updated}</span>,
    ],
    csv: [d.number, d.title, d.discipline, d.currentRev, d.status, d.updated],
  }));

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">Document control</h1><p className="text-sm text-charcoal-muted">Controlled register, revisions and transmittals</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Upload document</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Documents</div><div className="mt-1 text-2xl font-bold">{total}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Awaiting review</div><div className="mt-1 text-2xl font-bold">{forReview}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">For construction</div><div className="mt-1 text-2xl font-bold">{forConstruction}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open transmittals</div><div className="mt-1 text-2xl font-bold">{openTransmittals}</div></Card>
      </div>

      <Card className="p-5 mb-5">
        <SectionTitle>Document register</SectionTitle>
        <CrmTable
          headers={["Number", "Title", "Discipline", "Rev", "Status", "Updated"]}
          rows={rows}
          filename="edm-document-register"
          placeholder="Search documents…"
          align={["left", "left", "left", "left", "left", "right"]}
        />
      </Card>

      <Card className="p-5">
        <SectionTitle>Transmittals</SectionTitle>
        <div className="space-y-3">
          {transmittals.map((t) => (
            <div key={t.id} className="border border-line rounded-card p-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-semibold text-charcoal">{t.number}</span>
                  <span className="text-[13px] text-charcoal-muted">to {t.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={purposeTone[t.purpose] ?? "bg-line"}>{t.purpose}</Badge>
                  <Badge className={trStatusTone[t.status] ?? "bg-line"}>{t.status}</Badge>
                  <span className="text-[11px] text-charcoal-muted">{t.date}</span>
                </div>
              </div>
              <div className="mt-2 pl-1 space-y-1">
                {t.docs.map((dc) => (
                  <div key={dc.number} className="text-[12px] text-charcoal-muted">
                    <span className="font-mono text-charcoal">{dc.number}</span> · Rev {dc.rev} — {dc.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Shell>
  );
}
