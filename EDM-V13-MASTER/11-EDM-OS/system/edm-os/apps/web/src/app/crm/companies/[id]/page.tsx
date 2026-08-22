import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import {
  AED, companyById, companyTone, contactsForCompany, opportunitiesForCompany,
  activitiesForCompany, activityTypeMeta,
} from "@/lib/data";
import Link from "next/link";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = companyById(params.id);

  if (!company) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <p className="text-charcoal-muted">Company not found.</p>
          <Link href="/crm/companies" className="text-emerald font-semibold text-sm mt-2 inline-block">← Back to companies</Link>
        </div>
      </Shell>
    );
  }

  const contacts = contactsForCompany(company.id);
  const opps = opportunitiesForCompany(company.id);
  const activities = activitiesForCompany(company.id);
  const weighted = opps.reduce((s, o) => s + o.value * (o.prob / 100), 0);
  const grossOpps = opps.reduce((s, o) => s + o.value, 0);

  return (
    <Shell>
      <Link href="/crm/companies" className="text-xs text-charcoal-muted hover:text-emerald font-semibold">← Companies</Link>

      <div className="mt-2 mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">{company.name}</h1>
            <Badge className={companyTone[company.type] ?? "bg-line"}>{company.type}</Badge>
          </div>
          <p className="text-sm text-charcoal-muted mt-0.5">{company.city}</p>
        </div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Log activity</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Contacts</div><div className="mt-1 text-2xl font-bold">{contacts.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open opportunities</div><div className="mt-1 text-2xl font-bold">{opps.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Pipeline value</div><div className="mt-1 text-2xl font-bold">{AED(grossOpps)}</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Weighted</div><div className="mt-1 text-2xl font-bold">{AED(weighted)}</div></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left column: contacts + opportunities */}
        <div className="xl:col-span-1 space-y-5">
          <Card className="p-5">
            <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/contacts">All</Link>}>Contacts</SectionTitle>
            <div className="divide-y divide-line">
              {contacts.length === 0 && <p className="text-sm text-charcoal-muted py-2">No contacts recorded.</p>}
              {contacts.map((c) => (
                <div key={c.id} className="py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-charcoal">{c.firstName} {c.lastName}</span>
                    {c.isPrimary && <Badge className="bg-emerald-soft text-emerald">Key</Badge>}
                  </div>
                  <div className="text-[11px] text-charcoal-muted">{c.jobTitle}</div>
                  <div className="text-[11px] text-charcoal-muted mt-1">{c.email} · {c.phone}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/pipeline">Pipeline</Link>}>Opportunities</SectionTitle>
            <div className="space-y-2">
              {opps.length === 0 && <p className="text-sm text-charcoal-muted">No open opportunities.</p>}
              {opps.map((o) => (
                <Link key={o.name} href={`/crm/opportunities/${o.id}`} className="block bg-bone rounded-card p-3 hover:bg-emerald-soft transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-semibold text-[13px] text-charcoal leading-tight">{o.name}</div>
                    <Badge className="bg-emerald-soft text-emerald shrink-0">{o.prob}%</Badge>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald">{o.stage}</span>
                    <span className="text-[12px] font-semibold">{AED(o.value)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column: activity timeline */}
        <div className="xl:col-span-2">
          <Card className="p-5">
            <SectionTitle>Activity timeline</SectionTitle>
            <div className="relative pl-5">
              <div className="absolute left-[5px] top-1 bottom-1 w-px bg-line" />
              {activities.length === 0 && <p className="text-sm text-charcoal-muted">No activity logged yet.</p>}
              {activities.map((a) => {
                const meta = activityTypeMeta[a.type] ?? { label: a.type, tone: "bg-line" };
                return (
                  <div key={a.id} className="relative pb-5 last:pb-0">
                    <div className="absolute -left-5 top-1 w-[11px] h-[11px] rounded-full bg-emerald border-2 border-white" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={meta.tone}>{meta.label}</Badge>
                      <span className="text-[13px] font-semibold text-charcoal">{a.subject}</span>
                      {!a.done && a.due && <Badge className="bg-bone text-charcoal-muted">Due {a.due}</Badge>}
                    </div>
                    {a.body && <p className="text-[12px] text-charcoal-muted mt-1">{a.body}</p>}
                    <div className="text-[11px] text-charcoal-muted mt-1">
                      {a.contact}{a.owner && <> · {a.owner}</>}{a.when && <> · {a.when}</>}
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
