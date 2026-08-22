# EDM OS — Deployment

How to take EDM OS from "runs locally" to "a hosted thing people log into." The
steps that need your accounts and secrets are marked **[your credentials]** —
those can't be done for you.

## Architecture in production

```
  Browser ──► Web (Next.js)  ──►  API (NestJS)  ──►  Postgres (managed)
                                     ▲
                                Supabase (auth: issues JWTs the API verifies)
```

- **Postgres** — a managed instance (Supabase, Neon, Railway, or RDS).
- **Auth** — Supabase Auth issues access tokens; the API verifies them with
  `SUPABASE_JWT_SECRET` and maps the token to an EDM `User`.
- **API** and **Web** — deploy as two services.

---

## 1. Database **[your credentials]**

Create a managed Postgres and grab its connection string → `DATABASE_URL`.

Apply the schema and seed once:

```bash
DATABASE_URL="postgres://...prod..." npm run db:push     # or db:migrate for migration history
DATABASE_URL="postgres://...prod..." npm run db:seed     # idempotent; safe to skip if seeding manually
```

For an ongoing team workflow, switch from `db push` to migrations: run
`npm run db:migrate` locally to generate `packages/db/prisma/migrations`, commit
them, and have the API run `prisma migrate deploy` on release.

## 2. Auth (Supabase) **[your credentials]**

1. Create a Supabase project. Copy the **JWT secret**, **URL**, and **anon key**.
2. Set `SUPABASE_JWT_SECRET` on the API to that JWT secret (this is what makes
   real logins work; the local `dev-secret` is for local only).
3. Create your users in Supabase Auth. For each, set the matching EDM `User`'s
   `supabaseId` to the Supabase user id (the API matches on `supabaseId` or
   `email` — see `apps/api/src/auth/jwt.strategy.ts`).
4. The web app signs users in with Supabase and sends the access token as
   `Authorization: Bearer <token>` to the API.

## 3. Deploy the API

A production build must compile the workspace **db** package to JS (in dev it is
run via ts-node, which won't work under `node dist/main.js`). Two clean options:

- **Simplest:** run the API with a TS runtime in production
  (`ts-node`/`tsx` via `start:dev` or a `start:prod` that uses `tsx`). Works, not
  optimal.
- **Recommended:** add a build step that emits JS for `packages/db`
  (`tsc` with `outDir`, set `main` to the compiled entry), then `nest build` the
  API and run `node apps/api/dist/main.js`.

Host on Railway / Render / Fly / a VPS. Typical config:

```
Build:   npm install && npm run db:generate && npm --workspace apps/api run build
Release: DATABASE_URL=... prisma migrate deploy        # if using migrations
Start:   node apps/api/dist/main.js                    # (after the db-package build above)
Env:     DATABASE_URL, SUPABASE_JWT_SECRET, API_PORT, CORS_ORIGIN=https://<your-web-domain>
```

Note: Prisma needs the right engine for the host OS. On Alpine/musl images add
`binaryTargets` to the generator in `schema.prisma` (e.g. `linux-musl-openssl-3.0.x`).

## 4. Deploy the Web

Vercel is the natural fit for Next.js (or Railway/Render).

```
Build:   npm install && npm --workspace apps/web run build
Start:   npm --workspace apps/web run start
Env:     NEXT_PUBLIC_API_URL=https://<your-api-domain>
```

Set `CORS_ORIGIN` on the API to the web's domain so the browser can call it.

Before the web is useful in production, wire its screens to the API via
`apps/web/src/lib/api.ts` (see RUNBOOK → "the web screens still render mock
data"). Start with one screen (the follow-ups agenda is a good first cut), then
roll the pattern across the rest.

---

## What's done vs. what needs you

- **Done & verified:** the web builds cleanly (all 24 routes type-check); the API
  code, schema, seed and conversion endpoints are in place; the full stack comes
  up locally with one command and serves real data (proven via `scripts/dev-token.mjs`).
- **Needs you:** a managed Postgres and a Supabase project (credentials), the
  small production build step for `packages/db`, and wiring the web screens to
  the live API. None of those can be done without your accounts — but the path
  above is the whole of it.
