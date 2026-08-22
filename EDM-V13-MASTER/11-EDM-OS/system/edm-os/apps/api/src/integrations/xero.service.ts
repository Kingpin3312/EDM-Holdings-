import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { xeroConfigFromEnv, buildAuthUrl, tokenRequest, XERO_CONNECTIONS_URL, XERO_API_BASE } from "./xero-oauth";
import { toXeroContact, toXeroInvoice, XeroContactInput, XeroInvoiceInput } from "./xero-mapping";
import { encryptToken, decryptToken } from "../common/crypto";

@Injectable()
export class XeroService {
  constructor(private prisma: PrismaService) {}

  getAuthUrl(orgId: string) {
    return { url: buildAuthUrl(xeroConfigFromEnv(), orgId) };
  }

  // Exchange the code, then read the Xero tenant (organisation) id and store it.
  async handleCallback(orgId: string, code: string) {
    const cfg = xeroConfigFromEnv();
    const { url, headers, body } = tokenRequest(cfg, { code });
    const res = await fetch(url, { method: "POST", headers, body });
    if (!res.ok) throw new Error(`Xero token exchange failed: ${res.status}`);
    const tok = (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number; scope?: string };

    const conns = await fetch(XERO_CONNECTIONS_URL, { headers: { Authorization: `Bearer ${tok.access_token}`, Accept: "application/json" } });
    const tenants = conns.ok ? ((await conns.json()) as { tenantId: string; tenantName: string }[]) : [];
    const tenant = tenants[0];

    return this.prisma.integrationConnection.upsert({
      where: { organisationId_provider: { organisationId: orgId, provider: "XERO" } },
      create: { organisationId: orgId, provider: "XERO", status: "CONNECTED", accountEmail: tenant?.tenantName, externalTenantId: tenant?.tenantId, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt: new Date(Date.now() + tok.expires_in * 1000), scopes: tok.scope },
      update: { status: "CONNECTED", accountEmail: tenant?.tenantName, externalTenantId: tenant?.tenantId, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt: new Date(Date.now() + tok.expires_in * 1000), scopes: tok.scope },
      select: { provider: true, status: true, accountEmail: true },
    });
  }

  private async connection(orgId: string) {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organisationId_provider: { organisationId: orgId, provider: "XERO" } },
    });
    if (!conn || conn.status !== "CONNECTED" || !conn.accessToken || !conn.externalTenantId) throw new Error("Xero is not connected");
    return conn;
  }

  private headers(accessToken: string, tenantId: string) {
    return { Authorization: `Bearer ${decryptToken(accessToken)}`, "Xero-tenant-id": tenantId, "Content-Type": "application/json", Accept: "application/json" };
  }

  async syncContact(orgId: string, input: XeroContactInput) {
    const conn = await this.connection(orgId);
    const res = await fetch(`${XERO_API_BASE}/Contacts`, { method: "POST", headers: this.headers(conn.accessToken!, conn.externalTenantId!), body: JSON.stringify({ Contacts: [toXeroContact(input)] }) });
    if (!res.ok) throw new Error(`Xero contact sync failed: ${res.status}`);
    return res.json();
  }

  // Create a DRAFT sales invoice from a won opportunity. Draft, so it's reviewed
  // and approved in Xero before anything reaches the client.
  async createInvoiceFromOpportunity(orgId: string, input: XeroInvoiceInput, date = new Date().toISOString().slice(0, 10)) {
    const conn = await this.connection(orgId);
    const invoice = toXeroInvoice(input, { date });
    const res = await fetch(`${XERO_API_BASE}/Invoices`, { method: "POST", headers: this.headers(conn.accessToken!, conn.externalTenantId!), body: JSON.stringify({ Invoices: [invoice] }) });
    if (!res.ok) throw new Error(`Xero invoice creation failed: ${res.status}`);
    await this.prisma.integrationConnection.update({
      where: { organisationId_provider: { organisationId: orgId, provider: "XERO" } },
      data: { lastSyncedAt: new Date() },
    });
    return res.json();
  }
}
