# EDM V13 — INDEPENDENT TECHNICAL AUDIT

**Run 22 August 2026 against `EDM-V13-MASTER` (602 files, verified byte-identical to the
supplied archive before testing began).**

This is a test report. Every finding below was reproduced by running something — a
compiler, a build, a browser-standards check, a PDF parser — not by reading a document
and forming an opinion. Where a number appears, the command that produced it is quoted
so it can be re-run.

Three self-assessments already existed in the pack: `QA-REPORT.md`, `CHANGES-FROM-V11.md`
and `11-EDM-OS/EDM-OS-TECH-AUDIT.md`. This audit verifies their claims rather than
repeating them. Several hold up. Two do not, and one of those matters a great deal.

---

## THE VERDICT IN ONE PAGE

**The brand system, the website and the four client-facing documents are in good order.**
Better than most. The palette is disciplined, the four documents are correctly built with
Montserrat embedded and their stated page counts are true, no link on the site is broken,
no client name has leaked into a public page, and body-text contrast passes accessibility
standards comfortably. That is a real achievement and it should be said plainly.

**Three things are seriously wrong, and none of them were known.**

**1. EDM OS does not run.** Not "is not connected to the front end" — it does not start.
The API crashes on boot with a `TypeError` before it serves a single request. Twelve files
import a function called `PartialType` from a package that does not export it, and the
package that does export it is not installed. The previous audit could not test this
because it could not generate the database client in its sandbox, and concluded the 161
errors it saw were an artefact of that. They were not. With the client generated, the
compiler still reports **43 errors and the process dies on startup.** This is the single
most important correction in this report.

**2. The documents you would actually send to a client are the withdrawn ones.**
The four files in `13-Go-To-Market/Tender-Editions/` are byte-identical to the superseded
copies in `_ARCHIVE-superseded/`. They are the old V11 layout, and they still contain
every claim the board removed: the £21m turnover figure, the "100% safety record", "four
markets", and eight named clients — five of whom (JLL, Gilbert-Ash, Graham, John Sisk &
Son, McLaughlin & Harvey) are not recorded anywhere as having been asked for consent. The
folder's own warning note says the public editions "carry the same content with the client
and project generalised". They do not. The public editions are 19 and 17 pages; these are
7 and 8.

**3. Six tools your teams are told to use on live jobs save nothing.** Measure, Evidence,
Progress, Daybook, Cashflow and Board hold everything in memory. No autosave, no browser
storage, no warning when you navigate away. The Daybook README positions it as a phone app
kept in the site cabin, logging the verbal instructions the QS turns into paid variations.
Mobile browsers discard background tabs routinely. A day's evidence can vanish to a phone
call.

**Nothing in the pack is at risk of being publicly non-compliant today.** The live website
and the live documents are clean on client names. The exposure is in what happens next:
the moment someone opens the tender folder, or the moment EDM OS is handed to a developer
who is told it is "source-complete".

---

## SEVERITY SUMMARY

| # | Finding | Area | Severity |
|---|---|---|---|
| O1 | API does not compile or boot — 43 errors, `TypeError` on startup | EDM OS | **Critical** |
| D1 | Tender editions are the withdrawn V11 documents with every removed claim intact | Documents | **Critical** |
| O2 | Token identity matched on email; missing membership defaults to ADMINISTRATOR | EDM OS | **Critical** |
| T1 | Six site tools have no autosave, no storage, no unsaved-changes guard | Tools | **High** |
| O4 | Shipped container sets `NODE_ENV=development`, disabling every boot-time security check | EDM OS | **High** |
| O6 | CRM attaches records across organisations without checking ownership | EDM OS | **High** |
| D2 | Distribution warning materially misdescribes what the tender editions contain | Documents | **High** |
| O10 | CRM screens silently render demo data when the API fails or returns nothing | EDM OS | **High** |
| W5 | Four-markets claim on all 20 pages and in a page title (Decision 3) | Website | **High** |
| O5 | Three tables have a `projectId` with no relation — no referential integrity | EDM OS | **High** |
| T2 | Chatbot cannot work on the live site; the relay built for it is not wired in | Tools | **High** |
| O3 | CORS reflects any origin with credentials when `CORS_ORIGIN` is unset | EDM OS | Medium |
| T4 | Chatbot prompt asserts "trading since 1986" and "works internationally" | Tools | Medium |
| O8 | Project codes generated from a row count — collides, and breaks after a deletion | EDM OS | Medium |
| O9 | Fabricated figures on management screens (AED 3.5m capacity, 0-day turnaround) | EDM OS | Medium |
| D3 | PQQ pack states "Markets: UAE · Ireland · UK · Australia" (Decision 3) | Documents | Medium |
| D4 | `build.sh` checks 5 of 22 banned words, and never fails on a bad result | Documents | Medium |
| O7 | Updating an opportunity silently discards `leadId` | EDM OS | Medium |
| W1 | Montserrat Medium 500 and an italic face shipped and used — outside the system | Website | Medium |
| O11 | 9-hour day and 1.25× overtime hardcoded; file claims to be unit-tested, no tests exist | EDM OS | Medium |
| T3 | Chat relay has no origin check and no rate limit — an open door to a paid API | Tools | Medium |
| O12 | 25 dependency vulnerabilities, 1 critical (was 11 in August) | EDM OS | Medium |
| W9 | Cards are white on white, separated only by a 1.26:1 border | Website | Low |
| W2–W4 | Dead colour tokens, a hover state identical to its resting state, a "tint" that is white | Website | Low |
| W6 | `lang="en"` on all 20 pages in a UK-English estate | Website | Low |
| W7 | Ten meta descriptions over 160 characters; one title over 60 | Website | Low |
| D5 | Second font family (DejaVu) in the Training Manual and Go-Live Guide | Documents | Low |
| P1–P3 | Changelog claims fixes the V12→V13 diff does not contain; README says "V12 is current" | Pack | Low |

---

## WHAT WAS VERIFIED AND FOUND SOUND

Said first, because an audit that only lists faults is not an honest picture.

- **All 602 files** extract byte-identical to the archive. No corruption.
- **No broken internal link or missing asset** across all 20 site pages — every `href`,
  `src`, stylesheet and font resolved against the tree.
- **`sitemap.xml` and the page set agree exactly** — 19 entries, 19 indexable pages.
- **No third-party scripts, trackers or external asset hosts** anywhere on the site. Only
  `wa.me` and the site's own domain. That is a genuinely good privacy posture.
- **All JSON-LD parses**, and `foundingDate` is absent from all 20 pages — Decision 4 was
  applied and held.
- **No client name appears in any public page or any live document.** Hard Rule 2 holds
  where it counts.
- **The four documents verify exactly as claimed**: capability statement 19 pages,
  brochure 17, handover standard 1, brand guidelines 7 — Montserrat only, every font
  embedded, no second family. `QA-REPORT.md` Defects 1 and 2 are genuinely fixed.
- **The four unembedded-Helvetica PDFs** are correctly quarantined in
  `_ARCHIVE-superseded/unembedded-font-originals/`. Known issue 4 is resolved for live files.
- **Body text (`#5C6F66` on white) passes WCAG AA at 5.36:1**; emerald passes at 13.21:1.
- **The web application builds clean** — Next 14 production build, 37 static pages, exit 0.
- **EDM OS architecture is genuinely well judged.** Global guards via `APP_GUARD`, a global
  `ValidationPipe` with `whitelist: true`, AES-256-GCM with a random IV and auth tag for
  OAuth tokens at rest, a 51-model schema that understands construction. The previous
  audit's praise here is deserved.

---

## 1. EDM OS — THE CRM AND PLATFORM

### O1 — The API does not compile, and does not start · CRITICAL

The previous audit could not run `prisma generate` (its sandbox returned 403) and
therefore never proved the API compiles. It said so honestly and made it task one. It also
predicted the errors would disappear once the client existed. That prediction was wrong.

`prisma generate` succeeds here:

```
✔ Generated Prisma Client (v5.22.0) in 917ms
```

With the client generated, the compiler reports 43 errors:

```
$ npx tsc --noEmit -p apps/api/tsconfig.json     → exit 2, 43 errors
     24  TS2339   Property does not exist on type
     12  TS2724   '@nestjs/common' has no exported member named 'PartialType'
      3  TS2345 · 2 TS2561 · 2 TS2322
```

Twelve DTO files contain `import { PartialType } from "@nestjs/common"`. That export does
not exist — `PartialType` lives in `@nestjs/mapped-types`, which is not a dependency of
this project. Proven at runtime:

```
$ node -e "const c=require('@nestjs/common'); console.log(typeof c.PartialType)"
@nestjs/common version: 10.4.22
typeof PartialType: undefined
```

Because each file does `class UpdateTenderDto extends PartialType(CreateTenderDto)`, the
failure happens at module load, not at first use. Booting the compiled output:

```
$ node dist/main.js
TypeError: (0 , common_1.PartialType) is not a function
    at Object.<anonymous> (dist/tenders/dto/update-tender.dto.js:6:56)
```

**The process exits before Nest initialises.** No endpoint has ever served a request.

The cascade explains the rest: with `PartialType` broken, every `UpdateXDto` loses its
inherited fields, so the 24 "property does not exist" errors follow. Adding the missing
package and repointing the twelve imports drops the count from **43 to 9** — measured, in
a scratch copy, not asserted.

### O1b — The nine errors that remain are real

Not artefacts. Each is a genuine defect:

- `quality/snags/snags.service.ts:19,25` — filters on `project: { organisationId }`, but
  the `Snag` model has no `project` relation (see O5). **The tenant boundary for snags is
  written against a relation that does not exist.**
- `finance/finance.service.ts:44,46,48` — `certifiedStatuses` is inferred too narrowly for
  `.includes(i.status)`. Cost–value reconciliation does not compile.
- `crm/activities`, `estimating/estimates`, `projects`, `tenders` — optional foreign keys
  passed into Prisma create/update inputs that reject `string | undefined`.

### O2 — Authentication can be bypassed, and unassigned users become administrators · CRITICAL

`apps/api/src/auth/jwt.strategy.ts`:

```ts
const user = await this.prisma.user.findFirst({
  where: { OR: [{ supabaseId: payload.sub }, { email: payload.email ?? "" }] },
  include: { memberships: true },
});
...
role: membership?.role ?? "ADMINISTRATOR",
```

Three separate faults in five lines:

1. **Identity is matched on the email claim as an alternative to the subject id.** Anyone
   holding a validly signed token whose `email` claim matches an EDM user's address
   authenticates as that user, regardless of who they actually are.
2. **`payload.email ?? ""` searches for the empty string** when a token carries no email.
   If any user row ever has an empty email, every token without an email claim
   authenticates as that user.
3. **`membership?.role ?? "ADMINISTRATOR"` fails open.** A user with no membership row
   receives full administrator rights. The safe default is no role at all.

Separately, `organisationId` is taken from `user.organisationId` while `role` is taken from
`memberships[0]` — an arbitrary row. For a user in more than one organisation, the role
applied can come from a different organisation than the data being scoped to.

### O3 — CORS reflects any origin, with credentials · MEDIUM

`apps/api/src/main.ts`:

```ts
app.enableCors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true });
```

With `CORS_ORIGIN` unset, `origin: true` reflects **whatever origin asks**, and
`credentials: true` allows cookies with it. Any website a signed-in user visits can call
the API as them.

### O4 — The container ships with the security net switched off · HIGH

`apps/api/src/common/env-validation.ts` opens with:

```ts
if (!opts.production) return errors;
```

Every check — required database URL, a real JWT secret, a valid encryption key, a
non-wildcard CORS origin — runs only when `NODE_ENV === "production"`.

`apps/api/Dockerfile:20` sets `ENV NODE_ENV=development`. `docker-compose.yml` sets it
twice more, and defaults the JWT secret to `dev-secret` — the exact value the validator
exists to reject. And `jwt.strategy.ts:13` falls back to the literal string `"dev-secret"`
when the variable is absent.

To be fair: the Dockerfile is honestly labelled "development container" and
`DEPLOYMENT.md` describes production separately. The problem is that **there is no
production container.** The only deployable artefact in the repository is the one that
disables the guard rail, and the guard rail is disabled by the very setting a hurried
deployment is least likely to change.

### O5 — Three tables have a project link with no referential integrity · HIGH

`Snag`, `LabourAllocation` and `AttendanceDay` each declare `projectId String` with **no
corresponding relation field**. Prisma therefore creates no foreign key constraint.

Consequences: a project can be deleted leaving orphaned snags, labour allocations and
attendance days; nothing at the database level prevents a `projectId` pointing at another
organisation's project; and tenant scoping cannot traverse the link — which is exactly
what breaks `snags.service.ts` in O1b.

`Lead.ownerUserId` and `Incident.reportedById` are dangling in the same way.

### O6 — Records are attached across organisations without an ownership check · HIGH

`crm/leads/leads.service.ts:51`, `crm/opportunities/opportunities.service.ts:35–36, 93`,
`documents/documents.service.ts` all do this:

```ts
company: companyId ? { connect: { id: companyId } } : undefined,
```

`companyId` arrives in the request body and **is never checked against the caller's
organisation.** A user in organisation A can attach their lead to organisation B's
company. Because `list()` then includes `company: { select: { id: true, name: true } }`,
the other organisation's client name is returned in the response. The same applies to
`leadId`, `managerUserId`, `tenderId`, `variationId` and `rfiId`.

The codebase already knows the right pattern — `assertProjectInOrg()` exists in
`snags.service.ts` and `documents.service.ts` and is applied to `projectId`. It simply was
not applied to any of the other relation ids.

### O7 — Updating an opportunity silently discards `leadId` · MEDIUM

`opportunities.service.ts:43–46` destructures `leadId` out of the payload and then never
reconnects it — only `company` is rebuilt. The API accepts the field, validates it, and
throws it away. The caller receives a success response and the change does not happen.

### O8 — Project codes are generated from a row count · MEDIUM

```ts
const count = await this.prisma.project.count({ where: { organisationId: orgId } });
const code = dto.code ?? `EDM-P-${String(count + 1).padStart(4, "0")}`;
```

Two conversions at the same moment produce the same code, and `@@unique([organisationId,
code])` turns the second into an error the user cannot interpret. Worse, delete any
project and the counter goes backwards — every subsequent conversion collides with an
existing code until someone overrides it by hand.

### O9 — Fabricated numbers presented as management information · MEDIUM

- `crm/dashboard.service.ts:101` — `capacityPerMonth = 3_500_000`. The comment says
  "Capacity is configurable"; it is a function default that nothing in `OrgConfig` sets.
  An invented AED 3.5m figure renders on the forecast screen as though it were EDM's.
- `crm/dashboard.service.ts:179` — `avgTurnaroundDays: 0` is hardcoded. Every estimator
  shows a zero-day average turnaround. So is `capacity: Math.max(e.liveBids, 6)`.
- `crm/dashboard.service.ts:111–118` — forecast months are bucketed using **local**
  date parts against UTC timestamps. The same data produces a different forecast depending
  on the server's timezone. For a UTC+4 business this shifts month-end deals.

### O10 — Screens silently substitute demo data · HIGH

A correction to the previous audit: it reported "0 of 40 pages call the API". That is no
longer true — **seven CRM pages call it** through `apps/web/src/lib/server-data.ts`.

But every getter is written like this:

```ts
try   { ...call the API and map it... }
catch { return crmAgenda; }          // the demo fixture
```

and several also do `return rows.length ? rows : clientScorecards`.

So: API down, token missing, shape changed, query threw, **or a legitimately empty
result** — the screen renders convincing demo numbers with nothing to indicate they are
not real. A director cannot tell a live forecast from a fixture. For a board screen that
is worse than an error message.

### O11 — Labour rules hardcoded, and a false claim of test coverage · MEDIUM

`labour/labour.ts` opens: *"No I/O — every function is deterministic and unit-tested."*
There is not a single test file in the repository. The file computes pay.

`STANDARD_DAY_HOURS = 9` and `OT_MULTIPLIER = 1.25` are module constants. `OrgConfig`
exists precisely so that "how we work" is data rather than code, and has no field for
either. `attendanceSummary()` cannot be given a different standard day at all.

`attendanceSummary()` also counts SICK and LEAVE as `absent` — authorised leave and a
no-show land in the same bucket.

### O12 — Dependency vulnerabilities have grown · MEDIUM

```
$ npm audit → 25 total: 1 critical, 10 high, 11 moderate, 3 low
```

The August audit recorded 11. Critical: `next` (cache poisoning). High: `multer`,
`nanoid`, `postcss`, `glob` (command injection), `js-yaml`, `tmp` (path traversal),
`brace-expansion`, `picomatch`, `@nestjs/platform-express`, `@nestjs/cli`.

### O13 — OAuth `state` is the organisation id, and is never checked · MEDIUM

`integrations.service.ts:20` — `buildAuthUrl(msConfigFromEnv(), orgId)`. The `state`
parameter exists to prevent cross-site request forgery on the consent callback; it must be
unguessable and it must be validated on return. Here it is a predictable identifier, it is
leaked into the provider's URL and logs, and the callback handlers read only `code` — the
value is never checked. There is no CSRF protection on connecting Xero, DocuSign or
Microsoft 365.

### Still true from the previous audit

No sign-in exists (nothing sets the `edm_token` cookie). No migrations — `prisma/migrations/`
does not exist and the workflow is `db:push`. No tests. No CI. No `helmet`, no throttler.
API TypeScript is less strict than web TypeScript.

---

## 2. DOCUMENTS AND BRAND ASSETS

### D1 — The tender editions are the withdrawn documents · CRITICAL

All four files in `13-Go-To-Market/Tender-Editions/` hash-match superseded copies:

```
f30dc251af9fa5a3  EDM-Capability-Statement-NAMED-TENDER-ONLY.pdf
f30dc251af9fa5a3  EDM-Holdings-Capability-Statement-NAMED-was-live-on-site.pdf
f30dc251af9fa5a3  _ARCHIVE-superseded/edm-site-inline-styles/EDM-Holdings-Capability-Statement.pdf
```

The two pairs are also byte-identical duplicates of each other. Text extraction finds, in
the capability statement alone:

- `£21m+ average annual turnover (AED 90m+) · 11 schemes a year · 4 sectors` — **Decision 1**
- `100% safety record, held across every EDM site` — **Decision 2**
- `Four markets, one standard. UAE Ireland United Kingdom Australia` and `We operate across
  four markets` — **Decision 3**
- `1986 established` and `EST. 1986` as an entity claim — **Decision 4**
- `Khazna Data Centers`, `QAJ01`, `PMK Group` — **Hard Rule 2**, consent verbal only
- and, named as clients: `JLL · Gilbert-Ash · Graham · John Sisk & Son · McLaughlin &
  Harvey` — **five third parties with no consent record anywhere in the pack**, not listed
  in `consents/README.md`, not mentioned in the distribution warning

These are filed under a name that invites use, in the go-to-market folder, described as the
edition to send to a tender.

### D2 — The distribution warning is materially wrong · HIGH

`_DISTRIBUTION-WARNING.txt` is careful, honest in intent, and wrong on the fact that
matters:

> "The public editions live in 03-Corporate-Documents and in the website folder. **They
> carry the same content with the client and project generalised.**"

They do not. The public editions are 19 and 17 pages and carry none of the withdrawn
claims. These are 7 and 8 pages and carry all of them. Anyone reading that sentence would
reasonably conclude the only difference is client naming, and send the file.

It also says "the two documents in this folder". There are four.

### D3 — The PQQ pack still claims four markets · MEDIUM

`13-Go-To-Market/EDM-PQQ-Information-Pack.pdf`: `Markets UAE · Ireland · UK · Australia`.
Decision 3 says structured statements of where EDM operates are Dubai only. This is the
document that goes to a Tier-1 procurement team.

The same file's `£20.31m delivered across 11 schemes` is **correct** — Decision 1 places
the figure in the PQQ pack alongside the accounts. No change needed there.

### D4 — The regression check is weaker than it is described as · MEDIUM

`09-Document-Sources/build.sh` is the check `QA-REPORT.md` relies on. Reading it:

- **It checks 5 of the 22 banned words** — `sublet`, `sub-let`, `talk about your package`,
  `thrilled`, `four markets`. It does not check `robust`, `seamless`, `leverage`, `delve`,
  `elevate`, `world-class`, `premier`, `leading`, `reach out`, `circle back`, `unlock`,
  `testament`, `game-changer`, `proud to announce`, `delighted to share`, `excited to
  announce`, `top notch`, `gotcha`, `bro`, `in today's fast-paced`.
  Which is why **`robust` currently sits in both the live capability statement and the live
  corporate brochure** ("robust detailing built for wear") and nothing flagged it.
- **It checks one absolute** — `100%`. Not `guaranteed`, `always`, `zero defects`,
  `world-class`, `leading`, `premier`.
- **It never fails.** It prints counts. "Every count must be zero" is a convention a human
  must notice, not something the script enforces. It cannot be used in CI as written.
- **Its dependencies are undeclared.** `README.md` says `pip install weasyprint`. The
  script also needs `pdffonts` and `pdftotext` (poppler-utils). With `set -e` at line 8, a
  machine without poppler aborts at line 24 — *after* writing all four PDFs and *before*
  running a single compliance check, looking very much like a successful build.
- **It covers 4 of 49 PDFs.** Not the tender editions, not the PQQ pack, not the website.

### D5 — A second font family in two live documents · LOW

`QA-REPORT.md` states "No unembedded fonts anywhere in the pack" and "Montserrat only".
True for the four documents it checks. Across all 49:

- `20-Training/EDM-Training-Manual.pdf` — `DejaVu-Sans-Bold`
- `02-Website/Go-Live-Guide.pdf` — `DejaVu-Sans-Mono`, `DejaVu-Sans-Bold`
- `11-EDM-OS/.../EDM-OS-Technical-Blueprint.pdf` — `LiberationSans`, `DejaVuSansMono`, and
  a font with no `BaseFont` that is **not embedded**
- `11-EDM-OS/.../EDM-OS-Internal-First-Build-Plan.pdf` — same

This is the signature of a glyph missing from Montserrat falling back — exactly what
`build.sh` says a second family means. These files are outside its scope.

`Go-Live-Guide.pdf` also carries the `UAE · IRELAND · UK · AUSTRALIA` footer.

---

## 3. THE WEBSITE

### W5 — The four-markets claim survives on every page · HIGH

Decision 3 was applied to headlines, schema and body copy — and missed the two places that
appear most often.

**The footer**, on all 20 pages, twice each (three times on `contact.html`) — **41
occurrences site-wide**:

```html
<li style="color:rgba(255,255,255,.5)">UAE · Ireland · UK · Australia</li>
...<a href="privacy.html">Privacy</a> · UAE · Ireland · UK · Australia
```

**The page title** of `where-we-operate.html`:

```html
<title>Where We Operate — EDM Holdings | Dubai, London, Ireland &amp; Australia</title>
```

That is the browser tab, the Google result and the text of every shared link — while the
`<h1>` immediately below it reads "Delivery in the UAE." and the JSON-LD correctly says
`areaServed: United Arab Emirates`. The page contradicts itself in its own markup.

### W1 — Two typefaces outside the four-weight system · MEDIUM

`assets/edm-fonts.css` declares six faces, not four: Montserrat 300, 400, **500**, 600,
700 and a **400 italic**. `montserrat-500.woff2` and `montserrat-400i.woff2` are both
shipped, and `edm-base.css` uses the 500:

```css
.nav-links a{font-size:13px;font-weight:500;...}
```

`CLAUDE.md` is unambiguous: *"Four weights, and only four: Light 300, Regular 400, SemiBold
600, Bold 700. Medium 500 is not in the system."* Every navigation link on the site renders
in a weight the brand does not have.

Separately, headings render at 600 while the brand states headlines are Bold 700.

### W2–W4 — Dead and self-cancelling CSS · LOW

In `assets/edm-base.css`:

```css
--em:#083819; --em-deep:#083819; --em-canvas:#083819; --em-lit:#083819;   /* four names, one colour */
.btn.solid{background:var(--em)} .btn.solid:hover{background:#083819}      /* hover = resting */
.sec.tint{background:var(--white)}                                         /* a "tint" that is white */
```

The primary button on every page has no hover feedback. `--em-deep`, `--em-canvas` and
`--em-lit` are leftovers from a palette that no longer exists. `.sec.tint` is what remains
of the bone tint after it was removed — the class survives, meaning nothing.

`#0A4A21`, the undocumented hover green `CLAUDE.md` asks to be flagged, appears **twice**
in the CSS (not the 20 times the note records) plus twice in inline blocks. The note is
stale; the colour is still undocumented.

### W9 — Cards are white on white · LOW

`.card` has a white background on a white page, distinguished only by a `1px solid
#E4E6E0` border measuring **1.26:1** against the background. WCAG 2.2 requires 3:1 for
boundaries that carry meaning. For a low-vision visitor the card grid has no visible
structure.

`.foot-bottom` text measures **4.49:1** against `#0F231B` — failing 4.5:1 by a hair.
Everything else in the footer passes.

### W6–W8 — Standards and weight · LOW

- All 20 pages declare `lang="en"`. The estate is UK English throughout; `en-GB` is correct
  and affects screen-reader pronunciation and search targeting.
- Ten meta descriptions exceed 160 characters and will truncate. One title exceeds 60.
- Heading levels skip on four pages (`404`, `careers`, `contact`, `privacy`) — h1 to h4 in
  two cases.
- `where-we-operate.html` is **171 KB**, of which **143 KB is seven inline SVGs**.
  `capability-statement.html` is **126 KB**, of which **101 KB is a single base64 data
  URI**. Both are ten times every other page and neither asset can be cached separately.

### The contact forms work

Worth stating, because it reads alarming at first glance: `access_key: WEB3FORMS_KEY` is a
**variable reference**, not a placeholder. Both `contact.html` and
`capability-statement.html` assign the same real key. The forms are wired.

Two notes. The key is a live credential committed to a repository — the README's advice to
rotate it if the repository is public stands. And the "is it configured" test only detects
one specific placeholder prefix (`REPLACE_WITH`), so any other placeholder would attempt a
live POST and fail rather than falling back to email.

---

## 4. THE EIGHT STANDALONE TOOLS

Nothing in the pack had audited these. They are roughly 200 KB of application JavaScript
that staff are told to use on live projects.

### T1 — Six tools save nothing, anywhere · HIGH

Measured across all six:

```
                   beforeunload   autosave   localStorage
14-EDM-Measure          0            0            0
15-EDM-Evidence         0            0            0
16-EDM-Progress         0            0            0
17-EDM-Daybook          0            0            0
18-EDM-Cashflow         0            0            0
19-EDM-Board            0            0            0
```

Everything lives in memory until someone presses Save, which downloads a JSON file. There
is no autosave, no browser storage, and no warning when you close the tab.

Read that next to what the Daybook README asks people to do:

> "One page a day, kept on the site manager's phone, the day it happened… When anyone tells
> you to do something beyond the drawings — log it there and then… That entry is what the
> QS turns into a paid variation."

Mobile browsers discard background tabs to reclaim memory. A phone call, a notification, a
switch to WhatsApp to check a drawing — and an unsaved day of instructions is gone, with no
prompt and no recovery. The same risk applies to Cashflow, which holds the application and
certificate position, and Board, which the COO uses on a Monday.

This is the most consequential finding in the pack that costs the least to fix.

### T2 — The chatbot cannot work on the live site · HIGH

`21-Chatbot/edm-chatbot.html:93` calls `https://api.anthropic.com/v1/messages` directly
from the browser, with no authentication header. From a public website that request fails
— on CORS, and on the missing key. Every visitor would get the fallback line: *"We're
having a connection issue this end."*

`21-Chatbot/relay/relay.js` is the correct answer to this and already exists — it holds the
key server-side and exposes `POST /chat`. **The page does not point at it.** The two halves
of a working system are in the same folder, unconnected. Its own README says the page
"works as-is for testing" in the Claude app and needs a relay for the live site; the relay
was built and the wire was never run.

`START-HERE.md` nonetheless lists it as delivered: *"a working enquiry assistant"*.

### T3 — The relay is an open door to a paid API · MEDIUM

`relay.js` accepts `POST /chat` from anyone. No origin check, no authentication, no rate
limit, no CORS headers at all (so a browser on `edmholdings.ae` could not call it if it
were on another host, while a script anywhere can). Anyone who finds the URL can run
requests against EDM's Anthropic account until the budget is gone.

### T4 — The assistant is briefed to break two Hard Rules · MEDIUM

The system prompt — duplicated verbatim in both files, so it must be corrected twice —
tells the assistant that EDM is:

> "a specialist fit-out and drywall subcontractor to main contractors, **trading since
> 1986**"

Hard Rule 4 and Decision 4: 1986 attaches to the trade and the team, never to the entity.
And:

> "**The group also works internationally**, but you handle UAE enquiries"

Decision 3: never claim delivery capability outside the UAE. The bot is authorised to say
both to a prospect, in writing.

The prompt is otherwise excellent — the qualification ladder, the banned-word list, the
refusal to quote prices, and the honesty about being an assistant are all well judged.

---

## 5. THE PACK'S OWN RECORD

### P1 — The changelog describes work the diff does not contain · LOW

Comparing `EDM-V12-MASTER.zip` against `EDM-V13-MASTER` file by file: **3 removed, 4 added,
19 changed, 579 unchanged.** The three removals and three of the additions are the
`_V12-*` renames. The real addition is `EDM-OS-TECH-AUDIT.md`.

Against that, `CHANGELOG.txt` claims for V13:

- *"BUG FIXED: the capability statement download form carried a placeholder Web3Forms key…
  Now wired."* — `capability-statement.html` is **not in the changed list**, and extracting
  the V12 archive shows the same real key already present. Nothing was fixed in V13.
- *"Repository scaffolding: README.md, .gitignore, .gitattributes, and the consents/ folder"*
  — all four already existed in V12.

The entry reads as a release note written from intention rather than from the diff.

### P2 — `README.md` says the wrong version is current · LOW

Its own reading table: *"`CHANGELOG.txt` | Version log. **V12 is current.**"* — in a pack
whose header says V13.

### P3 — The consent register is short by five names · LOW

`consents/README.md` tracks Khazna Data Centers, QAJ01 and PMK Group. The tender editions
also name JLL, Gilbert-Ash, Graham, John Sisk & Son and McLaughlin & Harvey as clients.
Whatever the status of those relationships, they are not recorded, not consented and not
flagged.

### P4 — The repository `CLAUDE.md` has drifted from the pack's · LOW

The pack's `CLAUDE.md` correctly references `DECISIONS.md`. The copy at the repository
root — the one Claude Code reads at the start of every session — still points at
`_V12-DECISIONS.md`, in three places. Every future session starts from the stale file.

---

## ACTION PLAN

Ordered by what unblocks what. Each item is marked **[fix]** — an engineering change,
**[decide]** — something only the business can settle, or **[buy]** — time or money.

### Before anything is sent to a client

| | Action | Owner | Type |
|---|---|---|---|
| 1 | Remove the four superseded files from `13-Go-To-Market/Tender-Editions/`. Rebuild the named editions from the **current** sources, adding only the client naming. | Claude Code | **[fix]** |
| 2 | Correct `_DISTRIBUTION-WARNING.txt` — it currently tells the reader the opposite of the truth. | Claude Code | **[fix]** |
| 3 | Decide the position on JLL, Gilbert-Ash, Graham, John Sisk & Son and McLaughlin & Harvey. Five names are being used with no consent record. | Christopher | **[decide]** |
| 4 | Remove `Markets: UAE · Ireland · UK · Australia` from the PQQ pack. | Claude Code | **[fix]** |
| 5 | Chase written consent from PMK / Khazna. The 7 October LinkedIn date still stands. | Christopher | **[decide]** |

### Before the site is promoted

| | Action | Owner | Type |
|---|---|---|---|
| 6 | Remove the four-markets line from the global footer — 41 occurrences — and rewrite the `where-we-operate` page title. | Claude Code | **[fix]** |
| 7 | Drop Montserrat 500 and the italic face; move nav links to 600. | Claude Code | **[fix]** |
| 8 | `lang="en-GB"`, fix the four heading-order skips, trim the ten long meta descriptions. | Claude Code | **[fix]** |
| 9 | Darken the card border to meet 3:1 and nudge `.foot-bottom` to pass 4.5:1. | Claude Code | **[fix]** |
| 10 | Externalise the inline SVGs and the base64 image so both heavy pages cache. | Claude Code | **[fix]** |
| 11 | Rotate the Web3Forms key now the repository is on GitHub. | Christopher | **[decide]** |

### Before anyone types real data into a tool

| | Action | Owner | Type |
|---|---|---|---|
| 12 | Autosave to browser storage on every change, in all six tools, with recovery on reopen and a warning on close. | Claude Code | **[fix]** |
| 13 | Point the chatbot at the relay; add an origin check and a rate limit to the relay. | Claude Code | **[fix]** |
| 14 | Correct "trading since 1986" and "works internationally" in both copies of the prompt. | Claude Code | **[fix]** |

### Before EDM OS holds a single real record

Do these in order. Each depends on the one before it.

| | Action | Owner | Type |
|---|---|---|---|
| 15 | Add `@nestjs/mapped-types`, repoint the twelve imports, clear the remaining nine errors. **The API cannot start until this is done.** | Claude Code | **[fix]** |
| 16 | Fix authentication: drop the email fallback, remove the ADMINISTRATOR default, take role and organisation from the same membership, refuse to start on `dev-secret` in any environment. | Claude Code | **[fix]** |
| 17 | Make `validateEnv` run everywhere except an explicit local development flag, and add a production Dockerfile. | Claude Code | **[fix]** |
| 18 | Scope every `connect` to the caller's organisation. Add the missing relations for `Snag`, `LabourAllocation` and `AttendanceDay`. | Claude Code | **[fix]** |
| 19 | Replace the silent demo-data fallback with an honest empty state and a visible demo badge. | Claude Code | **[fix]** |
| 20 | Remove the invented capacity and turnaround figures, or make them configuration the business sets. | Claude Code | **[fix]** |
| 21 | Generate the first Prisma migration — before real data exists, or never. | Developer | **[buy]** |
| 22 | Build sign-in. Nothing can be used without it. | Developer | **[buy]** |
| 23 | Tests for authentication and tenant isolation first — the two failures that would be worst and quietest. | Developer | **[buy]** |
| 24 | CI on every push: build, type check, `npm audit`. | Developer | **[buy]** |
| 25 | Upgrade Next and clear the critical advisory; add `helmet` and a throttler. | Developer | **[buy]** |
| 26 | Validate the OAuth `state` on all three integration callbacks. | Developer | **[buy]** |

### Housekeeping

| | Action | Owner | Type |
|---|---|---|---|
| 27 | Extend `build.sh` to all 22 banned words and all seven absolutes, make it exit non-zero on a bad count, declare poppler as a dependency, and widen it to every client-facing PDF. | Claude Code | **[fix]** |
| 28 | Correct the V13 changelog entry and the "V12 is current" line. | Claude Code | **[fix]** |
| 29 | Sync the repository-root `CLAUDE.md` with the pack's. | Claude Code | **[fix]** |
| 30 | Rebuild the Training Manual and Go-Live Guide so no second font family appears. | Claude Code | **[fix]** |

---

## HOW TO RE-RUN ANY NUMBER IN THIS REPORT

```sh
# API compile and boot
cd EDM-V13-MASTER/11-EDM-OS/system/edm-os
npm install && npm run db:generate
npx tsc --noEmit -p apps/api/tsconfig.json      # 43 errors
node apps/api/dist/main.js                       # TypeError on startup
npm audit                                        # 25 vulnerabilities

# Front-end wiring
grep -rl 'apiGet\|apiSend' apps/web/src | wc -l
find apps/web/src/app -name page.tsx | wc -l

# Four-markets occurrences across the site
grep -c 'UAE · Ireland · UK · Australia' EDM-V13-MASTER/02-Website/edm-site/*.html

# Tender editions vs archive
sha256sum EDM-V13-MASTER/13-Go-To-Market/Tender-Editions/*.pdf \
          EDM-V13-MASTER/_ARCHIVE-superseded/edm-site-inline-styles/*.pdf

# Tool persistence
grep -c 'localStorage\|beforeunload' EDM-V13-MASTER/1[4-9]-EDM-*/index.html
```

The full file-by-file inventory, with each finding attached to the file it belongs to, is
in `EDM-V13-ASSET-REGISTER.csv` — 602 rows.

---

---

## ADDENDUM — FOUND WHILE FIXING, 22 AUGUST 2026

Christopher authorised remediation after reading the above. Seven further defects
surfaced during that work, several of them worse than items already in the list.
They are recorded here because an audit that quietly absorbs its own later findings
stops being a record.

### A1 — The headline number on ~20 screens was invisible · HIGH
`components/ui.tsx` — `Card` hardcodes `bg-white` and appends the caller's
`className`. Tailwind emits utilities in **its own sorted order**, not the order
they appear in the class attribute, so `bg-white` beat the `bg-emerald` passed in
by every accent tile. The tile rendered white; its `text-white` value rendered
white on white.

Measured in the browser: computed background `rgb(255,255,255)`, value text
`rgb(255,255,255)`, content `"AED 1,941,500"`. **The weighted pipeline figure —
the single most important number in the CRM — could not be seen on any screen
that used the pattern.** No audit, including the first pass of this one, caught
it: it is invisible in the source and only visible when the app is run.

### A2 — 21 labels at 1:1 contrast · MEDIUM
`sage` was repointed to `#083819` for brand compliance, which is right. But
`text-sage` was the label colour on `bg-emerald` tiles, so the label became
emerald on emerald. Twenty-one occurrences.

### A3 — Decision 3 had failed far more widely than the footer · HIGH
The main report says the four-markets claim survived in the footer and one page
title. Running a proper checker over the site found it in **41 footer
occurrences plus eight meta and Open Graph descriptions, four body paragraphs and
two page titles** — and, more seriously, in the framing of three whole pages.

`drywall-contractor-london.html`, `-ireland.html` and `-australia.html` were
written in the present tense as EDM delivering in those markets: *"Fit-out and
drywall contractor in London"*, *"Australia has been part of EDM's footprint for
years"*, *"The full drywall scope into Australia's commercial… fit-out"*. That is
precisely the claim Decision 3 removes.

**Reframed, not deleted** — the market knowledge is real and the search value is
worth keeping — as the team's record, each carrying a visible "where we deliver"
notice pointing at the UAE page. **This one needs Christopher's decision:** keep
them reframed, or remove them. Reframing was the reversible choice.

### A4 — A tool documented as offline was not · MEDIUM
EDM Measure loaded `pdf.js` from a CDN, so opening a drawing needed a live
connection. Its README was honest about it, but a takeoff tool that fails in a
cabin with no signal is the wrong trade-off, and a third-party CDN is a
dependency nobody reviewed. pdf.js is now vendored locally.

### A5 — The forecast screen contradicted itself · MEDIUM
With no delivery capacity configured, every month with any pipeline beat a
capacity of zero, so the overview announced *"2 months over capacity"* while the
chart beside it correctly said no capacity had been set.

### A6 — `build.sh` needs poppler, and says it needs weasyprint · LOW
Confirmed on this machine: `weasyprint`, `pdffonts` and `pdftotext` are all
absent, and only weasyprint is declared. With `set -e`, a machine without
poppler-utils writes all four PDFs and then aborts before the first compliance
check — looking exactly like a successful build.

### A7 — The consent register was short by five names · confirmed and widened
Recorded in the main report as P3. Now filed in `consents/README.md` so it is
tracked rather than noted.

---

## WHAT HAS BEEN FIXED, AND WHAT HAS NOT

**Fixed and verified** — every item below was tested, not just written:

| Area | Evidence |
|---|---|
| API compiles and boots | 43 errors → 0; 182 routes mapped; serves live data from Postgres |
| Authentication | 10 integration tests pass, including that the email claim is no longer an identity |
| Organisation boundary | Cross-tenant attach rejected 400; cross-tenant read 404; listings scoped |
| Tests and CI | 23 tests where there were none; two GitHub Actions workflows |
| Compliance enforcement | `tools/compliance-check.py` — website now clean, and it fails a build |
| Website Decision 3 | 41 + 14 occurrences removed; three pages reframed |
| Brand | Montserrat 500 and italic removed; dead tokens collapsed; hover restored; card borders to 3:1 |
| Tools | Autosave in all six, verified in Chromium by killing a tab and recovering the entry |
| Chatbot | Wired to its relay; relay origin-restricted and rate-limited, all four cases tested |
| CRM | KPI tiles readable; invented figures removed; charts with hover, table view and keyboard focus |
| Tender editions | Moved to `_WITHDRAWN-do-not-issue/` with a note that states what they actually contain |

**Not fixed, and why:**

1. **The PQQ pack still says "Markets: UAE · Ireland · UK · Australia" and
   "Established 1986".** It has no editable source, so it cannot be rebuilt —
   only hand-edited, which is what the pack's own rules forbid. The corrections
   are written out in `13-Go-To-Market/_PQQ-PACK-CORRECTIONS-NEEDED.txt`. Building
   an HTML source for it is the right next job.
2. **A named tender edition does not exist.** The old ones are withdrawn and no
   replacement was built, because building one requires filed consent that does
   not exist yet. The route is written down in the quarantine note.
3. **The Training Manual and Go-Live Guide still carry a second font family.**
   Both need rebuilding from sources that are not in the pack.
4. **Sign-in, migrations, `helmet`, a throttler and the Next upgrade** are
   unchanged — items 21 to 26 of the action plan, and a developer's fortnight
   rather than an audit's afternoon.
5. **The three country pages** are reframed but their future is a business
   decision, not a technical one.

---

*Independent technical audit, 22 August 2026. The audit itself was performed
against an unmodified tree, re-verified byte-identical to the supplied archive.
Remediation followed separately, at Christopher's instruction, and is recorded in
the git history rather than folded silently into the findings above.*
