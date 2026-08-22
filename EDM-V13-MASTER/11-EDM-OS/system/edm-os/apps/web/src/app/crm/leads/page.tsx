import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge } from "@/components/ui";
import { CrmTable } from "@/components/CrmTable";
import { AED, leadsList, leadStageTone, companyTone } from "@/lib/data";
import Link from "next/link";

export default function LeadsPage() {
  const totalEst = leadsList.reduce((s, l) => s + l.est, 0);

  const rows = leadsList.map((l) => ({
    key: l.id,
    search: `${l.title} ${l.company} ${l.type} ${l.stage} ${l.owner} ${l.source ?? ""}`.toLowerCase(),
    cells: [
      <Link href={`/crm/leads/${l.id}`} className="font-semibold text-charcoal hover:text-emerald transition-colors">{l.title}</Link>,
      <div><div className="text-charcoal-muted">{l.company}</div><Badge className={`${companyTone[l.type] ?? "bg-line"} mt-1`}>{l.type}</Badge></div>,
      <Badge className={leadStageTone[l.stage] ?? "bg-line"}>{l.stage}</Badge>,
      <span className="font-semibold">{AED(l.est)}</span>,
      <span className={l.follow === "Overdue" ? "text-charcoal font-semibold" : "text-charcoal-muted"}>{l.follow}</span>,
      <span className="text-charcoal-muted">{l.owner}</span>,
    ],
    csv: [l.title, l.company, l.type, l.stage, l.est, l.follow, l.owner],
  }));

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Pipeline, relationships and follow-ups</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New lead</button>
      </div>
      <CrmTabs active="leads" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open leads</div><div className="mt-1 text-2xl font-bold">{leadsList.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Estimated value</div><div className="mt-1 text-2xl font-bold">{AED(totalEst)}</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Follow-ups due</div><div className="mt-1 text-2xl font-bold">3</div></Card>
      </div>

      <Card className="p-5">
        <CrmTable
          headers={["Lead", "Company", "Stage", "Est. value", "Next follow-up", "Owner"]}
          rows={rows}
          filename="edm-leads"
          placeholder="Search leads…"
          align={["left", "left", "left", "right", "right", "left"]}
        />
      </Card>
    </Shell>
  );
}
