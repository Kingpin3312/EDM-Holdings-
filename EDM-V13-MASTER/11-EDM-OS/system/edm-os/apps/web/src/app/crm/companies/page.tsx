import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge } from "@/components/ui";
import { CrmTable } from "@/components/CrmTable";
import { companies, companyTone } from "@/lib/data";
import Link from "next/link";

export default function CompaniesPage() {
  const rows = companies.map((c) => ({
    key: c.id,
    search: `${c.name} ${c.type} ${c.city}`.toLowerCase(),
    cells: [
      <Link href={`/crm/companies/${c.id}`} className="font-semibold text-charcoal hover:text-emerald transition-colors">{c.name}</Link>,
      <Badge className={companyTone[c.type] ?? "bg-line"}>{c.type}</Badge>,
      <span className="text-charcoal-muted">{c.city}</span>,
      c.contacts,
      c.opps,
    ],
    csv: [c.name, c.type, c.city, c.contacts, c.opps],
  }));

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Pipeline, relationships and follow-ups</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New company</button>
      </div>
      <CrmTabs active="companies" />
      <Card className="p-5">
        <CrmTable
          headers={["Company", "Type", "City", "Contacts", "Opportunities"]}
          rows={rows}
          filename="edm-companies"
          placeholder="Search companies…"
          align={["left", "left", "left", "right", "right"]}
        />
      </Card>
    </Shell>
  );
}
