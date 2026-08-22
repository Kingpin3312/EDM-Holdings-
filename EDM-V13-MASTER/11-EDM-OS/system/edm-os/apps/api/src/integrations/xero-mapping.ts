// Pure mapping: EDM records -> Xero API payloads. No I/O, fully unit-testable.
// A won opportunity becomes a DRAFT sales (ACCREC) invoice so nothing is sent to
// a client automatically — someone reviews and approves it in Xero.

export type XeroContactInput = { name: string; email?: string; phone?: string };
export type XeroInvoiceInput = {
  clientName: string;
  description: string;
  amount: number;
  reference?: string;
  currency?: string; // defaults to AED
};

export type XeroContact = {
  Name: string;
  EmailAddress?: string;
  Phones?: { PhoneType: "DEFAULT"; PhoneNumber: string }[];
};

export type XeroInvoice = {
  Type: "ACCREC";
  Status: "DRAFT";
  Contact: { Name: string };
  Date: string; // YYYY-MM-DD
  DueDate: string; // YYYY-MM-DD
  CurrencyCode: string;
  Reference?: string;
  LineItems: { Description: string; Quantity: number; UnitAmount: number; AccountCode: string }[];
};

export function toXeroContact(c: XeroContactInput): XeroContact {
  const out: XeroContact = { Name: c.name };
  if (c.email) out.EmailAddress = c.email;
  if (c.phone) out.Phones = [{ PhoneType: "DEFAULT", PhoneNumber: c.phone }];
  return out;
}

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Sales account code 200 is Xero's default "Sales" account; payment terms default
// to 30 days. Both are overridable by the caller.
export function toXeroInvoice(inv: XeroInvoiceInput, opts: { date: string; paymentTermDays?: number; accountCode?: string }): XeroInvoice {
  const termDays = opts.paymentTermDays ?? 30;
  return {
    Type: "ACCREC",
    Status: "DRAFT",
    Contact: { Name: inv.clientName },
    Date: opts.date,
    DueDate: addDays(opts.date, termDays),
    CurrencyCode: inv.currency ?? "AED",
    Reference: inv.reference,
    LineItems: [
      { Description: inv.description, Quantity: 1, UnitAmount: inv.amount, AccountCode: opts.accountCode ?? "200" },
    ],
  };
}
