// EDM OS — API smoke test.
// Run this AFTER the stack is up (see RUNBOOK.md). It mints a dev token, hits
// the health + CRM endpoints, and walks the won-bid → project handoff, asserting
// each step. Zero dependencies (Node 18+ for global fetch).
//
//   docker compose up --build          # in one terminal
//   SUPABASE_JWT_SECRET=dev-secret node scripts/smoke-test.mjs
//
// Override the base URL with API_URL (default http://localhost:4000).

import crypto from "node:crypto";

const BASE = process.env.API_URL || "http://localhost:4000";
const SECRET = process.env.SUPABASE_JWT_SECRET || "dev-secret";
const EMAIL = process.env.SEED_USER_EMAIL || "damien@edmholdings.ae";

const b64url = (i) => Buffer.from(i).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
function devToken() {
  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const p = b64url(JSON.stringify({ sub: "smoke-test", email: EMAIL, role: "authenticated", iat: now, exp: now + 3600 }));
  const s = b64url(crypto.createHmac("sha256", SECRET).update(`${h}.${p}`).digest());
  return `${h}.${p}.${s}`;
}

const TOKEN = devToken();
const auth = { Authorization: `Bearer ${TOKEN}` };
let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => { if (cond) { console.log(`  PASS  ${name}`); pass++; } else { console.log(`  FAIL  ${name}  ${detail}`); fail++; } };

async function get(path, withAuth = true) {
  const res = await fetch(`${BASE}/api/v1${path}`, { headers: withAuth ? auth : {} });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json };
}
async function post(path, body) {
  const res = await fetch(`${BASE}/api/v1${path}`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json };
}

async function main() {
  console.log(`Smoke testing ${BASE} as ${EMAIL}\n`);

  const health = await get("/health", false);
  ok("GET /health → 200", health.status === 200, `got ${health.status}`);

  const noauth = await get("/crm/dashboard/summary", false);
  ok("GET /crm/dashboard/summary without token → 401", noauth.status === 401, `got ${noauth.status} (auth should be enforced)`);

  const agenda = await get("/crm/dashboard/agenda");
  ok("GET /crm/dashboard/agenda → 200 + bidDeadlines[]", agenda.status === 200 && Array.isArray(agenda.json?.bidDeadlines), `got ${agenda.status}`);

  const analytics = await get("/crm/dashboard/analytics");
  ok("GET /crm/dashboard/analytics → winRatePct number", analytics.status === 200 && typeof analytics.json?.winRatePct === "number", `got ${analytics.status}`);

  const opps = await get("/crm/opportunities");
  const list = Array.isArray(opps.json) ? opps.json : opps.json?.data ?? [];
  ok("GET /crm/opportunities → non-empty list", opps.status === 200 && list.length > 0, `got ${opps.status}, ${list.length} items`);

  const open = list.find((o) => o.status === "OPEN") ?? list[0];
  if (!open) { ok("convert chain", false, "no opportunity to convert"); }
  else {
    const conv = await post(`/crm/opportunities/${open.id}/convert-to-project`, { emirate: "Dubai" });
    const code = conv.json?.code;
    ok("POST /crm/opportunities/:id/convert-to-project → project with code", conv.status >= 200 && conv.status < 300 && !!code, `got ${conv.status}`);

    const projects = await get("/projects");
    const plist = Array.isArray(projects.json) ? projects.json : projects.json?.data ?? [];
    ok("GET /projects → contains the converted project", plist.some((p) => p.code === code), `looking for ${code}`);
  }

  console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("Smoke test error:", e.message); process.exit(1); });
