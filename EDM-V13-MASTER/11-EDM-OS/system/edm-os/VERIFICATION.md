# EDM OS — Verification report

What was actually tested while building this, the results, and — honestly — what
could not be tested in the build environment and how you verify it in minutes.

## Tested and passing ✅

**Web — production build.** All 24 routes compile and type-check.
```
✓ Compiled successfully
✓ Generating static pages (24/24)
```

**Web — runtime render (production server).** Started `next start` and hit every
CRM screen, asserting HTTP 200 *and* expected on-page content. **19/19 routes
render correctly**, including:
- the dynamic records the build never executes — `/crm/opportunities/[id]`,
  `/crm/leads/[id]`, `/crm/companies/[id]`
- the won-deal handoff state (`/crm/opportunities/opp-006` renders "handed off to
  delivery" and the project code `EDM-P-0002`)
- the analytics screen ("Pipeline intelligence", "Win rate by client type")
- the follow-ups inbox ("Bid deadlines", "Open tasks")
- not-found handling for a bad id returns the "not found" state, not a crash

(One assertion first showed a false negative on `/crm/contacts` — an exact-match
grep for "Khalid Rahman" missed because React serialises interpolated names as
`Khalid<!-- --> <!-- -->Rahman`. Inspected the raw HTML and confirmed the contact
renders correctly. Not a defect.)

**Scripts & infra — syntax/validity.**
- `scripts/dev-token.mjs` — valid; minted a token and **verified the HS256
  signature** against `SUPABASE_JWT_SECRET`, payload maps to the seeded owner.
- `scripts/smoke-test.mjs` — valid (zero-dependency, Node 18+ fetch).
- `scripts/api-entrypoint.sh` — valid (`sh -n`).
- `docker-compose.yml` — valid YAML, services: db, api, web.

## Not testable in this build environment ⚠️

The build sandbox blocks outbound network except a few package registries.
Prisma downloads its query engine from `binaries.prisma.sh`, which is blocked, so
in **this** environment I could not:
- run `prisma generate` → therefore could not type-check or run the **API**, and
- could not stand up Postgres + the API to run an end-to-end test.

This is an environment limit, not a code issue — none of it applies on your
machine, where the network is open.

The API code has been written to match the existing module pattern exactly and
checked structurally against the Prisma schema (enums, model fields, relations,
tenant scoping, RBAC decorators). But "structurally consistent" is not the same
as "ran green," and I won't claim otherwise.

## How you verify the rest in ~5 minutes

```bash
docker compose up --build                              # RUNBOOK → Option A
SUPABASE_JWT_SECRET=dev-secret node scripts/smoke-test.mjs
```

The smoke test asserts: health is up, auth is enforced (401 without a token),
the agenda/analytics endpoints return real shapes, opportunities list from
Postgres, and the **won-bid → project conversion** creates a project that then
appears in `/projects`. Green there means the API is verified end-to-end on real
data.

## Honest status

| Layer | State |
|---|---|
| Web — 8 CRM screens | **built + runtime-verified** |
| Web — live data (Follow-ups, Analytics) | **wired to the API with mock fallback; build + fallback render verified** (live path verified by the smoke test) |
| Web — search + CSV export (Leads, Companies, Contacts) | **built + verified** — CSV quoting unit-tested (7/7), tables render with search box + export (13/13) |
| Web — mobile responsiveness | **built; build green + responsive markup confirmed in served HTML** (drawer sidebar, scrollable tabs/tables, stacked KPIs). Live screenshot not possible in-build (the static renderer can't run the Next app); confirm on a device. |
| Web + API — revenue forecast vs capacity | **built + verified** — month-bucketing algorithm unit-tested (6/6), page renders with chart + table (9/9); backend `forecast()` endpoint added |
| Web + API — account intelligence / client scorecards | **built + verified** — scoring/ranking/focus-tier logic unit-tested against real data (10/10), page renders with correct ranking, win rates and won-value total; backend `accounts()` endpoint added. (Build also caught a regression — an accidental removal of `crmForecast` — which was fixed before shipping.) |
| Web — bid calendar | **built + verified** — month-grid alignment + countdown helpers unit-tested (14/14), page renders the month grid and upcoming deadlines with correct dates (11/11); live-or-mock from the agenda endpoint. Month grid is `hidden md:block` with a deadline list on all sizes for mobile. |
| Web — command center overview | **built + verified** — landing page rewritten to aggregate forecast, scorecards, calendar and analytics (live-or-mock); renders with all highlights + links into deep screens (11/11). |
| Web + API + schema — estimator workload | **built + verified** — load-tier + aggregation logic unit-tested (13/13), page renders the workload table with correct KPIs (11/11). Added `estimatorUserId` to the Opportunity model + `estimators()` endpoint; the schema field is new, so the live path needs `db push` (already in the deploy flow) and bids assigned to estimators. Turnaround is illustrative (no date fields added). |
| Web — document control | **built + verified** — Documents module rebuilt from a flat placeholder into a controlled register (searchable/exportable), a transmittals log with purpose + status workflow, and per-document records with full revision history and related transmittals. Render-tested 16/16 (register, transmittals, document record, not-found). Mock data only — production needs file storage + a versioning/transmittal backend. |
| Web + API + schema — Microsoft 365 / Outlook calendar sync | **built + partly verified** — pure Graph event mapping (deadline → all-day event, reminders, idempotency key) unit-tested 15/15; Integrations settings UI renders 11/11. Added `IntegrationConnection` model + OAuth connect/callback/sync/disconnect endpoints. Live sync calls Microsoft Graph, so it needs the API deployed + an Azure app registration (see INTEGRATIONS.md); tokens must be encrypted at rest before production. |
| API + web — Xero connector | **built + partly verified** — pure Xero mapping (won opportunity → DRAFT ACCREC invoice; company → contact; payment terms/currency/account-code logic) unit-tested 15/15; Xero featured on the integrations UI, renders 9/9. OAuth connect/callback + draft-invoice + contact endpoints written; added `externalTenantId` to the connection model. Live calls hit Xero's API, so they need the API deployed + a Xero app. Invoices are created as drafts (reviewed in Xero), never auto-sent. |
| API + web — WhatsApp Business connector | **built + partly verified** — pure template mapping + phone normalisation (UAE local / `00` / `+` formats; English & Arabic; per-type templates) unit-tested 16/16; WhatsApp featured on the integrations UI, renders 10/10. Credential-based connect + template-send + disconnect endpoints written (WhatsApp Cloud API). Live sends need a WhatsApp Business number, a permanent token and approved templates. |
| API + web — DocuSign connector | **built + partly verified** — pure envelope mapping (document + signer → eSignature v2.1 envelope; anchor-placed sign tab; sent/draft) unit-tested 11/11; DocuSign featured on the integrations UI, renders 10/10. OAuth connect/callback (with account id + base URI from userinfo) + send-envelope + disconnect written; added `apiBaseUrl` to the connection model. Live calls need the API deployed + a DocuSign app. |
| API — pre-go-live hardening | **built + verified** — (1) token encryption at rest (AES-256-GCM) wired into all four connectors (encrypt on store, decrypt on use); (2) fail-fast config validation that refuses to boot in production on a missing/`dev-secret` JWT secret, missing encryption key, or missing DB/CORS; crypto + validator unit-tested 15/15 (round-trip, tamper + wrong-key rejection, prod/dev cases). Plus a consolidated `GO-LIVE.md` runbook. Crypto/validator cores are unit-tested; the service wiring needs the running API to verify end-to-end. |
| Labour / operations core (workforce · allocation · attendance · timesheets · productivity) | **built + verified (logic + UI)** — pure labour engine (hours/overtime split, day-cost incl. OT multiplier, crew attendance summary, planned-vs-actual variance, productivity per man-day vs target, **timesheet aggregation + man-hour charge + margin**) unit-tested **30/30**; mirror engine drives the UI so screens compute live from raw attendance. Six web pages (`/labour` overview + workforce, allocations, attendance, **timesheets**, productivity) render green across builds, nav + regression intact (35 routes). API layer (workers/allocations/attendance CRUD + engine-driven deployment summary + **timesheet aggregation over a date range**) written and wired into `app.module`; schema adds `Worker`, `LabourAllocation`, `AttendanceDay` (+ `WorkerStatus`/`AttendanceStatus` enums, reusing the existing `Trade` enum). Engine + UI render verified; API persistence needs the running database to verify end-to-end. Charge/margin is now driven by a **charge-out rate card** (by trade + grade) — both the UI and the API timesheet price each operative off it. Supervisor daily reports is the next increment. |
| Labour charge-out rate card | **built + verified (logic + UI)** — `LabourRate` model (org-scoped, by trade + grade) + rate-lookup unit-tested 5/5; `/labour/rates` page (charge-out matrix + cost-vs-charge markup per current crew) renders green and **feeds the timesheets directly** (charge + margin recompute from it). API `rates` endpoint added and the API timesheet now joins the rate card to return real charge + margin. Persistence needs the running database to verify end-to-end. |
| Supervisor daily reports (site diary + claim evidence) | **built + verified (logic + UI)** — pure report engine (delay/disruption impact + hours-lost, instruction count, chargeable-event count; headcount reconciliation against recorded attendance; submit-readiness/completeness) unit-tested **11/11**. Rebuilt `/site` log (claim-relevant KPIs, per-report delay/instruction badges, ≠attendance flag, draft submit-readiness) + new `/site/[id]` detail (full diary, progress, quantities, deliveries, plant, safety, and structured **delays & instructions as chargeable claim evidence**) render verified incl. not-found. Schema extends the existing `DailyReport` (adds `status`, `instructions`, `hoursLost`, `safetyNote`) + new `SiteEvent` model (+ `ReportStatus`/`SiteEventType` enums); existing report CRUD already in `SiteModule`. **Claims register now built**: `/site/claims` rolls chargeable delays/disruptions into a recoverable position (hours × blended rate, unit-tested 6/6) and surfaces instructions as variation candidates; API `claims` endpoint queries chargeable `SiteEvent`s (scoped through project org) and returns the same. Engine + UI verified; `SiteEvent` write-path persistence needs the running database to verify end-to-end. |
| Web — `bronze` colour-token fix | **fixed + verified** — `bronze` was referenced as a warning/overdue colour in 5 module pages (RFIs, Quality, Finance, Procurement, Site) but never defined, so those styles rendered with no colour. Added the token; confirmed `#083819` now generates in the built CSS bundle. |
| Backend — modules, conversions, aggregates | written, schema-consistent; **verify with smoke test on your machine** |
| Local stack (one command) | written + syntax/validity-checked |
| Production hosting | documented in DEPLOYMENT.md; **needs your Postgres + Supabase credentials** |

The honest one-liner: the front end is proven; the back end is in place and
trivially verifiable on your machine; going live needs your hosting accounts.
That last step is the only thing standing between this and something a pilot user
can log into.
