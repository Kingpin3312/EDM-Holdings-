# EDM OS — Handover Pack

Everything for EDM OS in one place. Three parts, three audiences.

---

## 1. The demo — to present before you commit
**`demo/edm-os-demo.html`**

Open it in any web browser (just double-click it). No login, no internet, works
offline. Click the sidebar to move through the screens. This is the product on
sample data, across UAE, UK, Ireland and Australia in each region's local
currency — the clearest way to show partners or a client what EDM OS is before a
penny is spent on deployment. Every screen is marked "Demo · sample data".

## 2. The decision memo — for partners / the board
**`EDM-OS-go-no-go-memo.md`**

A one-page, honest go/no-go: what's built, what's missing, and the recommended
path — pilot the commercial platform now, build and deploy the rest in sequence.
Hand this to anyone who needs to approve the next step.

## 3. The system — for your developer
**`system/edm-os/`**

The full codebase: the Next.js app, the NestJS API, the database schema, and the
deployment kit. Point your developer here. They should start with:

- `system/edm-os/DEPLOY.md` — plain-English deployment (Supabase + Railway/Render + Vercel)
- `system/edm-os/GO-LIVE.md` — the pre-flight runbook
- `system/edm-os/PILOT.md` — the 30-day pilot plan
- `system/edm-os/VERIFICATION.md` — honest, per-feature status (what's proven vs what needs the live database)

---

## What it costs to go live
- **Setup:** a developer, 1–2 days (~$500–1,500 one time).
- **Running:** ~$50–70/month — Supabase ~$25, API host ~$5–15, Vercel ~$20, domain ~$1.

Prices change; confirm at sign-up.

## The one honest line
The logic and screens are verified — 52 unit tests, every page renders. What
hasn't happened is running it live with real data; that's the deployment step,
and it's where this becomes the system EDM runs on rather than a proven
prototype. Start with one real project and one real week of attendance, and let
the timesheets and the claims register fill themselves in.
