import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { docusignConfigFromEnv, buildAuthUrl, tokenRequest, DS_USERINFO_URL } from "./docusign-oauth";
import { toEnvelope, EnvelopeInput } from "./docusign-mapping";
import { encryptToken, decryptToken } from "../common/crypto";

@Injectable()
export class DocuSignService {
  constructor(private prisma: PrismaService) {}

  getAuthUrl(orgId: string) {
    return { url: buildAuthUrl(docusignConfigFromEnv(), orgId) };
  }

  // Exchange the code, then read the default account id + API base URI from userinfo.
  async handleCallback(orgId: string, code: string) {
    const cfg = docusignConfigFromEnv();
    const { url, headers, body } = tokenRequest(cfg, { code });
    const res = await fetch(url, { method: "POST", headers, body });
    if (!res.ok) throw new Error(`DocuSign token exchange failed: ${res.status}`);
    const tok = (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number };

    const info = await fetch(DS_USERINFO_URL, { headers: { Authorization: `Bearer ${tok.access_token}` } });
    const userinfo = info.ok ? ((await info.json()) as { accounts: { account_id: string; account_name: string; base_uri: string; is_default: boolean }[] }) : { accounts: [] };
    const account = userinfo.accounts.find((a) => a.is_default) ?? userinfo.accounts[0];

    return this.prisma.integrationConnection.upsert({
      where: { organisationId_provider: { organisationId: orgId, provider: "DOCUSIGN" } },
      create: { organisationId: orgId, provider: "DOCUSIGN", status: "CONNECTED", accountEmail: account?.account_name, externalTenantId: account?.account_id, apiBaseUrl: account ? `${account.base_uri}/restapi` : null, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt: new Date(Date.now() + tok.expires_in * 1000) },
      update: { status: "CONNECTED", accountEmail: account?.account_name, externalTenantId: account?.account_id, apiBaseUrl: account ? `${account.base_uri}/restapi` : null, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt: new Date(Date.now() + tok.expires_in * 1000) },
      select: { provider: true, status: true, accountEmail: true },
    });
  }

  async disconnect(orgId: string) {
    await this.prisma.integrationConnection.updateMany({
      where: { organisationId: orgId, provider: "DOCUSIGN" },
      data: { status: "DISCONNECTED", accessToken: null, refreshToken: null, externalTenantId: null, apiBaseUrl: null },
    });
    return { ok: true };
  }

  // Send a document out for signature (subcontract, transmittal sign-off).
  async sendEnvelope(orgId: string, input: EnvelopeInput) {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organisationId_provider: { organisationId: orgId, provider: "DOCUSIGN" } },
    });
    if (!conn || conn.status !== "CONNECTED" || !conn.accessToken || !conn.externalTenantId || !conn.apiBaseUrl) throw new Error("DocuSign is not connected");

    const envelope = toEnvelope(input);
    const res = await fetch(`${conn.apiBaseUrl}/v2.1/accounts/${conn.externalTenantId}/envelopes`, {
      method: "POST",
      headers: { Authorization: `Bearer ${decryptToken(conn.accessToken)}`, "Content-Type": "application/json" },
      body: JSON.stringify(envelope),
    });
    if (!res.ok) throw new Error(`DocuSign envelope failed: ${res.status}`);
    await this.prisma.integrationConnection.update({
      where: { organisationId_provider: { organisationId: orgId, provider: "DOCUSIGN" } },
      data: { lastSyncedAt: new Date() },
    });
    return res.json();
  }
}
