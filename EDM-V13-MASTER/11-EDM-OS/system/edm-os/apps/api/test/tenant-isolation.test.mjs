// Integration tests for the two failures that would be worst and quietest:
// authentication, and the organisation boundary.
//
// Needs a running API and a seeded database:
//   npm run db:push && npm run db:seed
//   SUPABASE_JWT_SECRET=... CORS_ORIGIN=... node apps/api/dist/main.js
//   API_URL=http://localhost:4000 npm run test:tenant
//
// Skips itself (rather than failing) when no API is reachable, so `npm test`
// stays useful on a machine with no database.
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

const API = (process.env.API_URL ?? "http://localhost:4000").replace(/\/$/, "") + "/api/v1";
const SECRET = process.env.SUPABASE_JWT_SECRET ?? "dev-secret";

const b64url = (i) => Buffer.from(i).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function mintToken({ sub, email, expiresInSec = 3600 }) {
  const now = Math.floor(Date.now() / 1000);
  const data = `${b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${b64url(
    JSON.stringify({ sub, email, role: "authenticated", iat: now, exp: now + expiresInSec }))}`;
  return `${data}.${b64url(crypto.createHmac("sha256", SECRET).update(data).digest())}`;
}
const call = (path, opts = {}, token) =>
  fetch(API + path, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts.headers ?? {}) },
  });

// Resolved at module load, before the tests are registered: node:test treats a
// FUNCTION passed as `skip` as truthy, so the flag has to be a real boolean by
// the time test() is called.
let reachable = false, prisma, mine, rival, token;
try {
  const r = await fetch(API + "/health", { signal: AbortSignal.timeout(3000) });
  reachable = r.ok;
} catch { reachable = false; }

if (reachable) {
  prisma = new PrismaClient();
  const user = await prisma.user.findFirst({ where: { isActive: true }, include: { memberships: true } });
  mine = { orgId: user.organisationId, email: user.email, sub: user.supabaseId ?? "test-subject" };
  token = mintToken({ sub: mine.sub, email: mine.email });

  const org = await prisma.organisation.create({ data: { name: `Rival ${Date.now()}` } });
  rival = {
    orgId: org.id,
    company: (await prisma.company.create({ data: { organisationId: org.id, name: "CONFIDENTIAL Rival Client", type: "MAIN_CONTRACTOR" } })).id,
    lead: (await prisma.lead.create({ data: { organisationId: org.id, title: "Rival secret lead" } })).id,
    project: (await prisma.project.create({ data: { organisationId: org.id, code: `RV-${Date.now()}`, name: "Rival project" } })).id,
  };
}

const skip = reachable ? false : "no API reachable at " + API;

describe("authentication", () => {
  test("a protected route rejects a request with no token", { skip }, async () => {
    assert.equal((await call("/crm/leads")).status, 401);
  });

  test("a token signed with the wrong secret is rejected", { skip }, async () => {
    const data = `${b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${b64url(JSON.stringify({ sub: mine?.sub, email: mine?.email, exp: Math.floor(Date.now() / 1000) + 600 }))}`;
    const forged = `${data}.${b64url(crypto.createHmac("sha256", "not-the-real-secret").update(data).digest())}`;
    assert.equal((await call("/crm/leads", {}, forged)).status, 401);
  });

  test("an expired token is rejected", { skip }, async () => {
    assert.equal((await call("/crm/leads", {}, mintToken({ sub: mine.sub, email: mine.email, expiresInSec: -60 }))).status, 401);
  });

  test("an unknown subject is rejected, and is NOT matched on the email claim", { skip }, async () => {
    // The whole point: a valid signature plus a known email must not be enough
    // once the account is linked to a different subject.
    const res = await call("/crm/leads", {}, mintToken({ sub: "attacker-subject-never-seen", email: mine.email }));
    assert.equal(res.status, 401, "email must not be usable as an alternative identity");
  });

  test("a valid token is accepted", { skip }, async () => {
    assert.equal((await call("/crm/dashboard", {}, token)).status, 200);
  });
});

describe("organisation boundary", () => {
  test("another organisation's lead cannot be read", { skip }, async () => {
    assert.equal((await call(`/crm/leads/${rival.lead}`, {}, token)).status, 404);
  });

  test("a lead cannot be attached to another organisation's company", { skip }, async () => {
    const res = await call("/crm/leads", { method: "POST", body: JSON.stringify({ title: "probe", companyId: rival.company }) }, token);
    assert.equal(res.status, 400);
    assert.match((await res.json()).message, /company/);
  });

  test("an opportunity cannot be attached to another organisation's company or lead", { skip }, async () => {
    const res = await call("/crm/opportunities", { method: "POST", body: JSON.stringify({ name: "probe", value: 1000, companyId: rival.company, leadId: rival.lead }) }, token);
    assert.equal(res.status, 400);
  });

  test("a document cannot be filed against another organisation's project", { skip }, async () => {
    const res = await call("/documents", { method: "POST", body: JSON.stringify({ title: "probe", category: "DRAWING", projectId: rival.project }) }, token);
    assert.ok(res.status === 400 || res.status === 404, `expected rejection, got ${res.status}`);
  });

  test("listing never returns another organisation's records", { skip }, async () => {
    const leads = await (await call("/crm/leads", {}, token)).json();
    assert.ok(Array.isArray(leads));
    assert.ok(!leads.some((l) => l.id === rival.lead), "a rival lead appeared in the list");
    assert.ok(leads.every((l) => l.organisationId === mine.orgId), "a record from another organisation was returned");
  });
});
