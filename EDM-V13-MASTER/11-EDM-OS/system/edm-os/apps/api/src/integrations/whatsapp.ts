// Pure mapping: an EDM alert -> a WhatsApp Cloud API template message. No I/O, so
// fully unit-testable. Proactive (business-initiated) messages must use a
// pre-approved template, so each alert type maps to a named template with body
// parameters in a fixed order.

export type WhatsAppAlertInput = {
  type: "bid" | "follow-up" | "task";
  title: string;
  date: string; // already-formatted date string, e.g. "24 Jun 2026"
  company?: string;
};

export type WhatsAppMessage = {
  messaging_product: "whatsapp";
  to: string;
  type: "template";
  template: {
    name: string;
    language: { code: string };
    components: { type: "body"; parameters: { type: "text"; text: string }[] }[];
  };
};

const TEMPLATE: Record<WhatsAppAlertInput["type"], string> = {
  bid: "bid_deadline_reminder",
  "follow-up": "follow_up_reminder",
  task: "task_reminder",
};

// WhatsApp wants a country-coded number, digits only (no +, no leading 0).
// Local numbers (leading 0) get the default country code; "00" international
// prefix and a leading "+" are both stripped.
export function normalizePhone(raw: string, defaultCc = "971"): string {
  let d = raw.replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  else if (d.startsWith("0")) d = defaultCc + d.slice(1);
  return d;
}

export function toWhatsAppTemplate(alert: WhatsAppAlertInput, to: string, opts: { languageCode?: string; defaultCc?: string } = {}): WhatsAppMessage {
  const parameters = [alert.title, alert.date, alert.company ?? "—"].map((text) => ({ type: "text" as const, text }));
  return {
    messaging_product: "whatsapp",
    to: normalizePhone(to, opts.defaultCc),
    type: "template",
    template: {
      name: TEMPLATE[alert.type],
      language: { code: opts.languageCode ?? "en" },
      components: [{ type: "body", parameters }],
    },
  };
}
