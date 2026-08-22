// Pure mapping: an EDM OS calendar item -> a Microsoft Graph event payload.
// No I/O, so it's fully unit-testable. Deadlines are date-only (YYYY-MM-DD), so
// we create all-day events — Graph requires start at 00:00 and end at the next
// day 00:00 for all-day events.

export type EdmCalendarItem = {
  date: string; // YYYY-MM-DD
  title: string;
  type: "bid" | "follow-up" | "task";
  company?: string;
  href?: string; // relative path within EDM OS (e.g. /crm/opportunities/opp-001)
};

export type GraphEvent = {
  subject: string;
  body: { contentType: "HTML"; content: string };
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  isAllDay: boolean;
  isReminderOn: boolean;
  reminderMinutesBeforeStart: number;
  categories: string[];
  transactionId: string; // idempotency key — re-running a sync won't duplicate events
};

const LABEL: Record<EdmCalendarItem["type"], string> = {
  bid: "Bid",
  "follow-up": "Follow-up",
  task: "Task",
};

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export function nextDay(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function toGraphEvent(item: EdmCalendarItem, opts: { timeZone: string; appBaseUrl?: string }): GraphEvent {
  const label = LABEL[item.type];
  const link = item.href ? `${opts.appBaseUrl ?? ""}${item.href}` : undefined;
  const bodyLines = [
    item.company ? `Client: ${item.company}` : null,
    link ? `<a href="${link}">Open in EDM OS</a>` : null,
  ].filter(Boolean) as string[];
  return {
    subject: `${label}: ${item.title}`,
    body: { contentType: "HTML", content: bodyLines.join("<br>") || item.title },
    start: { dateTime: `${item.date}T00:00:00`, timeZone: opts.timeZone },
    end: { dateTime: `${nextDay(item.date)}T00:00:00`, timeZone: opts.timeZone },
    isAllDay: true,
    isReminderOn: true,
    reminderMinutesBeforeStart: item.type === "bid" ? 1440 : 720, // bids remind a day ahead; others 12h
    categories: ["EDM OS", label],
    transactionId: `edmos-${item.type}-${item.date}-${slug(item.title)}`,
  };
}
