# EDM OS — How to Deploy (Plain-English Guide)

This is the owner's guide: what to do, in order, in plain language. There's a
developer-level companion in `DEPLOYMENT.md` if you hand this to an engineer.

## The honest starting point

EDM OS is three pieces that run together:

1. **Web** — the screens you click (Next.js).
2. **API** — the engine behind them (NestJS).
3. **Database** — where everything is stored (Postgres).

Putting a three-part app online is a real job, not a one-tap install. You have
two sensible routes, and **the single best piece of advice I can give you is to
budget two to four hours of a developer's time for Route B.** This guide gives
them the exact path, so those hours are cheap and predictable rather than
exploratory. You can absolutely follow it yourself too — just take it slowly.

---

## Route A — See it running today (on a computer)

Good for trying it, showing your team, or letting a developer poke at it. Needs a
laptop, not your phone.

1. Install **Docker Desktop** (free) and open it.
2. Download the project, open a terminal in the project folder, and run one line:

   ```bash
   docker compose up --build
   ```

3. Wait a minute, then open **http://localhost:3000** in a browser. It comes up
   with sample data already loaded (the seed user is `damien@edmholdings.ae`).

That's the whole thing running on one machine. Stop it with `Ctrl+C`. Nothing is
online yet — this is local only.

---

## Route B — Put it online for your team (the real deployment)

Three managed services do the hosting for you. No servers to run.

### Step 1 — Database + logins: **Supabase**
1. Create a free **Supabase** project (supabase.com).
2. From the project settings, copy three things: the **database connection
   string**, the **JWT secret**, and the **project URL**.
3. The connection string becomes `DATABASE_URL`; the JWT secret becomes
   `SUPABASE_JWT_SECRET`. (Supabase also handles your team's logins — see Step 4.)

### Step 2 — Load the database (once)
On a laptop, in the project folder, point it at your new Supabase database and
set it up in one go:

```bash
npm install
npm run db:generate
DATABASE_URL="<your-supabase-connection-string>" npm run db:push
DATABASE_URL="<your-supabase-connection-string>" npm run db:seed
```

This creates all the tables and loads the starter data. You only do this once.

### Step 3 — Host the API: **Railway** (or Render)
1. Connect your code repository to **Railway** and add a service for the **API**
   (`apps/api`).
2. Set its environment variables (see the table below) — the important ones are
   `DATABASE_URL` and `SUPABASE_JWT_SECRET`.
3. Deploy. Railway gives you a URL like `https://edm-api.up.railway.app` — note it.

### Step 4 — Host the web app: **Vercel**
1. Connect the same repository to **Vercel** and point it at **`apps/web`**.
2. Set one environment variable: `NEXT_PUBLIC_API_URL` = the API URL from Step 3.
3. Deploy. Vercel gives you the address your team will actually use.

### Step 5 — Your real users
Create each team member in **Supabase Auth**, then set the matching EDM `User`'s
`supabaseId` to their Supabase id (the API matches people by `supabaseId` or
email). After that, real logins work and the `dev-secret` placeholder is gone.

---

## The settings you'll be asked for (exact names)

| Setting | Where | What it is |
|---|---|---|
| `DATABASE_URL` | API + setup | Your Supabase Postgres connection string |
| `SUPABASE_JWT_SECRET` | API | Makes real logins work (from Supabase settings) |
| `API_PORT` | API | Port the API listens on (default `4000`) |
| `CORS_ORIGIN` | API | Your web address, so the browser is allowed to call the API |
| `NEXT_PUBLIC_API_URL` | Web | The API's address (from Step 3) |

`SUPABASE_URL` / `ANON_KEY` / `SERVICE_ROLE_KEY` / `STORAGE_BUCKET` are listed in
`.env.example` for when document **file uploads** are wired to Supabase Storage.
The `ANTHROPIC_API_KEY`, `OPENAI_API_KEY` and `N8N_*` entries are placeholders for
future AI/automation work — **not needed to run the platform today.**

---

## One tidy-up for your developer

There's a single known build detail (also in `DEPLOYMENT.md`): for an optimised
production API build, the shared `packages/db` package should be compiled to
JavaScript (in development it's run directly as TypeScript). The simplest path —
running the API with a TypeScript runtime — works as-is; the cleaner path is a
short `tsc` build step. Either is a few minutes for an engineer. Nothing else is
blocking.

---

## You're live when…

You open your Vercel address on your phone, log in as a real Supabase user, and
the dashboard loads with **your** data. That's the moment this stops being a
prototype and becomes the tool your team uses — and it's the only step that
truly proves it.
