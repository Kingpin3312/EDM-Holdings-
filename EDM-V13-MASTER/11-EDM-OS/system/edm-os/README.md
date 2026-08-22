# EDM OS — Construction Operating System

The operating system for **EDM Holdings** — a UAE interior fit-out, drywall, joinery,
timber cladding, painting and aluminium/glazing contractor. Built to scale from
AED 0 to AED 500m turnover, and architected so it can become a vertical-SaaS product
for other UAE fit-out contractors.

> **What this repository is.** This is the **Phase-0 foundation**: the complete data
> model, authentication, role-based access control, and **two modules (Tenders,
> Projects) implemented end-to-end** as the reference pattern your team replicates for
> the remaining modules. It is the spec + skeleton a senior team builds on — not a
> finished Procore. See `docs/` and the Technical Blueprint PDF for the full design.

## Stack

| Layer | Technology |
|------|-----------|
| Frontend | Next.js 14 (App Router), React 18, Tailwind CSS |
| Backend | NestJS 10 (REST, `/api/v1`) |
| Database | PostgreSQL + Prisma ORM |
| Auth | Supabase Auth (JWT verified by the API) |
| Storage | Supabase Storage (documents, drawings) |
| Hosting | Vercel (web) + a Node host/Render/Fly (api) + Supabase (db) |
| Automation | n8n (webhooks, scheduled jobs) |
| AI | Anthropic + OpenAI (estimating take-off, RFI drafting, reporting, advice) |

## Monorepo layout

```
edm-os/
├─ apps/
│  ├─ api/            NestJS API — auth, RBAC, Tenders + Projects modules
│  └─ web/            Next.js app — design system + Executive dashboard, Tenders, Projects
├─ packages/
│  └─ db/             Prisma schema (the full data model) + seed + client
├─ docs/
│  └─ ui-prototype/   Self-contained dashboard prototype (open in a browser)
├─ docker-compose.yml Local Postgres
└─ .env.example       All required environment variables
```

## Quick start (local)

```bash
# 0. prerequisites: Node 20+, Docker (or a Supabase project)
cp .env.example .env            # fill in values
npm install                     # installs all workspaces

# 1. database
docker compose up -d            # local Postgres on :5432
npm run db:generate             # prisma generate
npm run db:migrate              # create the schema
npm run db:seed                 # demo org, tenders, project

# 2. run
npm run dev:api                 # API on :4000  (GET /api/v1/health)
npm run dev:web                 # Web on :3000  (/dashboard)
```

## How to extend (the pattern)

Each remaining module follows the Tenders/Projects reference exactly:

1. **Schema** — the models already exist in `packages/db/prisma/schema.prisma`.
2. **Module** — create `apps/api/src/<module>/` with `*.module.ts`, `*.controller.ts`,
   `*.service.ts`, and `dto/`.
3. **Tenant scope** — every service method filters by `organisationId` from the
   authenticated `AuthContext` (see `current-user.decorator.ts`). Never trust a body for tenancy.
4. **RBAC** — guard write endpoints with `@Roles(...)` (see `roles.guard.ts`).
5. **UI** — add a route under `apps/web/src/app/<module>/` using the design-system
   components in `components/ui.tsx` and the `Shell`.

## Security baseline

- Multi-tenant isolation on **every** table via `organisationId`, enforced in the service layer.
- Supabase JWT verification on all routes; routes opt out explicitly with `@Public()`.
- Role-based authorisation on all mutations.
- Postgres Row-Level Security recommended as defence-in-depth (see Blueprint §Security).
- Full `AuditLog` model for create/update/delete and exports.

## Keeping the SaaS option open (internal-first, product-optional)

EDM OS is built internal-first, but with the **cheap disciplines** that preserve the
option to sell it later — without paying for product machinery before there's a buyer.

**The configuration layer (implemented).** Trades, workflow stages, feature flags and
branding live as **data**, not code, in `OrganisationSettings` (see
`apps/api/src/config/org-config.ts`). Nothing about "how EDM works" is hardcoded.

- **Feature flags** — `@Feature("variations")` gates any route on the org's config
  (`apps/api/src/common/feature.guard.ts`). Phase-1 modules ship on; later modules
  ship dark and switch on per org. This is also the SaaS tiering primitive.
- **Multi-tenant by default** — every table is scoped by `organisationId`; use
  `tenantWhere(orgId, …)` so the boundary is never forgotten.
- **Config-driven workflows** — allowed tender/project transitions come from settings,
  not from `if` statements in the service.
- **Per-org branding** — `OrganisationSettings.branding` (logo/colours) is reserved
  for white-labelling on the product path.

**What is deliberately NOT built yet (product-only machinery):** billing/subscriptions,
self-serve sign-up, super-admin console, marketing site, customer support tooling,
multi-org provisioning. Add these the day a real external buyer appears — not before.
See **EDM-OS-Internal-First-Build-Plan.pdf** for the trigger and the build sequence.

## Status / roadmap

- **Phase 1 (MVP):** auth, CRM, Tenders, Estimating, Projects, Site reports, Executive dashboard.
- **Phase 2 (Commercial):** Variations, RFIs, Quality, HSE, Procurement, Documents, trade modules, mobile (offline).
- **Phase 3 (Enterprise):** Financials/forecasting, AI suite, analytics, SSO, multi-org SaaS, integrations.

See **EDM-OS-Technical-Blueprint.pdf** for architecture, data model, API design, AI
strategy, security framework, hosting and the phased plan in full.
