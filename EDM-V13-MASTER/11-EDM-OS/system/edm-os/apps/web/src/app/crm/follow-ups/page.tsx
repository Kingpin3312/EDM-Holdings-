import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { crmAgenda } from "@/lib/data";
import { getAgenda } from "@/lib/server-data";
import Link from "next/link";

type Item = (typeof crmAgenda)["bidDeadlines"][number];

function dueTone(i: Item) {
  if (i.overdue) return "bg-charcoal/10 text-charcoal";
  if (i.days === 0) return "bg-emerald text-white";
  if (i.days <= 7) return "bg-sage/30 text-emerald-dark";
  return "bg-bone text-charcoal-muted";
}

function Row({ i }: { i: Item }) {
  return (
    <Link href={i.href} className="flex items-center justify-between gap-3 py-3 border-b border-line/60 last:border-0 hover:text-emerald transition-colors">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-charcoal truncate">{i.title}</div>
        <div className="text-[11px] text-charcoal-muted">{i.sub}{i.owner ? ` · ${i.owner}` : ""}</div>
      </div>
      <Badge className={`shrink-0 ${dueTone(i)}`}>{i.due}</Badge>
    </Link>
  );
}

export default async function FollowUpsPage() {
  const { bidDeadlines, followUps, tasks } = await getAgenda();
  const all = [...bidDeadlines, ...followUps, ...tasks];
  const overdue = all.filter((i) => i.overdue).length;
  const thisWeek = all.filter((i) => i.days <= 7).length;
  const nextBid = bidDeadlines[0];

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Follow-ups &amp; deadlines — so nothing slips</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">Log activity</button>
      </div>
      <CrmTabs active="followups" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className={`p-4 ${overdue > 0 ? "bg-emerald text-white border-emerald" : ""}`}><div className={`text-[11px] uppercase tracking-wider font-semibold ${overdue > 0 ? "text-sage" : "text-charcoal-muted"}`}>Overdue</div><div className="mt-1 text-2xl font-bold">{overdue}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Due this week</div><div className="mt-1 text-2xl font-bold">{thisWeek}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open bid deadlines</div><div className="mt-1 text-2xl font-bold">{bidDeadlines.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Next submission</div><div className="mt-1 text-2xl font-bold">{nextBid?.due ?? "—"}</div></Card>
      </div>

      <Card className="p-5 mb-5">
        <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/pipeline">Pipeline</Link>}>Bid deadlines</SectionTitle>
        <div>{bidDeadlines.map((i) => <Row key={i.id} i={i} />)}</div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card className="p-5">
          <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/leads">Leads</Link>}>Lead follow-ups</SectionTitle>
          <div>{followUps.map((i) => <Row key={i.id} i={i} />)}</div>
        </Card>
        <Card className="p-5">
          <SectionTitle>Open tasks</SectionTitle>
          <div>{tasks.map((i) => <Row key={i.id} i={i} />)}</div>
        </Card>
      </div>
    </Shell>
  );
}
