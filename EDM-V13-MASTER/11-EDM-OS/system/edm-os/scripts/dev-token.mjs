// Mint a local dev access token the API will accept — no Supabase needed.
//
// The API verifies a JWT signed with SUPABASE_JWT_SECRET and maps the token to
// an EDM user by `email` (see apps/api/src/auth/jwt.strategy.ts). This script
// signs an HS256 token for the seeded owner so you can call protected routes.
//
// Usage:
//   SUPABASE_JWT_SECRET=dev-secret node scripts/dev-token.mjs
//   TOKEN=$(SUPABASE_JWT_SECRET=dev-secret node scripts/dev-token.mjs)
//   curl localhost:4000/api/v1/crm/dashboard/agenda -H "Authorization: Bearer $TOKEN"
//
// Pass a different email as the first argument to impersonate another seeded user.

import crypto from "node:crypto";

const secret = process.env.SUPABASE_JWT_SECRET || "dev-secret";
const email = process.argv[2] || process.env.SEED_USER_EMAIL || "damien@edmholdings.ae";

const b64url = (input) =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const now = Math.floor(Date.now() / 1000);
const header = { alg: "HS256", typ: "JWT" };
const payload = { sub: "dev-local-user", email, role: "authenticated", iat: now, exp: now + 60 * 60 * 24 };

const data = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(payload))}`;
const signature = b64url(crypto.createHmac("sha256", secret).update(data).digest());

process.stderr.write(`Dev token for ${email} — valid 24h, signed with SUPABASE_JWT_SECRET ("${secret}").\n`);
process.stdout.write(`${data}.${signature}\n`);
