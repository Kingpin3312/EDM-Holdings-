// Microsoft identity platform (v2.0) OAuth helpers. Pure URL/payload builders —
// the actual HTTP calls live in the service. Tenant is usually "common" (any
// work/school account) or your specific tenant id.

export type MsConfig = { clientId: string; clientSecret: string; tenant: string; redirectUri: string };

// Least-privilege scopes for what we actually use: calendar write (sync), mail
// read (log client emails), files write (document storage on OneDrive/SharePoint),
// profile, and a refresh token.
export const MS_SCOPES = ["offline_access", "User.Read", "Calendars.ReadWrite", "Mail.Read", "Files.ReadWrite"];

const authority = (tenant: string) => `https://login.microsoftonline.com/${tenant}/oauth2/v2.0`;

export function msConfigFromEnv(): MsConfig {
  const { MS_CLIENT_ID, MS_CLIENT_SECRET, MS_TENANT_ID, MS_REDIRECT_URI } = process.env;
  if (!MS_CLIENT_ID || !MS_CLIENT_SECRET || !MS_REDIRECT_URI) {
    throw new Error("Microsoft integration not configured: set MS_CLIENT_ID, MS_CLIENT_SECRET, MS_REDIRECT_URI");
  }
  return { clientId: MS_CLIENT_ID, clientSecret: MS_CLIENT_SECRET, tenant: MS_TENANT_ID || "common", redirectUri: MS_REDIRECT_URI };
}

// Where we send the user to grant access. `state` ties the callback back to the org.
export function buildAuthUrl(cfg: MsConfig, state: string): string {
  const p = new URLSearchParams({
    client_id: cfg.clientId,
    response_type: "code",
    redirect_uri: cfg.redirectUri,
    response_mode: "query",
    scope: MS_SCOPES.join(" "),
    state,
  });
  return `${authority(cfg.tenant)}/authorize?${p.toString()}`;
}

// The token-exchange request (used by the service with fetch). Same shape works
// for the initial code grant and, with grant_type=refresh_token, for refreshes.
export function tokenRequest(cfg: MsConfig, opts: { code?: string; refreshToken?: string }): { url: string; body: URLSearchParams } {
  const body = new URLSearchParams({
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: cfg.redirectUri,
    scope: MS_SCOPES.join(" "),
  });
  if (opts.refreshToken) {
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", opts.refreshToken);
  } else {
    body.set("grant_type", "authorization_code");
    body.set("code", opts.code ?? "");
  }
  return { url: `${authority(cfg.tenant)}/token`, body };
}

export const GRAPH_EVENTS_ENDPOINT = "https://graph.microsoft.com/v1.0/me/events";
