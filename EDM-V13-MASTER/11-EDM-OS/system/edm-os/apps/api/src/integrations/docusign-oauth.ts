// DocuSign OAuth2 (Authorization Code Grant). Pure builders; HTTP lives in the
// service. The token endpoint uses HTTP Basic auth with the integration key and
// secret; userinfo then yields the account id and per-account API base URI.

export type DocuSignConfig = { clientId: string; clientSecret: string; redirectUri: string };

export const DS_SCOPES = ["signature"];
export const DS_AUTHORIZE_URL = "https://account.docusign.com/oauth/auth";
export const DS_TOKEN_URL = "https://account.docusign.com/oauth/token";
export const DS_USERINFO_URL = "https://account.docusign.com/oauth/userinfo";

export function docusignConfigFromEnv(): DocuSignConfig {
  const { DOCUSIGN_CLIENT_ID, DOCUSIGN_CLIENT_SECRET, DOCUSIGN_REDIRECT_URI } = process.env;
  if (!DOCUSIGN_CLIENT_ID || !DOCUSIGN_CLIENT_SECRET || !DOCUSIGN_REDIRECT_URI) {
    throw new Error("DocuSign integration not configured: set DOCUSIGN_CLIENT_ID, DOCUSIGN_CLIENT_SECRET, DOCUSIGN_REDIRECT_URI");
  }
  return { clientId: DOCUSIGN_CLIENT_ID, clientSecret: DOCUSIGN_CLIENT_SECRET, redirectUri: DOCUSIGN_REDIRECT_URI };
}

export function buildAuthUrl(cfg: DocuSignConfig, state: string): string {
  const p = new URLSearchParams({
    response_type: "code",
    scope: DS_SCOPES.join(" "),
    client_id: cfg.clientId,
    redirect_uri: cfg.redirectUri,
    state,
  });
  return `${DS_AUTHORIZE_URL}?${p.toString()}`;
}

export function basicAuthHeader(cfg: DocuSignConfig): string {
  return `Basic ${Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64")}`;
}

export function tokenRequest(cfg: DocuSignConfig, opts: { code?: string; refreshToken?: string }): { url: string; headers: Record<string, string>; body: URLSearchParams } {
  const body = new URLSearchParams();
  if (opts.refreshToken) {
    body.set("grant_type", "refresh_token");
    body.set("refresh_token", opts.refreshToken);
  } else {
    body.set("grant_type", "authorization_code");
    body.set("code", opts.code ?? "");
  }
  return { url: DS_TOKEN_URL, headers: { Authorization: basicAuthHeader(cfg), "Content-Type": "application/x-www-form-urlencoded" }, body };
}
