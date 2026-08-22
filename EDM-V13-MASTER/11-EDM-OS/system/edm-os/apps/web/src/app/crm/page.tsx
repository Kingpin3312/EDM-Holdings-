import { Shell } from "@/components/Shell";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { CrmTabs } from "@/components/CrmTabs";
import { AED, pipelineStages, accountFocus } from "@/lib/data";
import { getAnalytics, getForecast, getAccounts, getCalendar } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";
import { ForecastVsCapacity, WinRateBar } from "@/components/Charts";
import { daysUntil, countdownLabel } from "@/lib/calendar";
import Link from "next/link";

const typeBadge = { bid: "bg-emerald text-white", "follow-up": "bg-sage/40 text-emerald-dark", task: "bg-charcoal text-white" } as const;

export default async function CrmPage() {
  const [analyticsS, forecastS, accountsS, calendarS] = await Promise.all([getAnalytics(), getForecast(), getAccounts(), getCalendar()]);
  const analytics = analyticsS.data, forecast = forecastS.data, accounts = accountsS.data, calendar = calendarS.data;
  // If any panel fell back to the fixture, say so once at the top rather than
  // letting invented numbers sit beside real ones with nothing to tell them apart.
  const fellBack = [analyticsS, forecastS, accountsS, calendarS].find((x) => x.source === "demo");

  const now = new Date();
  // With no delivery capacity configured there is nothing to be over. Comparing
  // against a capacity of zero made every month with any pipeline read as
  // "over capacity", which is alarming and wrong.
  const capacitySet = forecast.months.some((m) => m.capacity > 0);
  const overMonths = capacitySet ? forecast.months.filter((m) => m.projected > m.capacity) : [];
  const events = [...calendar.events].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const bidsThisMonth = calendar.events.filter((e) => { const d = new Date(e.date); return e.type === "bid" && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); }).length;
  const nextDeadline = events.find((e) => daysUntil(e.date) >= 0) ?? events[0];
  const topAccount = accounts[0];
  const topFocus = topAccount ? accountFocus(topAccount) : null;

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Command center — pipeline, wins and what needs attention</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New lead</button>
      </div>
      <CrmTabs active="overview" />
      {fellBack && <DataSourceBanner source="demo" reason={fellBack.reason} />}

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="p-4 bg-emerald text-white border-emerald"><div className="text-[11px] uppercase tracking-wider font-semibold text-emerald-on">Weighted pipeline</div><div className="mt-1 text-2xl font-bold">{AED(analytics.weightedOpen)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Win rate</div><div className="mt-1 text-2xl font-bold">{analytics.winRatePct}%</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Open opportunities</div><div className="mt-1 text-2xl font-bold">{analytics.openCount}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Bids due this month</div><div className="mt-1 text-2xl font-bold">{bidsThisMonth}</div></Card>
      </div>

      {/* Forecast and win rate — the two questions a director actually asks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        <Card className="p-5 lg:col-span-2"><ForecastVsCapacity months={forecast.months} /></Card>
        <Card className="p-5 flex flex-col justify-between gap-4">
          <WinRateBar won={analytics.wonCount} lost={analytics.lostCount} />
          <div className="pt-3 border-t" style={{ borderColor: "#E4E6E0" }}>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">By value</div>
            <div className="mt-1 text-lg font-bold text-charcoal tabular-nums">{analytics.valueWinRatePct}%</div>
            <div className="text-[12px] text-charcoal-muted">{AED(analytics.wonValue)} won of {AED(analytics.wonValue + analytics.lostValue)} closed</div>
          </div>
        </Card>
      </div>

      {/* Intelligence highlights — link into the deep screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <Link href="/crm/forecast" className="block">
          <Card className={`p-4 h-full transition-colors hover:border-emerald ${overMonths.length ? "" : ""}`}>
            <div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Capacity watch</div><span className="text-[11px] text-emerald font-semibold">Forecast →</span></div>
            {!capacitySet ? (
              <><div className="mt-1 text-lg font-bold text-charcoal">Not set</div><div className="text-[12px] text-charcoal-muted">Set a monthly delivery capacity to see where the pipeline outruns it</div></>
            ) : overMonths.length ? (
              <><div className="mt-1 text-lg font-bold text-charcoal">{overMonths.length} month{overMonths.length > 1 ? "s" : ""} over capacity</div><div className="text-[12px] text-charcoal-muted">{overMonths.map((m) => m.label.replace(/ \d{4}$/, "")).join(", ")} — plan to subcontract or hire</div></>
            ) : (<><div className="mt-1 text-lg font-bold text-emerald">Capacity healthy</div><div className="text-[12px] text-charcoal-muted">No months over delivery capacity</div></>)}
          </Card>
        </Link>
        <Link href="/crm/accounts" className="block">
          <Card className="p-4 h-full transition-colors hover:border-emerald">
            <div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Top account</div><span className="text-[11px] text-emerald font-semibold">Accounts →</span></div>
            {topAccount && (<><div className="mt-1 text-lg font-bold text-charcoal leading-tight">{topAccount.name}</div><div className="text-[12px] text-charcoal-muted">{AED(topAccount.wonValue)} won · {topAccount.winRatePct}% win rate {topFocus && <Badge className={`${topFocus.tone} ml-1`}>{topFocus.label}</Badge>}</div></>)}
          </Card>
        </Link>
        <Link href="/crm/calendar" className="block">
          <Card className="p-4 h-full transition-colors hover:border-emerald">
            <div className="flex items-center justify-between"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Next deadline</div><span className="text-[11px] text-emerald font-semibold">Calendar →</span></div>
            {nextDeadline && (<><div className="mt-1 text-lg font-bold text-charcoal leading-tight">{nextDeadline.title.split(" — ")[0]}</div><div className="text-[12px] text-charcoal-muted">{nextDeadline.company} · <span className={daysUntil(nextDeadline.date) < 0 ? "text-charcoal font-semibold" : ""}>{countdownLabel(daysUntil(nextDeadline.date))}</span></div></>)}
          </Card>
        </Link>
      </div>

      {/* Pipeline snapshot */}
      <Card className="p-5 mb-5">
        <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/pipeline">Full pipeline</Link>}>Opportunity pipeline</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pipelineStages.map((col) => {
            const total = col.opps.reduce((s, o) => s + o.value, 0);
            return (
              <div key={col.stage} className="bg-bone rounded-card p-3">
                <div className="flex justify-between items-baseline mb-3"><span className="text-xs font-bold uppercase tracking-wider text-emerald">{col.stage}</span><span className="text-[11px] text-charcoal-muted">{AED(total)}</span></div>
                <div className="space-y-2">
                  {col.opps.map((o) => (
                    <div key={o.name} className="bg-white border border-line rounded p-3">
                      <div className="font-semibold text-[13px] text-charcoal leading-tight">{o.name}</div>
                      <div className="text-[11px] text-charcoal-muted mt-0.5">{o.co}</div>
                      <div className="flex justify-between items-center mt-2"><span className="text-[12px] font-semibold">{AED(o.value)}</span><Badge className="bg-emerald-soft text-emerald">{o.prob}%</Badge></div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Upcoming deadlines */}
        <Card className="p-5">
          <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/calendar">Calendar</Link>}>Upcoming deadlines</SectionTitle>
          <div>
            {events.slice(0, 5).map((e, i) => {
              const du = daysUntil(e.date);
              return (
                <Link key={i} href={e.href} className="flex items-center justify-between gap-3 py-2.5 border-b border-line/60 last:border-0 hover:bg-bone/40 -mx-2 px-2 rounded transition-colors">
                  <div className="min-w-0"><div className="text-[13px] font-semibold text-charcoal truncate">{e.title}</div><div className="text-[11px] text-charcoal-muted truncate">{e.company}</div></div>
                  <div className="text-right shrink-0"><Badge className={typeBadge[e.type]}>{e.type === "follow-up" ? "Follow-up" : e.type === "bid" ? "Bid" : "Task"}</Badge><div className={`text-[11px] mt-1 ${du < 0 ? "text-charcoal font-semibold" : "text-charcoal-muted"}`}>{countdownLabel(du)}</div></div>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Top accounts */}
        <Card className="p-5">
          <SectionTitle action={<Link className="text-xs text-emerald font-semibold" href="/crm/accounts">All accounts</Link>}>Top accounts</SectionTitle>
          <div>
            {accounts.slice(0, 4).map((a, i) => {
              const focus = accountFocus(a);
              return (
                <Link key={a.id} href="/crm/accounts" className="flex items-center gap-3 py-2.5 border-b border-line/60 last:border-0 hover:bg-bone/40 -mx-2 px-2 rounded transition-colors">
                  <div className="text-charcoal-muted font-semibold w-5">{i + 1}</div>
                  <div className="flex-1 min-w-0"><div className="text-[13px] font-semibold text-charcoal truncate">{a.name}</div><div className="text-[11px] text-charcoal-muted">{AED(a.wonValue)} won · {a.winRatePct}% win</div></div>
                  <Badge className={focus.tone}>{focus.label}</Badge>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </Shell>
  );
}
