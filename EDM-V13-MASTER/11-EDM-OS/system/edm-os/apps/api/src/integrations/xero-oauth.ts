// Xero OAuth2 helpers (authorization code flow). Pure builders; the HTTP calls
// live in the service. Xero's token endpoint uses HTTP Basic auth for the client
// credentials, with the grant details in the body.

export type XeroConfig = { clientId: string; clientSecret: string; redirectUri: string };

export const XERO_SCOPES = ["offline_access", "openid", "profile", "email", "accounting.transactions", "accounting.contacts"];

export const XERO_AUTHORIZE_URL = "https://login.xero.com/identity/connect/authorize";
export const XERO_TOKEN_URL = "https://identity.xero.com/connect/token";
export const XERO_CONNECTIONS_URL = "https://api.xero.com/connections";
export const XERO_API_BASE = "https://api.xero.com/api.xro/2.0";

export function xeroConfigFromEnv(): XeroConfig {
  const { XERO_CLIENT_ID, XERO_CLIENT_SECRET, XERO_REDIRECT_URI } = process.env;
  if (!XERO_CLIENT_ID || !XERO_CLIENT_SECRET || !XERO_REDIRECT_URI) {
    throw new Error("Xero integration not configured: set XERO_CLIENT_ID, XERO_CLIENT_SECRET, XERO_REDIRECT_URI");
  }
  return { clientId: XERO_CLIENT_ID, clientSecret: XERO_CLIENT_SECRET, redirectUri: XERO_REDIRECT_URI };
}

export function buildAuthUrl(cfg: XeroConfig, state: string): string {
  const p = new URLSearchParams({
    response_type: "code",
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    scope: XERO_SCOPES.join(" "),
    state,
  });
  return `${XERO_AUTHORIZE_URL}?${p.toString()}`;
}

export function basicAuthHeader(cfg: XeroConfig): string {
  return `Basic ${Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64")}`;
}

export function tokenRequest(cfg: XeroConfig, opts: { code?: string; refreshToken?: string }): { url: string; headers: Record<string, string>; body: URLSearchParams } {
  const body = new URLSearchParams();
  if (opts.refreshToken) {
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", opts.refreshToken);
  } else {
    body.set("grant_type", "authorization_code");
    body.set("code", opts.code ?? "");
    body.set("redirect_uri", cfg.redirectUri);
  }
  return { url: XERO_TOKEN_URL, headers: { Authorization: basicAuthHeader(cfg), "Content-Type": "application/x-www-form-urlencoded" }, body };
}
