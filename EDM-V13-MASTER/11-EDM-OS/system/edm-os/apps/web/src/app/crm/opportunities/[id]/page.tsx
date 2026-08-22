import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import {
  AED, opportunityById, companyById, companyTone, contactsForCompany,
  activitiesForOpportunity, activityTypeMeta, oppStatusTone, oppStageTone,
} from "@/lib/data";
import Link from "next/link";

const statusLabel: Record<string, string> = { OPEN: "Open", WON: "Won", LOST: "Lost", ON_HOLD: "On hold" };

export default function OpportunityDetailPage({ params }: { params: { id: string } }) {
  const opp = opportunityById(params.id);

  if (!opp) {
    return (
      <Shell>
        <div className="py-20 text-center">
          <p className="text-charcoal-muted">Opportunity not found.</p>
          <Link href="/crm/pipeline" className="text-emerald font-semibold text-sm mt-2 inline-block">← Back to pipeline</Link>
        </div>
      </Shell>
    );
  }

  const company = companyById(opp.companyId);
  const contacts = contactsForCompany(opp.companyId);
  const activities = activitiesForOpportunity(opp.id);
  const weighted = opp.value * (opp.prob / 100);
  const isOpen = opp.status === "OPEN";

  return (
    <Shell>
      <Link href="/crm/pipeline" className="text-xs text-charcoal-muted hover:text-emerald font-semibold">← Pipeline</Link>

      <div className="mt-2 mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight">{opp.name}</h1>
            <Badge className={oppStatusTone[opp.status] ?? "bg-line"}>{statusLabel[opp.status] ?? opp.status}</Badge>
            {isOpen && <Badge className={oppStageTone[opp.stage] ?? "bg-line"}>{opp.stage}</Badge>}
          </div>
          <p className="text-sm text-charcoal-muted mt-0.5">
            {company ? <Link href={`/crm/companies/${company.id}`} className="hover:text-emerald font-semibold">{company.name}</Link> : "—"}
            {" · "}Owner {opp.owner}
          </p>
        </div>
        {isOpen && <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Convert to project</button>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Contract value</div><div className="mt-1 text-2xl font-bold">{AED(opp.value)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Win probability</div><div className="mt-1 text-2xl font-bold">{opp.prob}%</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Weighted</div><div className="mt-1 text-2xl font-bold">{AED(weighted)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Bid due</div><div className="mt-1 text-2xl font-bold">{opp.bidDue}</div></Card>
      </div>

      {/* Sales → delivery handoff */}
      {opp.status === "WON" && opp.convertedProjectCode ? (
        <Card className="p-5 mb-5 bg-emerald text-white border-emerald">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-bold">Won — handed off to delivery</div>
              <div className="text-[13px] text-sage mt-0.5">Client, value and history carried over to the live project. No re-keying.</div>
            </div>
            <Link href="/projects" className="bg-white text-emerald text-sm font-semibold px-4 py-2 rounded-card">Open {opp.convertedProjectCode} →</Link>
          </div>
        </Card>
      ) : isOpen ? (
        <Card className="p-5 mb-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-sm font-bold text-charcoal">Won this pursuit?</div>
              <div className="text-[13px] text-charcoal-muted mt-0.5">Convert it into a live project — the client, contract value and full history carry across with nothing re-entered.</div>
            </div>
            <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Convert to project</button>
          </div>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: pursuit detail + contacts */}
        <div className="xl:col-span-1 space-y-5">
          <Card className="p-5">
            <SectionTitle>Pursuit detail</SectionTitle>
            <dl className="text-[13px] divide-y divide-line">
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Company</dt><dd className="font-semibold">{company?.name ?? "—"}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Type</dt><dd>{company && <Badge className={companyTone[company.type] ?? "bg-line"}>{company.type}</Badge>}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Stage</dt><dd className="font-semibold">{opp.stage}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Owner</dt><dd className="font-semibold">{opp.owner}</dd></div>
              <div className="flex justify-between py-2"><dt className="text-charcoal-muted">Weighted value</dt><dd className="font-semibold">{AED(weighted)}</dd></div>
            </dl>
          </Card>

          <Card className="p-5">
            <SectionTitle action={company && <Link className="text-xs text-emerald font-semibold" href={`/crm/companies/${company.id}`}>Company</Link>}>Contacts</SectionTitle>
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
        </div>

        {/* Right: activity timeline */}
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
