// Typed client for the EDM OS API. This is the bridge from the mock data in
// `lib/data.ts` to live data served by `apps/api`.
//
// The screens currently render from `lib/data.ts` so the prototype works with
// no backend. To make a screen live, fetch here instead. Example — the
// follow-ups page (a server component):
//
//   import { apiGet } from "@/lib/api";
//   const agenda = await apiGet("/crm/dashboard/agenda", token);
//   // ...render `agenda.bidDeadlines` etc. instead of `crmAgenda`
//
// Locally, get `token` from `node scripts/dev-token.mjs`. In production it comes
// from the signed-in Supabase session (see DEPLOYMENT.md → Auth).

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiGet<T = unknown>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} on ${path}`);
  return res.json() as Promise<T>;
}

export async function apiSend<T = unknown>(
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status} ${res.statusText} on ${path}`);
  return res.json() as Promise<T>;
}
