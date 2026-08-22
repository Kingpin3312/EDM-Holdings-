import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";

const more = [
  { name: "QuickBooks Online", cat: "Accounting", blurb: "Accounting sync as an alternative to Xero, across UK, Ireland and Australia." },
  { name: "PlanRadar", cat: "Site & QA", blurb: "Bring site snagging and quality records back into EDM OS." },
];

const catTone: Record<string, string> = {
  Accounting: "bg-emerald-soft text-emerald",
  Messaging: "bg-sage/30 text-emerald-dark",
  "E-signature": "bg-bronze/15 text-bronze",
  "Site & QA": "bg-line text-charcoal-muted",
};

export default function IntegrationsPage() {
  return (
    <Shell>
      <div className="mb-5">
        <h1 className="text-xl font-bold tracking-tight">Integrations</h1>
        <p className="text-sm text-charcoal-muted">Connect EDM OS to the tools your team already uses</p>
      </div>

      {/* Microsoft 365 — the recommended first connection */}
      <Card className="p-5 mb-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 shrink-0 rounded bg-emerald text-white grid place-items-center font-bold text-lg">M</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-charcoal">Microsoft 365</h2>
              <Badge className="bg-emerald text-white">Recommended</Badge>
              <Badge className="bg-line text-charcoal-muted">Not connected</Badge>
            </div>
            <p className="text-[13px] text-charcoal-muted mt-1">
              One connection covers four jobs — the highest-leverage integration for a Microsoft-based team.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bid calendar → Outlook", "Email logging", "Document storage (OneDrive)", "Single sign-on"].map((c) => (
                <span key={c} className="text-[11px] font-semibold bg-bone text-charcoal-muted px-2.5 py-1 rounded">{c}</span>
              ))}
            </div>
          </div>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Connect Microsoft 365</button>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Connecting is a one-time Microsoft sign-in (Azure app registration) — setup steps in <span className="font-mono">INTEGRATIONS.md</span>. Once connected, bid deadlines and follow-ups push to Outlook as all-day reminders, and re-syncing won't create duplicates.
        </p>
      </Card>

      {/* Xero — the recommended accounting connection */}
      <Card className="p-5 mb-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 shrink-0 rounded bg-charcoal text-white grid place-items-center font-bold text-lg">X</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-charcoal">Xero</h2>
              <Badge className="bg-emerald-soft text-emerald">Accounting</Badge>
              <Badge className="bg-line text-charcoal-muted">Not connected</Badge>
            </div>
            <p className="text-[13px] text-charcoal-muted mt-1">
              Makes a won bid mean something financially — no double entry between the CRM and the books.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Won deal → draft invoice", "Contact sync", "Payment status on accounts"].map((c) => (
                <span key={c} className="text-[11px] font-semibold bg-bone text-charcoal-muted px-2.5 py-1 rounded">{c}</span>
              ))}
            </div>
          </div>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Connect Xero</button>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Invoices are created as <span className="font-semibold">drafts</span> — reviewed and approved in Xero before anything reaches a client. Works across your UAE, UK, Ireland and Australia entities.
        </p>
      </Card>

      {/* WhatsApp Business — alerts the way the UAE works */}
      <Card className="p-5 mb-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 shrink-0 rounded bg-emerald text-white grid place-items-center font-bold text-lg">W</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-charcoal">WhatsApp Business</h2>
              <Badge className="bg-sage/30 text-emerald-dark">Messaging</Badge>
              <Badge className="bg-line text-charcoal-muted">Not connected</Badge>
            </div>
            <p className="text-[13px] text-charcoal-muted mt-1">
              Deadline and follow-up alerts on the channel your clients and team actually read.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Bid deadline alerts", "Follow-up reminders", "English & Arabic"].map((c) => (
                <span key={c} className="text-[11px] font-semibold bg-bone text-charcoal-muted px-2.5 py-1 rounded">{c}</span>
              ))}
            </div>
          </div>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Connect WhatsApp</button>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          Uses the WhatsApp Business Cloud API with pre-approved message templates. Connect with your Business phone number id and token (no OAuth redirect) — phone numbers are normalised automatically, including UAE local formats.
        </p>
      </Card>

      {/* DocuSign — e-signature for subcontracts and transmittals */}
      <Card className="p-5 mb-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 shrink-0 rounded bg-bronze text-white grid place-items-center font-bold text-lg">D</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-charcoal">DocuSign</h2>
              <Badge className="bg-bronze/15 text-bronze">E-signature</Badge>
              <Badge className="bg-line text-charcoal-muted">Not connected</Badge>
            </div>
            <p className="text-[13px] text-charcoal-muted mt-1">
              Send subcontract agreements and transmittal sign-offs for signature, straight from document control.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Subcontract agreements", "Transmittal sign-off", "Anchor-placed signature"].map((c) => (
                <span key={c} className="text-[11px] font-semibold bg-bone text-charcoal-muted px-2.5 py-1 rounded">{c}</span>
              ))}
            </div>
          </div>
          <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card shrink-0">Connect DocuSign</button>
        </div>
        <p className="text-[12px] text-charcoal-muted mt-4 pt-4 border-t border-line">
          A one-time DocuSign sign-in connects your account. Documents are sent with the signature tab placed by anchor text, and you can send immediately or hold as a draft.
        </p>
      </Card>

      <SectionTitle>More integrations</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {more.map((m) => (
          <Card key={m.name} className="p-4 flex flex-col">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-charcoal">{m.name}</span>
              <Badge className={catTone[m.cat] ?? "bg-line"}>{m.cat}</Badge>
            </div>
            <p className="text-[12px] text-charcoal-muted mt-1.5 flex-1">{m.blurb}</p>
            <div className="mt-3"><button className="text-[13px] font-semibold text-emerald border border-emerald rounded px-3 py-1.5">Connect</button></div>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
