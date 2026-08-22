import { cookies } from "next/headers";

// Resolves the bearer token the web uses to call the API, server-side.
// Production: the signed-in Supabase session sets an `edm_token` cookie.
// Local/server-to-server: set EDM_API_TOKEN (e.g. from `scripts/dev-token.mjs`).
// Returns undefined when neither is present — callers then fall back to mock data.
export function getApiToken(): string | undefined {
  try {
    const fromCookie = cookies().get("edm_token")?.value;
    if (fromCookie) return fromCookie;
  } catch {
    // cookies() is unavailable outside a request scope (e.g. at build time).
  }
  return process.env.EDM_API_TOKEN || undefined;
}
