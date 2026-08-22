# EDM OS — TECHNICAL AUDIT

**Run 20 August 2026, before go-live. Dependencies installed, both applications
compiled, schema and API read line by line.** This is a test report, not a
review of intentions.

**Verdict: ready for GitHub. Not ready to go live.**

---

## THE HEADLINE

**The web application renders from mock data. Forty pages, thirty-eight of them
importing `lib/data.ts`. Zero pages call the API.**

```
pages using apiGet / apiSend : 0
pages using lib/data (mock)  : 38
total pages                  : 40
API endpoints available      : 182
```

The API client exists and is correct. Its own header comment says so plainly —
*"the screens currently render from lib/data.ts so the prototype works with no
backend."* That is honest, and whoever wrote it knew what they were building.

But it means what exists today is a **very well-built prototype**, not a working
product. Every screen looks right and none of it is real. If a supervisor logged
in tomorrow and typed a timesheet, nothing would be saved.

That single fact governs the go-live answer. Everything else below is secondary.

---

## WHAT IS GENUINELY GOOD

Better than most codebases at this stage, and worth saying so.

**Architecture.** Clean npm workspace monorepo — `apps/api` (NestJS), `apps/web`
(Next 14 App Router), `packages/db` (Prisma). Correct separation, no circular
mess.

**The data model is serious.** 51 Prisma models covering CRM, tendering,
estimating, projects, daily reports, labour, variations, RFIs, inspections,
snags, NCRs, incidents. 85 indexes and unique constraints. This is somebody who
understands construction, not a generic CRM schema with the words changed.

**Security architecture is right, where it exists.**

- JWT, roles and feature guards registered globally via `APP_GUARD` — so
  endpoints are protected by default rather than by remembering a decorator.
  Zero `@UseGuards` across 36 controllers is correct here, not a gap.
- `ValidationPipe` global with `whitelist: true` and `transform: true`.
  Unexpected fields are stripped.
- **Multi-tenant isolation is done properly.** `organisationId` comes from the
  verified token, never from the request body, and a shared `tenantWhere()`
  helper is used consistently. I checked every service for unscoped Prisma
  calls; the two that flagged both scope through the helper.
- `validateEnv` refuses to boot in production on a missing config or on the
  default `dev-secret` JWT key. That is a genuinely thoughtful control and it
  is rarer than it should be.

**The web app builds clean.** Next 14 production build, no errors.

**DTOs use class-validator** throughout.

---

## DEFECTS AND GAPS

### 1. The front end is not connected — **blocking**
As above. 182 endpoints with nothing calling them.

### 2. There is no login — **blocking**
`getApiToken()` reads an `edm_token` cookie. Nothing in the codebase sets that
cookie. There is no sign-in page, no Supabase client on the web side, no session
handling. The comment says production gets it "from the signed-in Supabase
session"; that session does not exist yet.

### 3. No database migrations — **blocking for production**
`packages/db/prisma/migrations/` does not exist. The workflow is `db:push`,
which is fine for a prototype and unusable in production: no version history, no
safe rollback, and schema changes against live data become manual surgery.
Generate an initial migration before any real data exists. After that it is
painful.

### 4. Zero automated tests — **high**
No `.spec.ts`, no `.test.ts`, nothing. 182 endpoints and 51 models with no test
covering any of them. The multi-tenant boundary in particular is the thing you
cannot afford to break silently, and nothing would tell you if it broke.

### 5. No CI pipeline — **high**
No `.github/`. Nothing runs a build, a type check or an audit on push. The
checks that exist for the documents do not exist for the code.

### 6. Eleven dependency vulnerabilities, one critical — **high**

| Severity | Package | Issue |
|---|---|---|
| **Critical** | `next` 14.2.5 | Cache poisoning |
| High | `@nestjs/platform-express` | via `@nestjs/core` |
| High | `multer` | Denial of service via incomplete cleanup |
| High | `nanoid` | Non-secure generator can loop indefinitely |
| High | `postcss` | XSS via unescaped `</style>` |

Next 14.2.5 is well behind. Upgrade before exposing anything publicly.

### 7. No rate limiting, no security headers — **medium**
Neither `@nestjs/throttler` nor `helmet` is present. An unauthenticated
brute-force against the token endpoint is unthrottled, and standard response
headers are absent.

### 8. Inconsistent TypeScript strictness — **medium**
`apps/web` runs `strict: true`. `apps/api` sets only `strictNullChecks`. The
half with the database access is the less strictly typed half, which is
backwards.

### 9. No linting or formatting config — **low**
No ESLint or Prettier at root. Fine with one developer, a source of noise with
two.

### 10. API build unverified in this environment — **note, not a defect**
`prisma generate` could not run here: the engine binary download returns 403 in
this sandbox. Without the generated client, `tsc` produced 161 errors — **and
every single one traces to `@edm-os/db` having no exported members.** None are
independent code faults. On a machine with normal network access this should
compile; it has not been proven, and proving it is the first task.

---

## ANSWERING THE QUESTION DIRECTLY

**"Do the designers and full-stack team need to be smarter?"**

No. The judgement in this codebase is above average — the tenant helper, the
global guards, the boot-time config validation and the schema design are all
things weaker teams get wrong. Whoever built this knows what they are doing.

The gap is **completeness and engineering discipline**, which is a different
problem from intelligence:

- The UI was built before the wiring, so it demos beautifully and does nothing.
  That is a sequencing decision, and it is the most common way construction
  software stalls at 80%.
- Tests, CI and migrations were skipped. Every one of those is boring, and every
  one of them is what separates a prototype from something you can run a
  business on.

What is needed is not smarter people. It is **finishing discipline** and a
willingness to spend a fortnight on unglamorous plumbing before the next feature.

---

## THE SEQUENCE TO GO-LIVE

Roughly six to eight weeks with one competent full-stack developer. In order —
each depends on the one before it.

| # | Task | Why it is in this position |
|---|---|---|
| 1 | Prove the API compiles and boots against a real Postgres | Everything else assumes this |
| 2 | Generate the initial Prisma migration | Do it before real data exists, or never |
| 3 | Build sign-in — Supabase session on the web, set `edm_token` | Nothing can be used without it |
| 4 | Wire one module end to end (CRM is the obvious first) | Proves the whole chain; the pattern then repeats |
| 5 | Add CI: build, type check, `npm audit` on every push | Stops regression from here on |
| 6 | Write tests for auth and tenant isolation first | The two failures that would be worst and quietest |
| 7 | Upgrade Next and clear the critical advisory | Before anything is public |
| 8 | Add throttler and helmet | Same |
| 9 | Wire the remaining modules | The long tail, now on a proven pattern |
| 10 | Pilot on one live project with real users | The only real test |

**Do not start at 9.** The temptation with a prototype this polished is to keep
adding screens. Screens are the part that is already done.

---

## GITHUB READINESS — CONFIRMED

Separate question from go-live, and the answer is yes.

- No credentials in the repository. The chatbot relay reads its key from
  `process.env`; `.env.example` holds placeholders only.
- `.gitignore` covers `node_modules`, `.env`, build output, `__pycache__`.
- `.gitattributes` marks binaries and normalises line endings.
- No `node_modules` or `.next` committed — installed and removed during this
  audit, verified clean afterwards.
- Repository is 25 MB; no file approaches GitHub's limits.
- The Web3Forms key in the website is client-side by design. Rotate it if the
  repository is made public.

Push it. Then work the sequence above in Claude Code, which is exactly the kind
of task it is good at — small, verifiable steps against a codebase with a clear
existing pattern.
