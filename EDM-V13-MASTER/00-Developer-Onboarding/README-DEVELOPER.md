# EDM Holdings — Developer Handover

Welcome. This pack is the complete EDM Holdings digital estate (master build V8)
plus your onboarding documents. Read in this order:

1. **EDM-Developer-Engagement-Brief.pdf** — the engagement, the two
   non-negotiables (IP assignment, EDM-owned repositories) and your first
   ninety days in strict order.
2. **EDM-OS-Commercial-Engine-Spec.pdf** — build assignment three: the
   payment application, certification and variation-evidence engine,
   including acceptance tests that define done.
3. **../11-EDM-OS/system/edm-os/** — the platform itself. Start with
   README.md, then RUNBOOK.md and DEPLOY.md. Next.js 14 / NestJS /
   PostgreSQL (Prisma) / Docker. Source-complete, 52 passing unit tests,
   never yet run in production — production hosting on a single pilot
   project is assignment one.

## The order of work (fixed)

1. Production hosting: live pilot, nightly backups, tested restore,
   access control, second admin credential holder inside EDM.
2. Custody: repository under EDM ownership, deployment runbook,
   environment documentation, credential handover verified.
3. The Commercial Engine per the specification.

Nothing else starts before one and two are complete.

## Also in this pack

- 02-Website — the live site source (edmholdings.ae). The deployed master.
  Any change goes through this folder; nothing edits the server directly.
- 21-Chatbot — the site chatbot; its relay requires separate hosting
  (a later task, not in the first ninety days).
- Remaining folders — brand, stationery, tools and go-to-market assets.
  Reference only; no development work required.

Point of contact: Christopher Simon, COO — christopher@edmholdings.ae
