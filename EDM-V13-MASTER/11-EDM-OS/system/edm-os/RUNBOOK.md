# EDM OS — Runbook (local)

Two ways to run it. Either gets you a live API serving real data from Postgres.

---

## Option A — Docker (one command)

Prerequisites: Docker Desktop.

```bash
docker compose up --build
```

This starts three containers:

- **db** — Postgres 16 on `localhost:5432`
- **api** — NestJS on `localhost:4000`. On boot it waits for Postgres, syncs the
  schema (`prisma db push`), seeds demo data (idempotent), then starts.
- **web** — Next.js on `localhost:3000`

Open **http://localhost:3000**. The API is at **http://localhost:4000/api/v1**.

To stop: `Ctrl-C`, then `docker compose down` (add `-v` to wipe the database).

---

## Option B — Bare Node

Prerequisites: Node 20+, and a Postgres (the quickest is `docker compose up -d db`).

```bash
cp .env.example .env          # the defaults match the compose Postgres
npm run setup                 # install + prisma generate + db push + seed
# (equivalently: npm install && npm run db:generate && npm run db:push && npm run db:seed)

# in two terminals:
npm run dev:api               # API  → http://localhost:4000/api/v1
npm run dev:web               # Web  → http://localhost:3000
```

> First-time setup uses `db push` (there is no migration history yet). For a
> team/production workflow, generate migrations instead: `npm run db:migrate`.

---

## Prove it's live (real data, not the mock)

The API routes are protected. Mint a local token for the seeded owner and call a
real CRM endpoint — the response comes straight from Postgres:

```bash
TOKEN=$(SUPABASE_JWT_SECRET=dev-secret node scripts/dev-token.mjs)

curl http://localhost:4000/api/v1/health
curl http://localhost:4000/api/v1/crm/dashboard/agenda  -H "Authorization: Bearer $TOKEN"
curl http://localhost:4000/api/v1/crm/dashboard/analytics -H "Authorization: Bearer $TOKEN"
curl http://localhost:4000/api/v1/crm/opportunities      -H "Authorization: Bearer $TOKEN"
```

`SUPABASE_JWT_SECRET` must match the API's (it's `dev-secret` in compose and in
`.env.example`). The token maps to the seeded user by email
(`damien@edmholdings.ae`); pass a different seeded email as an argument to
impersonate someone else.

### Walk the sales chain end-to-end (live)

```bash
# 1. list opportunities, copy an OPEN id
curl .../api/v1/crm/opportunities -H "Authorization: Bearer $TOKEN"

# 2. convert a won bid into a live project (the Procore-style handoff)
curl -X POST .../api/v1/crm/opportunities/<OPP_ID>/convert-to-project \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"emirate":"Dubai"}'

# 3. confirm the project now exists, carried over from the opportunity
curl .../api/v1/projects -H "Authorization: Bearer $TOKEN"
```

---

## Note: live data vs. mock on the web

The eight CRM screens read from `apps/web/src/lib/data.ts` so the prototype works
with no backend. Two screens — **Follow-ups** and **Analytics** — are already
wired to the live API via `apps/web/src/lib/server-data.ts`, with automatic
fallback to the mock when the API isn't reachable. To light them up with real
data:

```bash
# 1. mint a token and expose it to the web server
export EDM_API_TOKEN=$(SUPABASE_JWT_SECRET=dev-secret node scripts/dev-token.mjs)
# 2. (re)start the web app so it picks up the env var
npm run dev:web
```

Now `/crm/follow-ups` and `/crm/analytics` render from Postgres via the API; stop
the API and they fall back to the seeded mock without erroring.

To make the remaining screens live, follow the same pattern: add a getter to
`lib/server-data.ts` (try the API with `apiGet`, map the response, fall back to
the mock) and `await` it from the page. The client (`lib/api.ts`), the token
resolver (`lib/auth.ts`) and the convention are already in place. In production
the token comes from the signed-in Supabase session (an `edm_token` cookie)
instead of the env var — see DEPLOYMENT.md → Auth.

## Note: fonts

`apps/web/src/app/layout.tsx` loads Montserrat from Google Fonts via a `<link>`.
That's fine on any machine with internet. If your build/runtime blocks outbound
font requests, self-host Montserrat (e.g. `next/font/local`) instead.
