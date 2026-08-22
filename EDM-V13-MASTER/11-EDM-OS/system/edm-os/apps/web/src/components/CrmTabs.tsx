import Link from "next/link";

const tabs = [
  { href: "/crm", label: "Overview", key: "overview" },
  { href: "/crm/pipeline", label: "Pipeline", key: "pipeline" },
  { href: "/crm/leads", label: "Leads", key: "leads" },
  { href: "/crm/follow-ups", label: "Follow-ups", key: "followups" },
  { href: "/crm/calendar", label: "Calendar", key: "calendar" },
  { href: "/crm/companies", label: "Companies", key: "companies" },
  { href: "/crm/accounts", label: "Accounts", key: "accounts" },
  { href: "/crm/contacts", label: "Contacts", key: "contacts" },
  { href: "/crm/forecast", label: "Forecast", key: "forecast" },
  { href: "/crm/estimators", label: "Estimators", key: "estimators" },
  { href: "/crm/analytics", label: "Analytics", key: "analytics" },
];

export function CrmTabs({ active }: { active: string }) {
  return (
    <div className="flex gap-1 border-b border-line mb-5 overflow-x-auto">
      {tabs.map((t) => (
        <Link key={t.key} href={t.href}
          className={`shrink-0 whitespace-nowrap px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${active === t.key ? "border-emerald text-emerald" : "border-transparent text-charcoal-muted hover:text-charcoal"}`}>
          {t.label}
        </Link>
      ))}
    </div>
  );
}
