import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge } from "@/components/ui";
import { CrmTable } from "@/components/CrmTable";
import { contactsList, companyName } from "@/lib/data";
import Link from "next/link";

export default function ContactsPage() {
  const primaryCount = contactsList.filter((c) => c.isPrimary).length;
  const companiesCovered = new Set(contactsList.map((c) => c.companyId)).size;

  const rows = contactsList.map((c) => {
    const company = companyName(c.companyId);
    return {
      key: c.id,
      search: `${c.firstName} ${c.lastName} ${c.jobTitle} ${company} ${c.email} ${c.phone}`.toLowerCase(),
      cells: [
        <div className="flex items-center gap-2"><span className="font-semibold text-charcoal">{c.firstName} {c.lastName}</span>{c.isPrimary && <Badge className="bg-emerald-soft text-emerald">Key</Badge>}</div>,
        <span className="text-charcoal-muted">{c.jobTitle}</span>,
        <Link href={`/crm/companies/${c.companyId}`} className="text-emerald font-semibold hover:underline">{company}</Link>,
        <span className="text-charcoal-muted">{c.email}</span>,
        <span className="text-charcoal-muted">{c.phone}</span>,
      ],
      csv: [`${c.firstName} ${c.lastName}`, c.jobTitle, company, c.email, c.phone],
    };
  });

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Contacts across your client and supply-chain network</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New contact</button>
      </div>
      <CrmTabs active="contacts" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Total contacts</div><div className="mt-1 text-2xl font-bold">{contactsList.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Key contacts</div><div className="mt-1 text-2xl font-bold">{primaryCount}</div></Card>
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-sage">Companies covered</div><div className="mt-1 text-2xl font-bold">{companiesCovered}</div></Card>
      </div>

      <Card className="p-5">
        <CrmTable
          headers={["Contact", "Role", "Company", "Email", "Phone"]}
          rows={rows}
          filename="edm-contacts"
          placeholder="Search contacts…"
        />
      </Card>
    </Shell>
  );
}
