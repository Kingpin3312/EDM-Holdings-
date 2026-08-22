# EDM OS — Go-Live Runbook

A deployment team's pre-flight for taking EDM OS live. Read the scope line first —
it determines everything.

## Scope of this go-live

**This runbook is for a controlled pilot of the commercial platform** (CRM,
pipeline, estimating, accounts, document control) on one real project, in parallel
with existing spreadsheets. **It is not a company-wide go-live.** The labour and
site-operations core (allocation, attendance, timesheets, supervisor reporting,
productivity) is not built, the system has not run at scale, and enterprise
security controls (MFA, audit, certifications) are not in place. Do not present
this as the company system of record until those exist.

## Pre-flight checklist (in order)

1. **Provision hosting.** Supabase (Postgres + Auth), an API host (Railway or
   Render), and Vercel for the web app. See `DEPLOY.md`.
2. **Generate secrets — this is now enforced.** The API refuses to start in
   production unless these are set correctly:
   - `SUPABASE_JWT_SECRET` — a real secret from Supabase (not the dev default).
   - `TOKEN_ENCRYPTION_KEY` — `openssl rand -hex 32`. Integration tokens are
     encrypted at rest with this; **store it safely and never rotate it without
     re-connecting the integrations**, or stored tokens become unreadable.
   - `DATABASE_URL`, `CORS_ORIGIN` (your web URL), `NEXT_PUBLIC_API_URL`.
3. **Set up the database.** `npm run db:push` then `npm run db:seed` — or import
   the real pilot slice (the pilot project's live bids, the real client companies,
   estimators assigned to live bids). See `PILOT.md`.
4. **Deploy API, then web.** Point `NEXT_PUBLIC_API_URL` at the API; set
   `CORS_ORIGIN` to the web address.
5. **Create the real pilot users** in Supabase Auth and link them (see `DEPLOY.md`
   step 5). Confirm the `dev-secret` path is gone.
6. **Smoke test.** Run `scripts/smoke-test.mjs` against the live stack — it checks
   health, auth, and the core endpoints.
7. **Backups.** Turn on Supabase automated backups and **test a restore once** —
   an untested backup is not a backup.
8. **Monitoring.** Wire error logging and an uptime check against
   `/api/v1/health`.

## Go-live gate — do not flip to "source of truth" until

- The smoke test passes against production.
- One real user has logged in and seen real pilot data.
- A backup restore has been tested successfully.

Until then, run in parallel with spreadsheets.

## Rollback

The pilot is additive, which makes rollback simple: spreadsheets remain the
fallback for the duration. If a deploy is bad, redeploy the previous version on
Railway/Vercel (one click). The database is the asset — backups (step 7) are the
real safety net, so verify them before go-live, not after.

## Security posture after this hardening pass

**Now in place:** the insecure default JWT secret is rejected at boot; integration
tokens are encrypted at rest (AES-256-GCM); configuration is validated at startup
(the app fails fast rather than booting misconfigured); CORS is locked to the web
origin; role-based access and per-tenant data isolation are in the code.

**Still required before an enterprise / company-wide go-live:** multi-factor
authentication, a penetration test, SOC 2 / ISO alignment, and audit logging at
scale. These are pilot-acceptable to defer, not enterprise-acceptable.

## One engineering note

The Docker/dev-mode deployment runs as-is and is fine for the pilot. For an
optimised production API build, compile the shared `packages/db` package to
JavaScript (a short `tsc` step) so the API can run from `dist`. This is a tidy-up
for scale, **not** a pilot blocker.

## Known functional limits at this go-live

- Commercial modules only — no labour/site/HR operations core yet.
- No offline capability; this is desktop-and-browser, online.
- Document control tracks the register, revisions and transmittals, but **file
  uploads aren't wired** — record the drawing here, store the file as you do today.
- The four integrations (Microsoft 365, Xero, WhatsApp, DocuSign) are built but
  each needs its provider app registered to go live (see `INTEGRATIONS.md`).
