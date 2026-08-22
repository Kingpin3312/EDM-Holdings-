import { Shell } from "@/components/Shell";
import { CrmTabs } from "@/components/CrmTabs";
import { Card, Badge, SectionTitle } from "@/components/ui";
import { AED, type CalendarEvent } from "@/lib/data";
import { getCalendar } from "@/lib/server-data";
import { DataSourceBanner } from "@/components/DataSource";
import { buildMonthGrid, daysUntil, countdownLabel } from "@/lib/calendar";
import Link from "next/link";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const chipTone: Record<CalendarEvent["type"], string> = {
  bid: "bg-emerald text-white",
  "follow-up": "bg-sage/40 text-emerald-dark",
  task: "bg-charcoal text-white",
};
const typeLabel: Record<CalendarEvent["type"], string> = { bid: "Bid", "follow-up": "Follow-up", task: "Task" };

export default async function CalendarPage() {
  const calendarS = await getCalendar();
  const { events } = calendarS.data;
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const todayDom = now.getDate();
  const monthLabel = now.toLocaleString("en", { month: "long", year: "numeric" });

  const weeks = buildMonthGrid(y, m);
  const inMonth = events.filter((e) => { const d = new Date(e.date); return d.getFullYear() === y && d.getMonth() === m; });
  const byDay = new Map<number, CalendarEvent[]>();
  for (const e of inMonth) { const day = new Date(e.date).getDate(); const arr = byDay.get(day) ?? []; arr.push(e); byDay.set(day, arr); }

  const sorted = [...events].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const bidsThisMonth = inMonth.filter((e) => e.type === "bid");
  const bidValue = bidsThisMonth.reduce((s, e) => s + (e.value ?? 0), 0);
  const overdue = events.filter((e) => daysUntil(e.date) < 0).length;
  const next = sorted.find((e) => daysUntil(e.date) >= 0);

  return (
    <Shell>
      <div className="mb-5 flex items-end justify-between gap-3 flex-wrap">
        <div><h1 className="text-xl font-bold tracking-tight">CRM</h1><p className="text-sm text-charcoal-muted">Bid calendar — submission deadlines &amp; key dates</p></div>
        <button className="bg-emerald text-white text-sm font-semibold px-4 py-2 rounded-card">New deadline</button>
      </div>
      <CrmTabs active="calendar" />
      <DataSourceBanner source={calendarS.source} reason={calendarS.reason} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Bids due this month</div><div className="mt-1 text-2xl font-bold">{bidsThisMonth.length}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Bid value due</div><div className="mt-1 text-2xl font-bold">{AED(bidValue)}</div></Card>
        <Card className="p-4"><div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal-muted">Next deadline</div><div className="mt-1 text-[15px] font-bold leading-tight truncate">{next ? next.title.split(" — ")[0] : "—"}</div><div className="text-xs text-charcoal-muted">{next ? countdownLabel(daysUntil(next.date)) : "Nothing upcoming"}</div></Card>
        <Card className={`p-4 ${overdue > 0 ? "bg-charcoal text-white border-charcoal" : "bg-emerald text-white border-emerald"}`}><div className={`text-[11px] uppercase tracking-wider font-semibold ${overdue > 0 ? "text-white/70" : "text-emerald-on"}`}>Overdue</div><div className="mt-1 text-2xl font-bold">{overdue}</div></Card>
      </div>

      {/* Month grid — tablet/laptop */}
      <Card className="p-5 mb-5 hidden md:block">
        <div className="flex items-baseline justify-between mb-3">
          <SectionTitle>{monthLabel}</SectionTitle>
          <div className="flex items-center gap-3 text-[11px] text-charcoal-muted">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald inline-block" /> Bid</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-sage inline-block" /> Follow-up</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-charcoal inline-block" /> Task</span>
          </div>
        </div>
        <div className="grid grid-cols-7 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider mb-1">
          {WEEKDAYS.map((w) => (<div key={w} className="px-1.5 py-1">{w}</div>))}
        </div>
        <div className="border-t border-l border-line">
          {weeks.map((week, wi) => (
            <div key={wi} className="grid grid-cols-7">
              {week.map((day, di) => {
                const evs = day ? byDay.get(day) ?? [] : [];
                const isToday = day === todayDom;
                return (
                  <div key={di} className={`min-h-[88px] border-b border-r border-line p-1.5 align-top ${day ? "" : "bg-bone/50"}`}>
                    {day && (
                      <div className={`text-[11px] font-semibold mb-1 ${isToday ? "bg-emerald text-white rounded-full w-5 h-5 grid place-items-center" : "text-charcoal-muted"}`}>{day}</div>
                    )}
                    <div className="space-y-1">
                      {evs.slice(0, 2).map((e, i) => (
                        <Link key={i} href={e.href} className={`block truncate text-[10px] leading-tight px-1.5 py-0.5 rounded ${chipTone[e.type]}`} title={e.title}>{e.title}</Link>
                      ))}
                      {evs.length > 2 && <div className="text-[10px] text-charcoal-muted px-1">+{evs.length - 2} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming list — all screens */}
      <Card className="p-5">
        <SectionTitle>Upcoming deadlines</SectionTitle>
        <div>
          {sorted.map((e, i) => {
            const du = daysUntil(e.date);
            const d = new Date(e.date);
            return (
              <Link key={i} href={e.href} className="flex items-center gap-3 py-2.5 border-b border-line/60 last:border-0 hover:bg-bone/40 -mx-2 px-2 rounded transition-colors">
                <div className="w-11 text-center shrink-0">
                  <div className="text-[10px] uppercase text-charcoal-muted">{d.toLocaleString("en", { weekday: "short" })}</div>
                  <div className="text-lg font-bold leading-none text-charcoal">{d.getDate()}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-charcoal text-sm truncate">{e.title}</div>
                  <div className="text-[11px] text-charcoal-muted truncate">{e.company}{e.value ? ` · ${AED(e.value)}` : ""}</div>
                </div>
                <div className="text-right shrink-0">
                  <Badge className={chipTone[e.type]}>{typeLabel[e.type]}</Badge>
                  <div className={`text-[11px] mt-1 ${du < 0 ? "text-charcoal font-semibold" : "text-charcoal-muted"}`}>{countdownLabel(du)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    </Shell>
  );
}
