# EDM OS — 30-Day Pilot Plan

The point of this is simple and honest: get EDM OS in front of **one real
project**, with a **handful of real people**, for **one month** — and decide what
it's worth from evidence rather than opinion. `DEPLOY.md` covers how to host it.
This covers how to prove it.

Everything we built is verified at the screen level. What's never been tested is
the only thing that matters now: whether people actually use it when it's their
real work on the line. A narrow pilot answers that cheaply.

---

## The rule of the pilot: stay narrow

Resist the urge to roll it out across EDM. Pick the smallest slice that still
gives a real signal:

- **One live job** — a current EDM drywall/fit-out project, ideally one with
  active drawings and a main contractor you're transmitting to.
- **Your live bid pipeline** — the real opportunities you're chasing right now.
- **Three or four people**, not the whole company.

Narrow is the point. It's fast, it's low-risk, and a single real project tells
you almost everything a company-wide rollout would — without the cost or the
exposure if it's not ready.

## Who's in it

Map it to the parts that are actually built:

- **You (COO)** — the command centre, forecast, account scorecards. The "do I
  open this every morning?" test.
- **One estimator** — estimator workload plus the live bids assigned to them.
- **One commercial/PM person** — pipeline, companies, accounts, follow-ups.
- Optionally **Damien** — the overview, as a second set of eyes at the top.

Four users is plenty. Adoption by four real people is a far stronger signal than
a demo to forty.

## Week 0 — Setup (a few hours, mostly a developer)

1. Deploy per `DEPLOY.md` (Supabase + Railway + Vercel).
2. Replace the sample data with a **thin slice of real data**: your current open
   bids, the real companies behind them (actual clients and main contractors),
   estimators assigned to live bids, and the current drawings for the pilot
   project with their real transmittals.
3. Create the four users in Supabase and link them.

## The four weeks

- **Week 1 — Parallel run.** Keep your spreadsheets; don't rip anything out.
  Log every bid, follow-up and pipeline change in EDM OS *as well*. The job this
  week is simply: does everyone remember to use it, and is anything painful?
- **Week 2 — Estimating and pipeline for real.** Run the estimating queue and
  the pipeline through it properly. Issue at least **one genuine transmittal**
  through document control to your main contractor or consultant, and track the
  response. See whether the capacity forecast matches what your team actually
  feels.
- **Week 3 — Make it the source of truth.** For the pilot project only, EDM OS
  becomes the place the answer lives; spreadsheets become the backup. This is the
  real test — relying on it.
- **Week 4 — Review and decide.** Sit the four users down for thirty minutes
  against the measures below.

## What success actually looks like

Honest, concrete criteria — not vanity:

- **Adoption:** are bids and follow-ups genuinely being logged, or has everyone
  drifted back to the old way? (If they drifted, that's the finding.)
- **The forecast test:** did the capacity flag match reality — did the months it
  warned about feel tight when they arrived?
- **The queue test:** did estimator workload actually help you route a bid to
  someone with headroom?
- **The catch:** did anyone spot something — an overdue follow-up, an account
  worth chasing, a bid nobody was loaded for — that they'd otherwise have missed?
- **The real one:** at the end of the month, would the four of them be *annoyed
  to lose it?* That single answer is worth more than any score.

Keep a running **friction log** alongside: every moment something was slow,
missing, or confusing. That list is your roadmap.

## Gaps you'll hit — expected, not failures

So nobody's surprised: **file uploads aren't wired yet** (document control tracks
the register, revisions and transmittals, but you can't attach the actual PDF
through it during the pilot — note the drawing, store the file as you do now).
There's **no offline/site app** and **no accounting integration**. The pilot is
testing the CRM, commercial, estimating, forecasting and document-workflow core —
which is exactly what's built. Judge it on that.

## The decision at the end

From the evidence, pick one — and mean it:

- **Adopt and harden** — they'd miss it. Wire file storage, fix the friction
  list, then widen to more projects.
- **Iterate and re-pilot** — promising but two or three things blocked daily use.
  Fix those specifically, run it again.
- **Shelve** — they drifted back and didn't miss it. Then you've learned that
  cheaply, in a month, instead of expensively over a year.

## What it costs you

A few hours of a developer to set up, ten to fifteen minutes a day per person,
and one review session. That's the whole bill. In return you get the one thing no
amount of further building can give you: proof of whether this earns its place in
EDM — before you spend another pound on it.
