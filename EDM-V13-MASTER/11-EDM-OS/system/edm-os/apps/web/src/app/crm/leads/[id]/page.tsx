import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import {
  AED, leadById, companyById, companyTone, leadStageTone,
  contactsForCompany, activitiesForLead, activityTypeMeta,
} from "@/lib/data";
import Link from "next/link";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = leadById(params.id);

  if (!lead) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <p className="text-charcoal-muted">Lead not found.</p>
          <Link href="/crm/leads" className="text-emerald font-semibold text-sm mt-2 inline-block">← Back to leads</Link>
        </div>
      </Shell>
    );
  }

  const company = lead.companyId ? companyById(lead.companyId) : undefined;
  const contacts = lead.companyId ? contactsForCompany(lead.companyId) : [];
  const activities = activitiesForLead(lead.id);
  const overdue = lead.follow === "Overdue";
  const qualified = lead.stage !== "Won" && lead.stage !== "Lost";

  return (
    <Shell>
      <Link href="/crm/leads" className="text-xs text-charcoal-muted hover:text-emerald font-semibold">← Leads</Link>

      <div className="mt-2 mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight">{lead.title}</h1>
            <Badge className={leadStageTone[lead.stage] ?? "bg-line"}>{lead.stage}</Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-0.5">
            {company ? <Link href={`/crm/companies/${company.id}`} className="hover:text-emerald font-semibold">{company.name}</Link> : <span className="font-semibold">{lead.company}</span>}
            {" · "}Owner {lead.owner}
          </p>
        </div>
        {qualified && <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Convert to opportunity</button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Estimated value</div><div className="mt-1 text-2xl font-bold">{AED(lead.est)}</div></Card>
        <Card className={`p-4 ${overdue ? "border-charcoal/20" : ""}`}><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Next follow-up</div><div className={`mt-1 text-2xl font-bold ${overdue ? "text-charcoal" : ""}`}>{lead.follow}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Stage</div><div className="mt-1 text-2xl font-bold">{lead.stage}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Source</div><div className="mt-1 text-[15px] font-bold leading-tight">{lead.source}</div></Card>
      </div>

      {/* Qualify → pipeline */}
      {qualified && (
        <Card className="p-5 mb-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-bold text-charcoal">Qualified this lead?</div>
              <div className="text-[13px] text-charcoal-muted mt-0.5">Convert it into a pipeline opportunity — the company, estimated value and activity history carry across, and the lead drops out of the funnel.</div>
            </div>
            <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Convert to opportunity</button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: lead detail + contacts */}
        <div className="xl:col-span-1 space-y-5">
          <Card className="p-5">
            <SectionTitle>Lead detail</SectionTitle>
            <dl className="text-[13px] divide-y divide-line">
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Company</dt><dd className="font-semibold">{company?.name ?? lead.company}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Type</dt><dd><Badge className={companyTone[lead.type] ?? "bg-line"}>{lead.type}</Badge></dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Source</dt><dd className="font-semibold text-right">{lead.source}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Owner</dt><dd className="font-semibold">{lead.owner}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Next follow-up</dt><dd className={`font-semibold ${overdue ? "text-charcoal" : ""}`}>{lead.follow}</dd></div>
            </dl>
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-line">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted mb-1">Notes</div>
                <p className="text-[13px] text-charcoal leading-relaxed">{lead.notes}</p>
              </div>
            )}
          </Card>

          {company && (
            <Card className="p-5">
              <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href={`/crm/companies/${company.id}`}>Company</Link>}>Contacts</SectionTitle>
              <div className="divide-y divide-line">
                {contacts.length === 0 && <p className="text-sm text-charcoal-muted py-2">No contacts recorded.</p>}
                {contacts.map((c) => (
                  <div key={c.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-charcoal">{c.firstName} {c.lastName}</span>
                      {c.isPrimary && <Badge className="bg-emerald-soft text-emerald">Key</Badge>}
                    </div>
                    <div className="text-[11px] text-charcoal-muted">{c.jobTitle} · {c.email}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right: activity timeline */}
        <div className="xl:col-span-2">
          <Card className="p-5">
            <SectionTitle>Activity timeline</SectionTitle>
            <div className="relative pl-5">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-line" />
              {activities.length === 0 && <p className="text-sm text-charcoal-muted">No activity logged yet.</p>}
              {activities.map((act) => {
                const meta = activityTypeMeta[act.type] ?? { label: act.type, tone: "bg-line" };
                return (
                  <div key={act.id} className="relative pb-5 last:pb-0">
                    <div className="absolute -left-5 top-1 w-[11px] h-[11px] rounded-full bg-emerald border-2 border-white" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={meta.tone}>{meta.label}</Badge>
                      <span className="text-[13px] font-semibold text-charcoal">{act.subject}</span>
                      {!act.done && act.due && <Badge className="bg-bone text-charcoal-muted">Due {act.due}</Badge>}
                    </div>
                    {act.body && <p className="text-[12px] text-charcoal-muted mt-1">{act.body}</p>}
                    <div className="text-[11px] text-charcoal-muted mt-1">
                      {act.contact}{act.owner && <> · {act.owner}</>}{act.when && <> · {act.when}</>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
