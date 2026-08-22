// Mock data for the UI shell. In production these come from the API
// (apps/api) — e.g. GET /api/v1/tenders/pipeline, /projects, etc.

export const AED = (n: number) =>
  new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }).format(n);

export const executiveKpis = {
  weightedPipeline: 4_120_000,
  tenderGross: 9_650_000,
  activeProjects: 6,
  monthRevenue: 1_280_000,
  grossProfitPct: 21.4,
  outstandingInvoices: 1_540_000,
  retentionsHeld: 612_000,
  variationsPendingValue: 388_000,
  variationsPendingCount: 5,
  cashPosition: 940_000,
  labourUtilisation: 86,
};

export const revenueByMonth = [
  { m: "Jan", v: 720 }, { m: "Feb", v: 810 }, { m: "Mar", v: 905 }, { m: "Apr", v: 1120 },
  { m: "May", v: 980 }, { m: "Jun", v: 1280 }, { m: "Jul", v: 1180 }, { m: "Aug", v: 1340 },
];

export const tenders = [
  { no: "EDM-T-0007", project: "Business Bay Office Fit-Out", contractor: "Tier-1 Main Contractor", value: 1_850_000, due: "in 12 days", prob: 55, status: "In progress" },
  { no: "EDM-T-0006", project: "DIFC Retail Refurbishment", contractor: "Prime Builders", value: 920_000, due: "in 3 days", prob: 40, status: "Submitted" },
  { no: "EDM-T-0005", project: "JBR Hotel Guest Floors", contractor: "Coastline Cont.", value: 2_640_000, due: "in 21 days", prob: 35, status: "In progress" },
  { no: "EDM-T-0004", project: "Sharjah University Block C", contractor: "Emirates Build", value: 1_180_000, due: "in 6 days", prob: 60, status: "Shortlisted" },
  { no: "EDM-T-0003", project: "Abu Dhabi Clinic Fit-Out", contractor: "Capital Cont.", value: 780_000, due: "closed", prob: 0, status: "Lost" },
];

export const projects = [
  { code: "EDM-P-0001", name: "Sheikh Zayed Road HQ Fit-Out", emirate: "Dubai", value: 2_400_000, status: "Active", progress: 62, rfis: 3, variations: 2 },
  { code: "EDM-P-0002", name: "Marina Tower Lobby Refurb", emirate: "Dubai", value: 880_000, status: "Active", progress: 41, rfis: 1, variations: 1 },
  { code: "EDM-P-0003", name: "Yas Mall Unit 214 Fit-Out", emirate: "Abu Dhabi", value: 1_150_000, status: "Snagging", progress: 94, rfis: 0, variations: 3 },
  { code: "EDM-P-0004", name: "Al Quoz Warehouse Office", emirate: "Dubai", value: 460_000, status: "Active", progress: 28, rfis: 2, variations: 0 },
];

export const statusTone: Record<string, string> = {
  "In progress": "bg-emerald-soft text-emerald",
  Submitted: "bg-sage/30 text-emerald-dark",
  Shortlisted: "bg-emerald text-white",
  Active: "bg-emerald-soft text-emerald",
  Snagging: "bg-amber-100 text-amber-800",
  Lost: "bg-line text-charcoal-muted",
};

// ---- CRM mock data (production: GET /api/v1/crm/*) ----
export const crmKpis = { weightedPipeline: 1_580_000, openOpps: 4, openLeads: 5, followUpsDue: 3, companies: 14 };

export const pipelineStages = [
  { stage: "Qualifying", opps: [{ name: "Downtown tower fit-out", co: "Prime Developer", value: 1_600_000, prob: 20 }] },
  { stage: "Engaged", opps: [{ name: "JBR Hotel Guest Floors", co: "Coastline Cont.", value: 2_640_000, prob: 35 }] },
  { stage: "Proposal", opps: [{ name: "Business Bay Office", co: "Tier-1 Main Cont.", value: 1_850_000, prob: 55 }, { name: "Sharjah Uni Block C", co: "Emirates Build", value: 1_180_000, prob: 60 }] },
];

export const followUps = [
  { what: "Chase tender clarification — Business Bay", co: "Tier-1 Main Cont.", due: "Tomorrow", type: "Call", overdue: false },
  { what: "Send capability statement", co: "Prime Developer", due: "Today", type: "Email", overdue: false },
  { what: "Follow up site walkover", co: "Coastline Cont.", due: "2 days ago", type: "Meeting", overdue: true },
];

export const companies = [
  { id: "tier1-main", name: "Tier-1 Main Contractor LLC", type: "Main contractor", city: "Dubai", contacts: 3, opps: 2 },
  { id: "prime-dev", name: "Prime Developer FZ", type: "Developer", city: "Dubai", contacts: 2, opps: 1 },
  { id: "coastline", name: "Coastline Contracting", type: "Main contractor", city: "Abu Dhabi", contacts: 1, opps: 1 },
  { id: "design-cons", name: "Design Consultants", type: "Consultant", city: "Abu Dhabi", contacts: 2, opps: 0 },
  { id: "emirates-build", name: "Emirates Build", type: "Main contractor", city: "Sharjah", contacts: 1, opps: 1 },
];

export const companyTone: Record<string, string> = {
  "Main contractor": "bg-emerald-soft text-emerald",
  Developer: "bg-sage/30 text-emerald-dark",
  Consultant: "bg-bone text-charcoal-muted",
};

// ---- CRM: leads + full pipeline board ----
export const leadsList = [
  { id: "lead-001", title: "Downtown tower fit-out package", company: "Prime Developer FZ", companyId: "prime-dev", type: "Developer", stage: "Qualifying", est: 1_600_000, follow: "in 2 days", owner: "Damien M.", source: "Referral — existing client", notes: "Repeat developer client. Drywall, ceilings and joinery across 14 floors. Wants budget pricing before main tender." },
  { id: "lead-002", title: "Marina retail units — 3 shells", company: "Coastline Contracting", companyId: "coastline", type: "Main contractor", stage: "Engaged", est: 740_000, follow: "Today", owner: "Damien M.", source: "Inbound enquiry", notes: "Three retail shells, fast-track. Coastline prefers lump-sum. Site walkover booked." },
  { id: "lead-003", title: "Govt office refurbishment", company: "Capital Contracting", companyId: undefined as string | undefined, type: "Main contractor", stage: "New", est: 2_100_000, follow: "in 5 days", owner: "Eddie D.", source: "Tender portal", notes: "Public-sector refurbishment. Prequalification documents required before bid." },
  { id: "lead-004", title: "Hospitality joinery package", company: "Design Consultants", companyId: "design-cons", type: "Consultant", stage: "Proposal", est: 580_000, follow: "Overdue", owner: "Damien M.", source: "Architect introduction", notes: "Bespoke joinery for a boutique hotel. Specs issued; awaiting our proposal." },
  { id: "lead-005", title: "School fit-out — Sharjah", company: "Emirates Build", companyId: "emirates-build", type: "Main contractor", stage: "Qualifying", est: 1_180_000, follow: "in 9 days", owner: "Eddie D.", source: "Repeat client", notes: "Partitions and ceilings, Block C. Programme alignment discussed by phone." },
];

export const leadStageTone: Record<string, string> = {
  New: "bg-bone text-charcoal-muted",
  Qualifying: "bg-sage/30 text-emerald-dark",
  Engaged: "bg-emerald-soft text-emerald",
  Proposal: "bg-emerald text-white",
  Won: "bg-emerald text-white",
  Lost: "bg-charcoal/10 text-charcoal",
};

export const leadById = (id: string) => leadsList.find((l) => l.id === id);

// Lead activity timeline — a tailored qualification trail per lead.
const leadExtraActivities = [
  { id: "la-1", leadId: "lead-001", type: "EMAIL", subject: "Sent capability statement & past projects", body: "Issued the EDM capability pack ahead of the Downtown tower package.", contact: "Mariam Al Suwaidi", owner: "Damien M.", when: "Today", due: null as string | null, done: true },
  { id: "la-2", leadId: "lead-001", type: "TASK", subject: "Prepare budget pricing for 14 floors", body: null as string | null, contact: "Mariam Al Suwaidi", owner: "Damien M.", when: null, due: "in 2 days", done: false },
  { id: "la-3", leadId: "lead-001", type: "NOTE", subject: "Qualified — strong fit, repeat client", body: "Existing relationship, clear scope and budget. Ready to move to opportunity.", contact: "—", owner: "Damien M.", when: "3 days ago", due: null as string | null, done: true },
  { id: "la-4", leadId: "lead-002", type: "SITE_VISIT", subject: "Site walkover — Marina retail shells", body: null as string | null, contact: "Rashid Bukhatir", owner: "Damien M.", when: "Today", due: null as string | null, done: false },
  { id: "la-5", leadId: "lead-004", type: "CALL", subject: "Discussed joinery spec & timeline", body: "Boutique hotel joinery. Awaiting our proposal — follow-up now overdue.", contact: "Elena Petrova", owner: "Damien M.", when: "9 days ago", due: null as string | null, done: true },
];
export const activitiesForLead = (leadId: string) => leadExtraActivities.filter((a) => a.leadId === leadId);

export const pipelineBoard = [
  { stage: "Qualifying", items: [{ id: "opp-002", name: "Downtown tower fit-out", co: "Prime Developer", companyId: "prime-dev", value: 1_600_000, prob: 20 }, { id: "opp-003", name: "School fit-out — Sharjah", co: "Emirates Build", companyId: "emirates-build", value: 1_180_000, prob: 25 }] },
  { stage: "Engaged", items: [{ id: "opp-004", name: "JBR Hotel Guest Floors", co: "Coastline Cont.", companyId: "coastline", value: 2_640_000, prob: 35 }] },
  { stage: "Proposal", items: [{ id: "opp-001", name: "Business Bay Office", co: "Tier-1 Main Cont.", companyId: "tier1-main", value: 1_850_000, prob: 55 }] },
  { stage: "Negotiation", items: [{ id: "opp-005", name: "Sharjah Uni Block C", co: "Emirates Build", companyId: "emirates-build", value: 1_180_000, prob: 70 }] },
];

// ---- CRM: contacts (production: GET /api/v1/crm/contacts) ----
// Shape mirrors the Contact model: scoped through company, isPrimary flag.
export const contactsList = [
  { id: "c-001", companyId: "tier1-main", firstName: "Khalid", lastName: "Rahman", jobTitle: "Commercial Manager", email: "k.rahman@tier1main.ae", phone: "+971 50 412 7788", isPrimary: true },
  { id: "c-002", companyId: "tier1-main", firstName: "Sara", lastName: "Idris", jobTitle: "Procurement Lead", email: "s.idris@tier1main.ae", phone: "+971 52 330 1190", isPrimary: false },
  { id: "c-003", companyId: "tier1-main", firstName: "James", lastName: "O'Connor", jobTitle: "Project Director", email: "j.oconnor@tier1main.ae", phone: "+971 50 998 2143", isPrimary: false },
  { id: "c-004", companyId: "prime-dev", firstName: "Mariam", lastName: "Al Suwaidi", jobTitle: "Development Manager", email: "m.alsuwaidi@primedev.ae", phone: "+971 56 220 4471", isPrimary: true },
  { id: "c-005", companyId: "prime-dev", firstName: "Tom", lastName: "Healy", jobTitle: "Cost Consultant", email: "t.healy@primedev.ae", phone: "+971 55 781 3320", isPrimary: false },
  { id: "c-006", companyId: "coastline", firstName: "Rashid", lastName: "Bukhatir", jobTitle: "Contracts Manager", email: "r.bukhatir@coastline.ae", phone: "+971 50 663 9087", isPrimary: true },
  { id: "c-007", companyId: "design-cons", firstName: "Elena", lastName: "Petrova", jobTitle: "Lead Architect", email: "e.petrova@designcons.ae", phone: "+971 52 145 6677", isPrimary: true },
  { id: "c-008", companyId: "design-cons", firstName: "Hassan", lastName: "Noor", jobTitle: "Interior Designer", email: "h.noor@designcons.ae", phone: "+971 56 904 2218", isPrimary: false },
  { id: "c-009", companyId: "emirates-build", firstName: "Yousef", lastName: "Mansour", jobTitle: "Senior QS", email: "y.mansour@emiratesbuild.ae", phone: "+971 50 552 8841", isPrimary: true },
];

// ---- CRM: activity timeline (production: GET /api/v1/crm/activities) ----
// type maps to the ActivityType enum: CALL, EMAIL, MEETING, NOTE, SITE_VISIT, TASK.
export const activitiesList = [
  { id: "a-001", companyId: "tier1-main", type: "CALL", subject: "Tender clarification — Business Bay scope", body: "Confirmed drywall + ceilings package boundaries with Khalid. Awaiting revised drawings.", contact: "Khalid Rahman", owner: "Damien M.", when: "Today", due: null, done: true },
  { id: "a-002", companyId: "tier1-main", type: "TASK", subject: "Issue revised proposal for Business Bay", body: null, contact: "Khalid Rahman", owner: "Damien M.", when: null, due: "Tomorrow", done: false },
  { id: "a-003", companyId: "tier1-main", type: "MEETING", subject: "Pre-tender site walkover", body: "Walked levels 2–3 with the PM. Noted hoist access constraint.", contact: "James O'Connor", owner: "Eddie D.", when: "4 days ago", due: null, done: true },
  { id: "a-004", companyId: "prime-dev", type: "EMAIL", subject: "Sent capability statement & past projects", body: "Issued the EDM capability pack ahead of the Downtown tower package.", contact: "Mariam Al Suwaidi", owner: "Damien M.", when: "Today", due: null, done: true },
  { id: "a-005", companyId: "prime-dev", type: "TASK", subject: "Follow up on Downtown tower shortlist", body: null, contact: "Mariam Al Suwaidi", owner: "Damien M.", when: null, due: "in 2 days", done: false },
  { id: "a-006", companyId: "coastline", type: "SITE_VISIT", subject: "JBR guest floors — measure & survey", body: "Site survey complete for the hotel guest floors. Photos on file.", contact: "Rashid Bukhatir", owner: "Eddie D.", when: "2 days ago", due: null, done: true },
  { id: "a-007", companyId: "coastline", type: "NOTE", subject: "Prefers fixed-price over remeasurable", body: "Rashid flagged a strong preference for lump-sum on fit-out packages.", contact: "Rashid Bukhatir", owner: "Eddie D.", when: "6 days ago", due: null, done: true },
  { id: "a-008", companyId: "design-cons", type: "MEETING", subject: "Joinery package design review", body: "Reviewed hospitality joinery details with Elena. Specs to follow.", contact: "Elena Petrova", owner: "Damien M.", when: "3 days ago", due: null, done: true },
  { id: "a-009", companyId: "emirates-build", type: "CALL", subject: "Sharjah Block C — programme alignment", body: "Aligned on the partitions & ceilings sequence for Block C.", contact: "Yousef Mansour", owner: "Eddie D.", when: "5 days ago", due: null, done: true },
];

export const activityTypeMeta: Record<string, { label: string; tone: string }> = {
  CALL: { label: "Call", tone: "bg-emerald-soft text-emerald" },
  EMAIL: { label: "Email", tone: "bg-sage/30 text-emerald-dark" },
  MEETING: { label: "Meeting", tone: "bg-emerald text-white" },
  NOTE: { label: "Note", tone: "bg-bone text-charcoal-muted" },
  SITE_VISIT: { label: "Site visit", tone: "bg-charcoal/10 text-charcoal" },
  TASK: { label: "Task", tone: "bg-sage/30 text-emerald-dark" },
};

// CRM selectors — the page-level joins the API does server-side.
export const companyById = (id: string) => companies.find((c) => c.id === id);
export const companyName = (id: string) => companyById(id)?.name ?? "—";
export const contactsForCompany = (id: string) => contactsList.filter((c) => c.companyId === id);
export const activitiesForCompany = (id: string) => activitiesList.filter((a) => a.companyId === id);
export const opportunitiesForCompany = (id: string) =>
  pipelineBoard.flatMap((s) => s.items.filter((o) => o.companyId === id).map((o) => ({ ...o, stage: s.stage })));

// ---- CRM: opportunities / pursuits (production: GET /api/v1/crm/opportunities) ----
// status maps to OpportunityStatus (OPEN | WON | LOST | ON_HOLD); stage applies while OPEN.
type Opp = {
  id: string; name: string; companyId: string; value: number; prob: number;
  stage: string; status: string; bidDue: string; owner: string; convertedProjectCode?: string;
};
export const opportunitiesList: Opp[] = [
  { id: "opp-001", name: "Business Bay Office", companyId: "tier1-main", value: 1_850_000, prob: 55, stage: "Proposal", status: "OPEN", bidDue: "in 12 days", owner: "Damien M." },
  { id: "opp-002", name: "Downtown tower fit-out", companyId: "prime-dev", value: 1_600_000, prob: 20, stage: "Qualifying", status: "OPEN", bidDue: "in 21 days", owner: "Damien M." },
  { id: "opp-003", name: "School fit-out — Sharjah", companyId: "emirates-build", value: 1_180_000, prob: 25, stage: "Qualifying", status: "OPEN", bidDue: "in 9 days", owner: "Eddie D." },
  { id: "opp-004", name: "JBR Hotel Guest Floors", companyId: "coastline", value: 2_640_000, prob: 35, stage: "Engaged", status: "OPEN", bidDue: "in 18 days", owner: "Eddie D." },
  { id: "opp-005", name: "Sharjah Uni Block C", companyId: "emirates-build", value: 1_180_000, prob: 70, stage: "Negotiation", status: "OPEN", bidDue: "in 4 days", owner: "Eddie D." },
  { id: "opp-006", name: "Marina Tower Lobby Refurb", companyId: "coastline", value: 880_000, prob: 100, stage: "Negotiation", status: "WON", bidDue: "closed", owner: "Eddie D.", convertedProjectCode: "EDM-P-0002" },
  // Closed history — drives win-rate analytics.
  { id: "opp-007", name: "DIFC Retail Refurbishment", companyId: "tier1-main", value: 920_000, prob: 100, stage: "Negotiation", status: "WON", bidDue: "closed", owner: "Damien M.", convertedProjectCode: "EDM-P-0003" },
  { id: "opp-008", name: "Yas Mall Unit 214 Fit-Out", companyId: "emirates-build", value: 1_150_000, prob: 100, stage: "Negotiation", status: "WON", bidDue: "closed", owner: "Eddie D.", convertedProjectCode: "EDM-P-0004" },
  { id: "opp-009", name: "Sheikh Zayed Road HQ Fit-Out", companyId: "prime-dev", value: 2_400_000, prob: 100, stage: "Negotiation", status: "WON", bidDue: "closed", owner: "Damien M.", convertedProjectCode: "EDM-P-0001" },
  { id: "opp-010", name: "Abu Dhabi Clinic Fit-Out", companyId: "design-cons", value: 780_000, prob: 0, stage: "Proposal", status: "LOST", bidDue: "closed", owner: "Damien M." },
  { id: "opp-011", name: "Al Quoz Warehouse Office", companyId: "emirates-build", value: 460_000, prob: 0, stage: "Engaged", status: "LOST", bidDue: "closed", owner: "Eddie D." },
  { id: "opp-012", name: "Marina retail units — 3 shells", companyId: "coastline", value: 740_000, prob: 0, stage: "Proposal", status: "LOST", bidDue: "closed", owner: "Eddie D." },
];

export const oppStatusTone: Record<string, string> = {
  OPEN: "bg-emerald-soft text-emerald", WON: "bg-emerald text-white", LOST: "bg-charcoal/10 text-charcoal", ON_HOLD: "bg-bone text-charcoal-muted",
};
export const oppStageTone: Record<string, string> = {
  Qualifying: "bg-bone text-charcoal-muted", Engaged: "bg-sage/30 text-emerald-dark", Proposal: "bg-emerald-soft text-emerald", Negotiation: "bg-emerald text-white",
};

export const opportunityById = (id: string) => opportunitiesList.find((o) => o.id === id);

// Won rollup — Procore-style "bid volume won" pipeline intelligence.
export const wonRollup = {
  count: opportunitiesList.filter((o) => o.status === "WON").length,
  value: opportunitiesList.filter((o) => o.status === "WON").reduce((s, o) => s + o.value, 0),
};

// Activity ↔ opportunity links (the opportunityId FK on Activity) + a few
// pursuit-specific entries (stage changes, the won handoff) for the timeline.
const activityOpportunity: Record<string, string> = {
  "a-001": "opp-001", "a-002": "opp-001", "a-004": "opp-002", "a-005": "opp-002", "a-006": "opp-004", "a-009": "opp-005",
};
const oppExtraActivities = [
  { id: "ax-1", opportunityId: "opp-001", type: "NOTE", subject: "Stage changed: Engaged → Proposal", body: null as string | null, contact: "—", owner: "Damien M.", when: "3 days ago", due: null as string | null, done: true },
  { id: "ax-2", opportunityId: "opp-006", type: "NOTE", subject: "Won — converted to project EDM-P-0002", body: "Lobby refurbishment handed to delivery. Project stood up in Preconstruction.", contact: "Rashid Bukhatir", owner: "Eddie D.", when: "8 days ago", due: null as string | null, done: true },
  { id: "ax-3", opportunityId: "opp-006", type: "MEETING", subject: "Final scope & price agreed", body: null as string | null, contact: "Rashid Bukhatir", owner: "Eddie D.", when: "10 days ago", due: null as string | null, done: true },
];
export const activitiesForOpportunity = (oppId: string) => [
  ...oppExtraActivities.filter((a) => a.opportunityId === oppId),
  ...activitiesList.filter((a) => activityOpportunity[a.id] === oppId),
];

// ---- CRM analytics / pipeline intelligence (production: GET /api/v1/crm/dashboard/analytics) ----
// Win/loss read from status; client type from the linked company. Mirrors the
// CrmDashboardService.analytics() shape so the page swaps to the API cleanly.
const _sumOpp = (a: Opp[]) => a.reduce((s, o) => s + o.value, 0);
const _pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
const _closed = opportunitiesList.filter((o) => o.status === "WON" || o.status === "LOST");
const _won = _closed.filter((o) => o.status === "WON");
const _lost = _closed.filter((o) => o.status === "LOST");
const _open = opportunitiesList.filter((o) => o.status === "OPEN");

export const crmAnalytics = {
  wonCount: _won.length,
  lostCount: _lost.length,
  winRatePct: _pct(_won.length, _closed.length),
  wonValue: _sumOpp(_won),
  lostValue: _sumOpp(_lost),
  valueWinRatePct: _pct(_sumOpp(_won), _sumOpp(_closed)),
  weightedOpen: _open.reduce((s, o) => s + o.value * (o.prob / 100), 0),
  openValue: _sumOpp(_open),
  openCount: _open.length,
  byType: ["Main contractor", "Developer", "Consultant"].map((type) => {
    const ids = companies.filter((c) => c.type === type).map((c) => c.id);
    const won = _won.filter((o) => ids.includes(o.companyId));
    const lost = _lost.filter((o) => ids.includes(o.companyId));
    return { type, won: won.length, lost: lost.length, winRatePct: _pct(won.length, won.length + lost.length), wonValue: _sumOpp(won) };
  }),
  funnel: [
    { label: "Leads", count: leadsList.length, value: leadsList.reduce((s, l) => s + l.est, 0) },
    { label: "Opportunities", count: opportunitiesList.length, value: _sumOpp(opportunitiesList) },
    { label: "Won", count: _won.length, value: _sumOpp(_won) },
  ],
};

// ---- CRM agenda / action inbox (production: GET /api/v1/crm/dashboard/agenda) ----
// Everything with a date attached, sorted by urgency. days: Overdue < 0, Today 0.
type AgendaItem = { id: string; title: string; sub: string; owner: string; due: string; days: number; overdue: boolean; href: string };
export const crmAgenda: { bidDeadlines: AgendaItem[]; followUps: AgendaItem[]; tasks: AgendaItem[] } = {
  bidDeadlines: [
    { id: "opp-005", title: "Sharjah Uni Block C", sub: "Emirates Build", owner: "Eddie D.", due: "in 4 days", days: 4, overdue: false, href: "/crm/opportunities/opp-005" },
    { id: "opp-003", title: "School fit-out — Sharjah", sub: "Emirates Build", owner: "Eddie D.", due: "in 9 days", days: 9, overdue: false, href: "/crm/opportunities/opp-003" },
    { id: "opp-001", title: "Business Bay Office", sub: "Tier-1 Main Contractor LLC", owner: "Damien M.", due: "in 12 days", days: 12, overdue: false, href: "/crm/opportunities/opp-001" },
    { id: "opp-004", title: "JBR Hotel Guest Floors", sub: "Coastline Contracting", owner: "Eddie D.", due: "in 18 days", days: 18, overdue: false, href: "/crm/opportunities/opp-004" },
    { id: "opp-002", title: "Downtown tower fit-out", sub: "Prime Developer FZ", owner: "Damien M.", due: "in 21 days", days: 21, overdue: false, href: "/crm/opportunities/opp-002" },
  ],
  followUps: [
    { id: "lead-004", title: "Hospitality joinery package", sub: "Design Consultants", owner: "Damien M.", due: "Overdue", days: -2, overdue: true, href: "/crm/leads/lead-004" },
    { id: "lead-002", title: "Marina retail units — 3 shells", sub: "Coastline Contracting", owner: "Damien M.", due: "Today", days: 0, overdue: false, href: "/crm/leads/lead-002" },
    { id: "lead-001", title: "Downtown tower fit-out package", sub: "Prime Developer FZ", owner: "Damien M.", due: "in 2 days", days: 2, overdue: false, href: "/crm/leads/lead-001" },
    { id: "lead-003", title: "Govt office refurbishment", sub: "Capital Contracting", owner: "Eddie D.", due: "in 5 days", days: 5, overdue: false, href: "/crm/leads/lead-003" },
    { id: "lead-005", title: "School fit-out — Sharjah", sub: "Emirates Build", owner: "Eddie D.", due: "in 9 days", days: 9, overdue: false, href: "/crm/leads/lead-005" },
  ],
  tasks: [
    { id: "a-002", title: "Issue revised proposal for Business Bay", sub: "Tier-1 Main Contractor LLC", owner: "Damien M.", due: "Tomorrow", days: 1, overdue: false, href: "/crm/opportunities/opp-001" },
    { id: "la-2", title: "Prepare budget pricing for 14 floors", sub: "Prime Developer FZ", owner: "Damien M.", due: "in 2 days", days: 2, overdue: false, href: "/crm/leads/lead-001" },
    { id: "a-005", title: "Follow up on Downtown tower shortlist", sub: "Prime Developer FZ", owner: "Damien M.", due: "in 2 days", days: 2, overdue: false, href: "/crm/companies/prime-dev" },
  ],
};

// ---- CRM forecast vs capacity (production: GET /api/v1/crm/dashboard/forecast) ----
// Projected revenue from weighted pipeline by month, against delivery capacity.
// The strategic "can we resource what we win" view.
// ---- CRM forecast vs capacity (production: GET /api/v1/crm/dashboard/forecast) ----
// Projected revenue from weighted pipeline by month, against delivery capacity.
export type ForecastMonth = { label: string; projected: number; capacity: number; gap: number };
export const crmForecast: { capacityPerMonth: number; months: ForecastMonth[] } = {
  capacityPerMonth: 3_500_000,
  months: [
    { label: "Jul 2026", projected: 2_100_000, capacity: 3_500_000, gap: -1_400_000 },
    { label: "Aug 2026", projected: 3_200_000, capacity: 3_500_000, gap: -300_000 },
    { label: "Sep 2026", projected: 4_300_000, capacity: 3_500_000, gap: 800_000 },
    { label: "Oct 2026", projected: 4_800_000, capacity: 3_500_000, gap: 1_300_000 },
    { label: "Nov 2026", projected: 2_900_000, capacity: 3_500_000, gap: -600_000 },
    { label: "Dec 2026", projected: 1_600_000, capacity: 3_500_000, gap: -1_900_000 },
  ],
};

// ---- CRM estimator workload & turnaround (production: GET /api/v1/crm/dashboard/estimators) ----
// Who's pricing what, how loaded they are, and whose bids win — so the
// estimating queue (the bottleneck for a bid-heavy contractor) can be balanced.
export type Estimator = {
  id: string; name: string; role: string;
  liveBids: number; liveValue: number; weighted: number;
  wonCount: number; lostCount: number; winRatePct: number;
  // capacity and avgTurnaroundDays were shown as measurements but were a
  // hardcoded 6 and a hardcoded 0 on the API side. They return when there is
  // something real behind them — a recorded bid start and submission date.
  capacity?: number; avgTurnaroundDays?: number;
};
export const estimators: Estimator[] = [
  { id: "est-1", name: "Aoife Byrne", role: "Senior Estimator", liveBids: 6, liveValue: 7_800_000, weighted: 3_300_000, capacity: 6, wonCount: 9, lostCount: 5, winRatePct: 64, avgTurnaroundDays: 5.1 },
  { id: "est-2", name: "Liam Doyle", role: "Senior Estimator", liveBids: 5, liveValue: 6_200_000, weighted: 2_700_000, capacity: 6, wonCount: 11, lostCount: 4, winRatePct: 73, avgTurnaroundDays: 4.2 },
  { id: "est-3", name: "Mark Stephens", role: "Estimator", liveBids: 3, liveValue: 2_900_000, weighted: 1_200_000, capacity: 5, wonCount: 5, lostCount: 4, winRatePct: 56, avgTurnaroundDays: 6.0 },
  { id: "est-4", name: "Priya Nair", role: "Estimator", liveBids: 2, liveValue: 1_800_000, weighted: 820_000, capacity: 5, wonCount: 6, lostCount: 2, winRatePct: 75, avgTurnaroundDays: 3.8 },
];

// Load tier from how full an estimator's bid slate is.
// Load is only meaningful once a capacity has been set for the estimator.
// Without one there is nothing to be a percentage of, so the badge says so
// rather than quietly reporting "Available" at 0%.
export function estimatorLoad(e: { liveBids: number; capacity?: number }): { label: string; tone: string; pct: number } {
  if (!e.capacity) return { label: "No capacity set", tone: "border border-line-strong text-charcoal-muted", pct: 0 };
  const pct = Math.round((e.liveBids / e.capacity) * 100);
  if (pct >= 100) return { label: "At capacity", tone: "bg-emerald text-white", pct };
  if (pct >= 80) return { label: "Busy", tone: "bg-emerald/15 text-emerald", pct };
  return { label: "Available", tone: "border border-emerald text-emerald", pct };
}

// ---- CRM bid calendar (production: derived from opportunity close dates + lead follow-ups) ----
// Submission deadlines and key dates so nothing slips. Anchored to the current
// month so the calendar is always populated.
const _calNow = new Date();
const _calDom = (d: number) =>
  new Date(_calNow.getFullYear(), _calNow.getMonth(), Math.min(d, new Date(_calNow.getFullYear(), _calNow.getMonth() + 1, 0).getDate())).toISOString();
export type CalendarEvent = { date: string; title: string; type: "bid" | "follow-up" | "task"; company: string; value?: number; href: string };
export const crmCalendar: { events: CalendarEvent[] } = {
  events: [
    { date: _calDom(3), title: "Sharjah Uni Block C — tender", type: "bid", company: "Emirates Build", value: 1_180_000, href: "/crm/opportunities/opp-005" },
    { date: _calDom(9), title: "Business Bay Office — revised proposal", type: "bid", company: "Tier-1 Main Contractor LLC", value: 1_850_000, href: "/crm/opportunities/opp-001" },
    { date: _calDom(9), title: "Downtown tower — budget pricing", type: "follow-up", company: "Prime Developer FZ", href: "/crm/leads/lead-001" },
    { date: _calDom(15), title: "JBR Residences — bid submission", type: "bid", company: "Coastline Contracting", value: 2_640_000, href: "/crm/opportunities/opp-004" },
    { date: _calDom(18), title: "School Sharjah — clarifications", type: "task", company: "Emirates Build", href: "/crm/opportunities/opp-003" },
    { date: _calDom(23), title: "Marina retail — re-bid decision", type: "bid", company: "Coastline Contracting", value: 1_600_000, href: "/crm/companies/coastline" },
    { date: _calDom(27), title: "Quarterly review — Prime Developer", type: "follow-up", company: "Prime Developer FZ", href: "/crm/companies/prime-dev" },
  ],
};

// ---- CRM account intelligence / client scorecards (production: GET /api/v1/crm/dashboard/accounts) ----
// Ranks clients by how well you win with them AND the value at stake — the
// account-based view that tells you where to invest relationship effort.
export type ClientScore = {
  id: string; name: string; type: string;
  wonCount: number; lostCount: number; winRatePct: number;
  wonValue: number; openCount: number; openWeighted: number; score: number;
};
export const clientScorecards: ClientScore[] = companies
  .map((c) => {
    const opps = opportunitiesList.filter((o) => o.companyId === c.id);
    const won = opps.filter((o) => o.status === "WON");
    const lost = opps.filter((o) => o.status === "LOST");
    const open = opps.filter((o) => o.status === "OPEN");
    const closed = won.length + lost.length;
    const wonValue = won.reduce((s, o) => s + o.value, 0);
    const openWeighted = open.reduce((s, o) => s + o.value * (o.prob / 100), 0);
    return {
      id: c.id, name: c.name, type: c.type,
      wonCount: won.length, lostCount: lost.length,
      winRatePct: closed ? Math.round((won.length / closed) * 100) : 0,
      wonValue, openCount: open.length, openWeighted,
      score: Math.round((closed ? won.length / closed : 0) * (wonValue + openWeighted)),
    };
  })
  .sort((a, b) => b.score - a.score);

// Focus tier from a client's score (shared by mock + live so they read the same).
export function accountFocus(s: { score: number; wonCount: number; lostCount: number }): { label: string; tone: string } {
  if (s.wonCount + s.lostCount === 0) return { label: "New account", tone: "bg-sage/30 text-emerald-dark" };
  if (s.score >= 1_500_000) return { label: "Key account", tone: "bg-emerald text-white" };
  if (s.score >= 500_000) return { label: "Grow", tone: "bg-emerald-soft text-emerald" };
  return { label: "Reassess", tone: "bg-charcoal/10 text-charcoal" };
}

// ---- Estimating mock data (production: GET /api/v1/estimating/*) ----
export const estimatesList = [
  { ref: "EST-0001", title: "Business Bay Office Fit-Out — drywall, ceilings & paint", status: "Draft", tender: "EDM-T-0007", lines: 5, value: 172_361.6 },
  { ref: "EST-0002", title: "DIFC Retail Refurbishment — drywall & joinery", status: "In review", tender: "EDM-T-0006", lines: 8, value: 318_400 },
  { ref: "EST-0003", title: "Sharjah University Block C — partitions & ceilings", status: "Issued", tender: "EDM-T-0004", lines: 12, value: 612_900 },
];

export const estStatusTone: Record<string, string> = {
  Draft: "bg-bone text-charcoal-muted", "In review": "bg-sage/30 text-emerald-dark", Issued: "bg-emerald text-white", Approved: "bg-emerald-soft text-emerald",
};

// One fully-priced estimate (matches the pricing engine output exactly).
export const estimateSheet = {
  ref: "EST-0001", title: "Business Bay Office Fit-Out — drywall, ceilings & paint", currency: "AED", status: "Draft",
  lines: [
    { desc: "Metal stud partitions to open-plan + offices", trade: "Drywall", unit: "m²", qty: 640, rate: 63.5, total: 40_640 },
    { desc: "Shaftwall to risers", trade: "Drywall", unit: "m²", qty: 120, rate: 94, total: 11_280 },
    { desc: "Suspended MF ceilings, skim finish", trade: "Ceilings", unit: "m²", qty: 980, rate: 52, total: 50_960 },
    { desc: "Decoration to walls & ceilings", trade: "Painting", unit: "m²", qty: 2600, rate: 11.5, total: 29_900 },
    { desc: "Access equipment hire", trade: "Technical", unit: "item", qty: 1, rate: 8_500, total: 8_500 },
  ],
  categories: { labour: 64_440, material: 65_180, plant: 3_160, subcontract: 8_500 },
  byTrade: { Drywall: 51_920, Ceilings: 50_960, Painting: 29_900, Technical: 8_500 },
  directCost: 141_280, overhead: 11_302.4, contingency: 2_825.6, profit: 16_953.6, sellPrice: 172_361.6, marginPct: 18.03,
  markups: { overheadPct: 8, contingencyPct: 2, profitPct: 12 },
};

// ---- Site reporting mock data (production: GET /api/v1/site/*) ----
export const siteProject = { code: "EDM-P-0001", name: "Sheikh Zayed Road HQ Fit-Out", emirate: "Dubai" };
export const siteWeek = { manHours: 285, peakHeadcount: 14, deliveries: 5, delays: 1 };
export const weeklyLabour = [
  { trade: "Drywall", hours: 180, headcountDays: 34 },
  { trade: "Ceilings", hours: 81, headcountDays: 14 },
  { trade: "Painting", hours: 24, headcountDays: 3 },
];
export const dailyReports = [
  { date: "Thu 12 Jun", weather: "Hot, hazy · 42°C", headcount: 14, hours: 123, deliveries: 1, delay: "Material hoist down 2 hrs" },
  { date: "Wed 11 Jun", weather: "Clear · 39°C", headcount: 12, hours: 108, deliveries: 2, delay: null },
  { date: "Tue 10 Jun", weather: "Clear · 40°C", headcount: 11, hours: 99, deliveries: 1, delay: null },
  { date: "Mon 9 Jun", weather: "Windy · 37°C", headcount: 9, hours: 78, deliveries: 1, delay: null },
];
export const latestReport = {
  date: "Thursday 12 June 2026", weather: "Hot, hazy · 42°C",
  labour: [ { trade: "Drywall", headcount: 6, hours: 54 }, { trade: "Ceilings", headcount: 5, hours: 45 }, { trade: "Painting", headcount: 3, hours: 24 } ],
  plant: [ { item: "Scissor lift", qty: 2, hours: 12 }, { item: "Material hoist", qty: 1, hours: 6 } ],
  deliveries: [ { material: "Emulsion paint (white)", qty: 40, unit: "pails" } ],
  delays: "Material hoist down 2 hrs (maintenance).",
};

// ---- Variations mock data (production: GET /api/v1/variations*) ----
export const variationSummary = { pendingValue: 92_500, approvedValue: 42_000, totalRaised: 144_300, count: 4 };
export const variationsList = [
  { ref: "VO-003", title: "Feature timber slat wall to reception", project: "Sheikh Zayed Road HQ", value: 64_000, submitted: "3 days ago", status: "Under review" },
  { ref: "VO-002", title: "Upgraded acoustic ceiling to boardroom", project: "Sheikh Zayed Road HQ", value: 28_500, submitted: "5 days ago", status: "Submitted" },
  { ref: "VO-001", title: "Additional partitions to meeting suite", project: "Sheikh Zayed Road HQ", value: 42_000, submitted: "20 days ago", status: "Approved" },
  { ref: "VO-004", title: "Revised paint specification (client request)", project: "Sheikh Zayed Road HQ", value: 9_800, submitted: "—", status: "Draft" },
];
export const variationTone: Record<string, string> = {
  Draft: "bg-bone text-charcoal-muted", Submitted: "bg-sage/30 text-emerald-dark", "Under review": "bg-emerald-soft text-emerald",
  Approved: "bg-emerald text-white", Rejected: "bg-bronze/15 text-bronze", Paid: "bg-emerald-soft text-emerald",
};

// ---- RFI mock data (production: GET /api/v1/rfis*) ----
export const rfiSummary = { open: 2, overdue: 1, answered: 1, closed: 1, total: 4 };
export const rfisList = [
  { ref: "RFI-001", subject: "Ceiling height at reception soffit", project: "Sheikh Zayed Road HQ", due: "2 days ago", status: "Open", overdue: true },
  { ref: "RFI-002", subject: "Partition fire rating to electrical riser", project: "Sheikh Zayed Road HQ", due: "in 4 days", status: "Open", overdue: false },
  { ref: "RFI-003", subject: "Paint sheen to boardroom feature wall", project: "Sheikh Zayed Road HQ", due: "Answered 3 days ago", status: "Answered", overdue: false },
  { ref: "RFI-004", subject: "Door frame detail at glazed partition", project: "Sheikh Zayed Road HQ", due: "Closed", status: "Closed", overdue: false },
];
export const rfiTone: Record<string, string> = {
  Open: "bg-emerald-soft text-emerald", Answered: "bg-sage/30 text-emerald-dark", Closed: "bg-bone text-charcoal-muted",
};

// ---- Quality mock data (production: GET /api/v1/quality/*) ----
export const qualitySummary = { openSnags: 3, ncrsOpen: 1, passRate: 75, critical: 1 };
export const snagsList = [
  { ref: "SNG-001", description: "Service penetration to riser not fully sealed", location: "Level 3, grid C/4", trade: "Drywall", status: "Open" },
  { ref: "SNG-002", description: "Ceiling tile edge damaged", location: "Level 2 open-plan", trade: "Ceilings", status: "In progress" },
  { ref: "SNG-004", description: "Skirting gap at reception desk", location: "Reception", trade: "Joinery", status: "Ready for inspection" },
];
export const ncrsList = [
  { ref: "NCR-001", title: "Incorrect board type to fire-rated partition", severity: "High", status: "Corrective action" },
];
export const snagTone: Record<string, string> = {
  Open: "bg-emerald-soft text-emerald", "In progress": "bg-sage/30 text-emerald-dark", "Ready for inspection": "bg-bone text-charcoal-muted", Closed: "bg-line text-charcoal-muted",
};
export const severityTone: Record<string, string> = {
  Low: "bg-bone text-charcoal-muted", Medium: "bg-sage/30 text-emerald-dark", High: "bg-bronze/15 text-bronze", Critical: "bg-bronze text-white",
};

// ---- HSE mock data (production: GET /api/v1/hse/*) ----
export const hseSummary = { lostTime: 0, nearMiss: 1, toolboxTalks: 2, riskAssessments: 1 };
export const incidentsList = [
  { ref: "INC-001", type: "Near miss", severity: "Medium", description: "Operative nearly struck by material lowered from level 3", date: "6 days ago" },
];
export const toolboxList = [
  { topic: "Working at height — scissor lift safety", date: "5 days ago", attendees: 14 },
  { topic: "Manual handling — plasterboard", date: "2 days ago", attendees: 11 },
];
export const riskList = [
  { ref: "RA-001", activity: "Suspended ceiling installation from scissor lifts", residual: "Medium" },
];
export const incidentTypeTone: Record<string, string> = {
  "Near miss": "bg-sage/30 text-emerald-dark", "First aid": "bg-emerald-soft text-emerald", "Lost time": "bg-bronze text-white", "Property damage": "bg-bronze/15 text-bronze", Environmental: "bg-bronze/15 text-bronze",
};

// ---- Procurement mock data (production: GET /api/v1/procurement/*) ----
export const procurementSummary = { openPOs: 2, committedSpend: 31_125, awaitingDelivery: 16_175, suppliers: 2 };
export const posList = [
  { poNo: "PO-0001", supplier: "Gulf Drywall Supplies", project: "EDM-P-0001", lines: 2, value: 22_425, status: "Partially received", expected: "in 2 days" },
  { poNo: "PO-0002", supplier: "Emirates Paint Co", project: "EDM-P-0001", lines: 1, value: 8_700, status: "Issued", expected: "in 5 days" },
];
export const suppliersList = [
  { name: "Gulf Drywall Supplies", trade: "Drywall", rating: 4, pos: 1 },
  { name: "Emirates Paint Co", trade: "Painting", rating: 5, pos: 1 },
];
export const poStatusTone: Record<string, string> = {
  Draft: "bg-bone text-charcoal-muted", Issued: "bg-emerald-soft text-emerald", "Partially received": "bg-sage/30 text-emerald-dark", Received: "bg-emerald text-white", Cancelled: "bg-line text-charcoal-muted",
};

// ---- Documents mock data (production: GET /api/v1/documents*) ----
export const docSummary = { total: 4, forReview: 1, approved: 2, draft: 1 };
export const docsList = [
  { title: "L3 Partition Layout", category: "Drawing", rev: "C", status: "For review", revisions: 3 },
  { title: "Main Subcontract Agreement", category: "Contract", rev: "A", status: "Approved", revisions: 1 },
  { title: "Drywall Specification 09 21 16", category: "Spec", rev: "A", status: "Approved", revisions: 1 },
  { title: "Ceiling Tile Submittal", category: "Submittal", rev: "A", status: "Draft", revisions: 1 },
];
export const revisionHistory = [
  { rev: "C", note: "Client comments incorporated", date: "2 days ago", current: true },
  { rev: "B", note: "Coordination updates", date: "8 days ago", current: false },
  { rev: "A", note: "Initial issue", date: "15 days ago", current: false },
];
export const docStatusTone: Record<string, string> = {
  Draft: "bg-bone text-charcoal-muted", "For review": "bg-sage/30 text-emerald-dark", Approved: "bg-emerald text-white", Superseded: "bg-bronze/15 text-bronze", Archived: "bg-line text-charcoal-muted",
};
export const categoryTone: Record<string, string> = {
  Drawing: "bg-emerald-soft text-emerald", Contract: "bg-sage/30 text-emerald-dark", Spec: "bg-bone text-charcoal-muted", Submittal: "bg-bone text-charcoal-muted",
};

// ---- Trade progress mock data (production: GET /api/v1/trades/*) ----
export const tradeKpis = { tradesTracked: 3, totalInstalled: 3110, avgCompletion: 72, records: 4 };
export const tradeCards = [
  { trade: "Drywall", installed: 580, target: 760, unit: "m²", pct: 76, attrs: ["12.5mm + Fireline", "60–120 min FR", "Stud + shaftwall"] },
  { trade: "Ceilings", installed: 690, target: 980, unit: "m²", pct: 70, attrs: ["MF concealed grid", "Plasterboard skim"] },
  { trade: "Painting", installed: 1840, target: 2600, unit: "m²", pct: 71, attrs: ["2 coats", "Emulsion matt", "Finish stage"] },
];
export const tradeLog = [
  { trade: "Drywall", area: "Level 3", qty: "420 m²", detail: "12.5mm · 60 min FR · stud", date: "Today" },
  { trade: "Drywall", area: "Risers", qty: "160 m²", detail: "2×15mm Fireline · 120 min FR · shaftwall", date: "Yesterday" },
  { trade: "Ceilings", area: "Levels 2–3", qty: "690 m²", detail: "MF concealed · plasterboard skim", date: "2 days ago" },
  { trade: "Painting", area: "Level 2", qty: "1,840 m²", detail: "Emulsion matt · 2 coats · finish", date: "2 days ago" },
];

// ---- Financials mock data (production: GET /api/v1/finance/reconciliation) ----
export const finVal = { contract: 1_850_000, variations: 42_000, forecast: 1_892_000 };
export const finCost = { budget: 1_480_000, committed: 1_210_000, actual: 715_000 };
export const finMargin = { forecast: 412_000, pct: 21.8 };
export const finCash = { certified: 780_000, paid: 399_000, outstanding: 342_000, retention: 39_000, pending: 266_000 };
export const cvrRows = [
  { code: "CC-100", desc: "Drywall & ceilings", budget: 620_000, committed: 540_000, actual: 360_000, variance: 80_000 },
  { code: "CC-200", desc: "Joinery", budget: 280_000, committed: 210_000, actual: 90_000, variance: 70_000 },
  { code: "CC-300", desc: "Painting & finishes", budget: 180_000, committed: 120_000, actual: 95_000, variance: 60_000 },
  { code: "CC-400", desc: "Glazing & aluminium", budget: 240_000, committed: 180_000, actual: 60_000, variance: 60_000 },
  { code: "CC-500", desc: "Prelims & management", budget: 160_000, committed: 160_000, actual: 110_000, variance: 0 },
];
export const cvrTotals = { budget: 1_480_000, committed: 1_210_000, actual: 715_000, variance: 270_000 };

// ---- Document control: register, revisions & transmittals ----
// Controlled drawings/documents with revision history and formal transmittals to
// consultants and main contractors — the document-control core a subcontractor
// is judged on. (Production: a Documents module with file storage + versioning.)
export type DocRevision = { rev: string; status: string; date: string; by: string; note: string; current?: boolean };
export type ConstructionDoc = {
  id: string; number: string; title: string; discipline: string;
  currentRev: string; status: string; updated: string; by: string; revisions: DocRevision[];
};
export type Transmittal = {
  id: string; number: string; to: string; purpose: string; status: string; date: string;
  docs: { number: string; title: string; rev: string }[];
};

export const documentsRegister: ConstructionDoc[] = [
  { id: "doc-001", number: "EDM-DW-DR-001", title: "Level 3 Partition Layout", discipline: "Drywall/Partition", currentRev: "C", status: "For Construction", updated: "14 Jun 2026", by: "L. Doyle", revisions: [
    { rev: "A", status: "For Review", date: "02 May 2026", by: "L. Doyle", note: "First issue for consultant review" },
    { rev: "B", status: "Approved w/ comments", date: "21 May 2026", by: "L. Doyle", note: "Incorporated consultant comments on door pockets" },
    { rev: "C", status: "For Construction", date: "14 Jun 2026", by: "L. Doyle", note: "Issued for construction", current: true },
  ] },
  { id: "doc-002", number: "EDM-DW-DR-002", title: "Level 4 Partition Layout", discipline: "Drywall/Partition", currentRev: "B", status: "For Review", updated: "18 Jun 2026", by: "A. Byrne", revisions: [
    { rev: "A", status: "Superseded", date: "20 May 2026", by: "A. Byrne", note: "First issue" },
    { rev: "B", status: "For Review", date: "18 Jun 2026", by: "A. Byrne", note: "Revised core wall setout, with consultant for approval", current: true },
  ] },
  { id: "doc-003", number: "EDM-CL-DR-010", title: "Level 3 Ceiling RCP", discipline: "Ceilings", currentRev: "B", status: "Approved", updated: "10 Jun 2026", by: "M. Stephens", revisions: [
    { rev: "A", status: "Superseded", date: "28 Apr 2026", by: "M. Stephens", note: "First issue" },
    { rev: "B", status: "Approved", date: "10 Jun 2026", by: "M. Stephens", note: "Approved — coordinated with MEP", current: true },
  ] },
  { id: "doc-004", number: "EDM-DW-DT-101", title: "Partition Head Detail (1hr FR)", discipline: "Drywall/Partition", currentRev: "A", status: "For Construction", updated: "14 Jun 2026", by: "L. Doyle", revisions: [
    { rev: "A", status: "For Construction", date: "14 Jun 2026", by: "L. Doyle", note: "Issued for construction with L3 layout", current: true },
  ] },
  { id: "doc-005", number: "EDM-CL-DT-110", title: "Bulkhead Detail — Reception", discipline: "Ceilings", currentRev: "A", status: "For Review", updated: "17 Jun 2026", by: "M. Stephens", revisions: [
    { rev: "A", status: "For Review", date: "17 Jun 2026", by: "M. Stephens", note: "First issue for consultant review", current: true },
  ] },
  { id: "doc-006", number: "EDM-FS-DR-201", title: "Fire-rated Shaft Wall Layout", discipline: "Fire", currentRev: "B", status: "Approved", updated: "09 Jun 2026", by: "A. Byrne", revisions: [
    { rev: "A", status: "Returned", date: "26 May 2026", by: "A. Byrne", note: "Returned — clarify head restraint at slab" },
    { rev: "B", status: "Approved", date: "09 Jun 2026", by: "A. Byrne", note: "Head restraint detail added; approved", current: true },
  ] },
  { id: "doc-007", number: "EDM-MS-001", title: "Method Statement — Drywall Installation", discipline: "Method/QA", currentRev: "2", status: "Approved", updated: "05 Jun 2026", by: "K. Buchanan", revisions: [
    { rev: "1", status: "Superseded", date: "12 Apr 2026", by: "K. Buchanan", note: "First issue" },
    { rev: "2", status: "Approved", date: "05 Jun 2026", by: "K. Buchanan", note: "Updated for revised acoustic build-up", current: true },
  ] },
  { id: "doc-008", number: "EDM-DW-DR-003", title: "Level 5 Partition Layout", discipline: "Drywall/Partition", currentRev: "A", status: "Draft", updated: "19 Jun 2026", by: "A. Byrne", revisions: [
    { rev: "A", status: "Draft", date: "19 Jun 2026", by: "A. Byrne", note: "Work in progress — not yet issued", current: true },
  ] },
];

export const transmittals: Transmittal[] = [
  { id: "tr-012", number: "EDM-T-0012", to: "Tier-1 Main Contractor LLC", purpose: "For Construction", status: "Issued", date: "14 Jun 2026", docs: [
    { number: "EDM-DW-DR-001", title: "Level 3 Partition Layout", rev: "C" },
    { number: "EDM-DW-DT-101", title: "Partition Head Detail (1hr FR)", rev: "A" },
  ] },
  { id: "tr-011", number: "EDM-T-0011", to: "Design Consultants", purpose: "For Approval", status: "Returned", date: "11 Jun 2026", docs: [
    { number: "EDM-DW-DR-002", title: "Level 4 Partition Layout", rev: "B" },
    { number: "EDM-CL-DT-110", title: "Bulkhead Detail — Reception", rev: "A" },
  ] },
  { id: "tr-010", number: "EDM-T-0010", to: "Prime Developer FZ", purpose: "For Information", status: "Acknowledged", date: "10 Jun 2026", docs: [
    { number: "EDM-CL-DR-010", title: "Level 3 Ceiling RCP", rev: "B" },
  ] },
  { id: "tr-009", number: "EDM-T-0009", to: "Design Consultants", purpose: "For Approval", status: "Approved w/ comments", date: "09 Jun 2026", docs: [
    { number: "EDM-FS-DR-201", title: "Fire-rated Shaft Wall Layout", rev: "B" },
  ] },
];

// ---- Labour / operations core (production: GET /api/v1/labour/*) ----
export type Operative = { id: string; code: string; name: string; trade: string; grade: string; dayRate: number; status: string };
export const workforce: Operative[] = [
  { id: "w1", code: "EDM-001", name: "Rashid Khan", trade: "Drywall", grade: "Charge hand", dayRate: 520, status: "Active" },
  { id: "w2", code: "EDM-002", name: "Imran Ali", trade: "Drywall", grade: "Operative", dayRate: 420, status: "Active" },
  { id: "w3", code: "EDM-003", name: "Bilal Hussain", trade: "Drywall", grade: "Operative", dayRate: 420, status: "Active" },
  { id: "w4", code: "EDM-004", name: "Kamal Das", trade: "Drywall", grade: "Apprentice", dayRate: 300, status: "Active" },
  { id: "w5", code: "EDM-005", name: "Suresh Nair", trade: "Ceilings", grade: "Charge hand", dayRate: 500, status: "Active" },
  { id: "w6", code: "EDM-006", name: "Anil Kumar", trade: "Ceilings", grade: "Operative", dayRate: 410, status: "Active" },
  { id: "w7", code: "EDM-007", name: "Mohammed Saleh", trade: "Joinery", grade: "Charge hand", dayRate: 540, status: "Active" },
  { id: "w8", code: "EDM-008", name: "Tariq Aziz", trade: "Joinery", grade: "Operative", dayRate: 430, status: "Active" },
  { id: "w9", code: "EDM-009", name: "Vikram Singh", trade: "Glazing", grade: "Operative", dayRate: 440, status: "Active" },
  { id: "w10", code: "EDM-010", name: "Pavel Novak", trade: "Glazing", grade: "Operative", dayRate: 460, status: "Active" },
  { id: "w11", code: "EDM-011", name: "Arjun Patel", trade: "Partitions", grade: "Operative", dayRate: 410, status: "Active" },
  { id: "w12", code: "EDM-012", name: "Hamza Sheikh", trade: "Partitions", grade: "Operative", dayRate: 410, status: "On leave" },
];

export type LabourAllocationRow = { id: string; projectCode: string; project: string; trade: string; planned: number; zone: string; supervisor: string; period: string };
export const labourAllocations: LabourAllocationRow[] = [
  { id: "a1", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ Fit-Out", trade: "Drywall", planned: 4, zone: "Level 3", supervisor: "Rashid Khan", period: "This week" },
  { id: "a2", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ Fit-Out", trade: "Ceilings", planned: 2, zone: "Level 3", supervisor: "Suresh Nair", period: "This week" },
  { id: "a3", projectCode: "EDM-P-0002", project: "Marina Tower Lobby Refurb", trade: "Partitions", planned: 2, zone: "Ground floor", supervisor: "Arjun Patel", period: "This week" },
  { id: "a4", projectCode: "EDM-P-0002", project: "Marina Tower Lobby Refurb", trade: "Glazing", planned: 2, zone: "Ground floor", supervisor: "Vikram Singh", period: "This week" },
  { id: "a5", projectCode: "EDM-P-0003", project: "Yas Mall Unit 214 Fit-Out", trade: "Joinery", planned: 2, zone: "Unit 214", supervisor: "Mohammed Saleh", period: "This week" },
];

export type AttendanceEntry = { workerId: string; name: string; trade: string; status: "PRESENT" | "ABSENT" | "SICK" | "LEAVE"; hours: number; dayRate: number };
export type ProjectAttendance = { projectCode: string; project: string; entries: AttendanceEntry[]; plannedByTrade: { trade: string; planned: number }[] };
export const attendanceToday: ProjectAttendance[] = [
  {
    projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ Fit-Out",
    plannedByTrade: [{ trade: "Drywall", planned: 4 }, { trade: "Ceilings", planned: 2 }],
    entries: [
      { workerId: "w1", name: "Rashid Khan", trade: "Drywall", status: "PRESENT", hours: 9, dayRate: 520 },
      { workerId: "w2", name: "Imran Ali", trade: "Drywall", status: "PRESENT", hours: 9, dayRate: 420 },
      { workerId: "w3", name: "Bilal Hussain", trade: "Drywall", status: "PRESENT", hours: 11, dayRate: 420 },
      { workerId: "w4", name: "Kamal Das", trade: "Drywall", status: "ABSENT", hours: 0, dayRate: 300 },
      { workerId: "w5", name: "Suresh Nair", trade: "Ceilings", status: "PRESENT", hours: 9, dayRate: 500 },
      { workerId: "w6", name: "Anil Kumar", trade: "Ceilings", status: "PRESENT", hours: 9, dayRate: 410 },
    ],
  },
  {
    projectCode: "EDM-P-0002", project: "Marina Tower Lobby Refurb",
    plannedByTrade: [{ trade: "Partitions", planned: 2 }, { trade: "Glazing", planned: 2 }],
    entries: [
      { workerId: "w11", name: "Arjun Patel", trade: "Partitions", status: "PRESENT", hours: 9, dayRate: 410 },
      { workerId: "w12", name: "Hamza Sheikh", trade: "Partitions", status: "LEAVE", hours: 0, dayRate: 410 },
      { workerId: "w9", name: "Vikram Singh", trade: "Glazing", status: "PRESENT", hours: 9, dayRate: 440 },
      { workerId: "w10", name: "Pavel Novak", trade: "Glazing", status: "PRESENT", hours: 8, dayRate: 460 },
    ],
  },
  {
    projectCode: "EDM-P-0003", project: "Yas Mall Unit 214 Fit-Out",
    plannedByTrade: [{ trade: "Joinery", planned: 2 }],
    entries: [
      { workerId: "w7", name: "Mohammed Saleh", trade: "Joinery", status: "PRESENT", hours: 9, dayRate: 540 },
      { workerId: "w8", name: "Tariq Aziz", trade: "Joinery", status: "PRESENT", hours: 9, dayRate: 430 },
    ],
  },
];

export type TradeProductivity = { trade: string; unit: string; installed: number; manHours: number; targetPerManDay: number };
export const labourProductivity: TradeProductivity[] = [
  { trade: "Drywall", unit: "m²", installed: 320, manHours: 142, targetPerManDay: 30 },
  { trade: "Ceilings", unit: "m²", installed: 168, manHours: 88, targetPerManDay: 22 },
  { trade: "Partitions", unit: "m²", installed: 198, manHours: 96, targetPerManDay: 24 },
  { trade: "Glazing", unit: "panels", installed: 54, manHours: 72, targetPerManDay: 8 },
  { trade: "Joinery", unit: "units", installed: 38, manHours: 96, targetPerManDay: 4.5 },
];

export const tradeTone: Record<string, string> = {
  Drywall: "bg-emerald-soft text-emerald",
  Ceilings: "bg-sage/30 text-emerald-dark",
  Joinery: "bg-amber-100 text-amber-800",
  Glazing: "bg-emerald text-white",
  Partitions: "bg-line text-charcoal-muted",
};

// ---- Timesheets: a week of attendance per operative (production: GET /api/v1/labour/timesheets) ----
export type TimesheetRow = {
  workerId: string; name: string; trade: string; projectCode: string; project: string;
  dayRate: number; chargeRate: number; // chargeRate = man-hour charge-out to the main contractor
  days: { date: string; status: "PRESENT" | "ABSENT" | "SICK" | "LEAVE"; hours: number }[];
};
const WK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const wk = (h: (number | string)[]) =>
  WK.map((d, i) => {
    const v = h[i];
    return typeof v === "string" ? { date: d, status: v as any, hours: 0 } : { date: d, status: "PRESENT" as const, hours: v };
  });

export const weeklyTimesheets: TimesheetRow[] = [
  { workerId: "w1", name: "Rashid Khan", trade: "Drywall", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ", dayRate: 520, chargeRate: 92, days: wk([9, 9, 11, 9, 9, 5]) },
  { workerId: "w2", name: "Imran Ali", trade: "Drywall", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ", dayRate: 420, chargeRate: 74, days: wk([9, 9, 9, 9, 9, "ABSENT"]) },
  { workerId: "w3", name: "Bilal Hussain", trade: "Drywall", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ", dayRate: 420, chargeRate: 74, days: wk([9, 11, 11, 9, 9, 9]) },
  { workerId: "w5", name: "Suresh Nair", trade: "Ceilings", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ", dayRate: 500, chargeRate: 88, days: wk([9, 9, 9, 9, 9, "ABSENT"]) },
  { workerId: "w6", name: "Anil Kumar", trade: "Ceilings", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ", dayRate: 410, chargeRate: 72, days: wk([9, 9, 9, "SICK", 9, 9]) },
  { workerId: "w11", name: "Arjun Patel", trade: "Partitions", projectCode: "EDM-P-0002", project: "Marina Tower Lobby", dayRate: 410, chargeRate: 72, days: wk([9, 9, 9, 9, 9, "ABSENT"]) },
  { workerId: "w9", name: "Vikram Singh", trade: "Glazing", projectCode: "EDM-P-0002", project: "Marina Tower Lobby", dayRate: 440, chargeRate: 80, days: wk([9, 9, 9, 9, 11, "ABSENT"]) },
  { workerId: "w7", name: "Mohammed Saleh", trade: "Joinery", projectCode: "EDM-P-0003", project: "Yas Mall Unit 214", dayRate: 540, chargeRate: 96, days: wk([9, 9, 9, 9, 9, 9]) },
  { workerId: "w8", name: "Tariq Aziz", trade: "Joinery", projectCode: "EDM-P-0003", project: "Yas Mall Unit 214", dayRate: 430, chargeRate: 76, days: wk([9, 9, 9, 9, 9, 9]) },
];

export const timesheetWeekLabel = "Week 26 · 22–27 Jun 2026";

// ---- Supervisor daily reports (full) (production: GET /api/v1/site/daily-reports) ----
export type SiteEventRow = { type: "DELAY" | "INSTRUCTION" | "DISRUPTION"; description: string; cause: string; hoursLost: number; chargeable: boolean };
export type SiteReportFull = {
  id: string; projectCode: string; project: string; date: string; dateLong: string;
  supervisor: string; weather: string; status: "Draft" | "Submitted";
  labour: { trade: string; headcount: number; hours: number }[];
  attendancePresent: number; // recorded attendance, for reconciliation
  progress: string;
  quantities: { trade: string; qty: number; unit: string }[];
  deliveries: { material: string; qty: number; unit: string }[];
  plant: { item: string; qty: number; hours: number }[];
  events: SiteEventRow[];
  safety: string;
};

export const siteReports: SiteReportFull[] = [
  {
    id: "DR-0142", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ Fit-Out", date: "Thu 26 Jun", dateLong: "Thursday 26 June 2026",
    supervisor: "Rashid Khan", weather: "Hot, hazy · 42°C", status: "Submitted",
    labour: [{ trade: "Drywall", headcount: 3, hours: 29 }, { trade: "Ceilings", headcount: 2, hours: 18 }],
    attendancePresent: 5,
    progress: "Boarded and taped L3 grid lines 4–9 (east). Started ceiling perimeter angle L3. Set out partitions to grid 10.",
    quantities: [{ trade: "Drywall", qty: 64, unit: "m²" }, { trade: "Ceilings", qty: 28, unit: "m²" }],
    deliveries: [{ material: "Gypsum board 12.5mm", qty: 120, unit: "boards" }, { material: "MF ceiling sections", qty: 60, unit: "lengths" }],
    plant: [{ item: "Scissor lift", qty: 2, hours: 16 }],
    events: [
      { type: "DELAY", description: "Material hoist down 2 hrs (MC plant breakdown)", cause: "Main contractor plant", hoursLost: 2, chargeable: true },
      { type: "INSTRUCTION", description: "Consultant instruction to add bulkhead at L3 reception (verbal, confirmed by email)", cause: "Consultant", hoursLost: 0, chargeable: true },
    ],
    safety: "Toolbox talk on working-at-height. No incidents.",
  },
  {
    id: "DR-0141", projectCode: "EDM-P-0001", project: "Sheikh Zayed Road HQ Fit-Out", date: "Wed 25 Jun", dateLong: "Wednesday 25 June 2026",
    supervisor: "Rashid Khan", weather: "Clear · 40°C", status: "Submitted",
    labour: [{ trade: "Drywall", headcount: 4, hours: 38 }, { trade: "Ceilings", headcount: 2, hours: 18 }],
    attendancePresent: 6,
    progress: "Completed L3 west partitions to underside of slab. Insulation to grid 4–9. Ceiling grid layout L3 east.",
    quantities: [{ trade: "Drywall", qty: 78, unit: "m²" }],
    deliveries: [{ material: "Acoustic insulation", qty: 40, unit: "rolls" }],
    plant: [{ item: "Scissor lift", qty: 2, hours: 16 }],
    events: [],
    safety: "No incidents.",
  },
  {
    id: "DR-0140", projectCode: "EDM-P-0002", project: "Marina Tower Lobby Refurb", date: "Wed 25 Jun", dateLong: "Wednesday 25 June 2026",
    supervisor: "Arjun Patel", weather: "Clear · 39°C", status: "Submitted",
    labour: [{ trade: "Partitions", headcount: 2, hours: 18 }, { trade: "Glazing", headcount: 2, hours: 17 }],
    attendancePresent: 3,
    progress: "Lobby feature wall framing complete. Glazing frames set out to entrance.",
    quantities: [{ trade: "Partitions", qty: 34, unit: "m²" }],
    deliveries: [],
    plant: [{ item: "Podium steps", qty: 3, hours: 0 }],
    events: [
      { type: "DISRUPTION", description: "Out-of-sequence access — MC had not cleared lobby floor finishes", cause: "Main contractor sequencing", hoursLost: 1.5, chargeable: false },
    ],
    safety: "No incidents.",
  },
  {
    id: "DR-0139", projectCode: "EDM-P-0003", project: "Yas Mall Unit 214 Fit-Out", date: "Tue 24 Jun", dateLong: "Tuesday 24 June 2026",
    supervisor: "Mohammed Saleh", weather: "Clear · 41°C", status: "Draft",
    labour: [{ trade: "Joinery", headcount: 2, hours: 18 }],
    attendancePresent: 2,
    progress: "",
    quantities: [{ trade: "Joinery", qty: 6, unit: "units" }],
    deliveries: [{ material: "Veneered MDF panels", qty: 18, unit: "sheets" }],
    plant: [],
    events: [],
    safety: "No incidents.",
  },
];

export const siteEventTone: Record<string, string> = {
  DELAY: "bg-bronze/15 text-bronze",
  DISRUPTION: "bg-amber-100 text-amber-800",
  INSTRUCTION: "bg-emerald-soft text-emerald",
};
export const reportById = (id: string) => siteReports.find((r) => r.id === id);

// ---- Labour charge-out rate card (production: GET /api/v1/labour/rates) ----
export type LabourRate = { trade: string; grade: string; chargeRate: number; unit: string };
export const labourRateCard: LabourRate[] = [
  { trade: "Drywall", grade: "Charge hand", chargeRate: 95, unit: "hour" },
  { trade: "Drywall", grade: "Operative", chargeRate: 74, unit: "hour" },
  { trade: "Drywall", grade: "Apprentice", chargeRate: 52, unit: "hour" },
  { trade: "Ceilings", grade: "Charge hand", chargeRate: 92, unit: "hour" },
  { trade: "Ceilings", grade: "Operative", chargeRate: 72, unit: "hour" },
  { trade: "Ceilings", grade: "Apprentice", chargeRate: 50, unit: "hour" },
  { trade: "Joinery", grade: "Charge hand", chargeRate: 98, unit: "hour" },
  { trade: "Joinery", grade: "Operative", chargeRate: 76, unit: "hour" },
  { trade: "Joinery", grade: "Apprentice", chargeRate: 54, unit: "hour" },
  { trade: "Glazing", grade: "Charge hand", chargeRate: 90, unit: "hour" },
  { trade: "Glazing", grade: "Operative", chargeRate: 80, unit: "hour" },
  { trade: "Glazing", grade: "Apprentice", chargeRate: 52, unit: "hour" },
  { trade: "Partitions", grade: "Charge hand", chargeRate: 88, unit: "hour" },
  { trade: "Partitions", grade: "Operative", chargeRate: 72, unit: "hour" },
  { trade: "Partitions", grade: "Apprentice", chargeRate: 50, unit: "hour" },
];
// Look up the charge-out rate for a worker's trade + grade (0 if no rate set).
export const chargeRateFor = (trade: string, grade: string): number =>
  labourRateCard.find((r) => r.trade === trade && r.grade === grade)?.chargeRate ?? 0;
export const gradeForWorker = (workerId: string): string =>
  workforce.find((w) => w.id === workerId)?.grade ?? "Operative";
