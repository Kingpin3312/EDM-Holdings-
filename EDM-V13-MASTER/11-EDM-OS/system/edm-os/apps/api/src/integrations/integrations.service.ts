import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { buildAuthUrl, tokenRequest, msConfigFromEnv, GRAPH_EVENTS_ENDPOINT } from "./microsoft-oauth";
import { toGraphEvent, EdmCalendarItem } from "./graph-calendar";
import { encryptToken, decryptToken } from "../common/crypto";

@Injectable()
export class IntegrationsService {
  constructor(private prisma: PrismaService) {}

  // Status of every provider for this org (never returns tokens).
  list(orgId: string) {
    return this.prisma.integrationConnection.findMany({
      where: { organisationId: orgId },
      select: { provider: true, status: true, accountEmail: true, lastSyncedAt: true, updatedAt: true },
    });
  }

  getMicrosoftAuthUrl(orgId: string) {
    return { url: buildAuthUrl(msConfigFromEnv(), orgId) };
  }

  // Exchange the auth code for tokens, read the account email, and store the connection.
  async handleMicrosoftCallback(orgId: string, code: string) {
    const cfg = msConfigFromEnv();
    const { url, body } = tokenRequest(cfg, { code });
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
    if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status}`);
    const tok = (await res.json()) as { access_token: string; refresh_token?: string; expires_in: number; scope?: string };

    const me = await fetch("https://graph.microsoft.com/v1.0/me", { headers: { Authorization: `Bearer ${tok.access_token}` } });
    const profile = me.ok ? ((await me.json()) as { mail?: string; userPrincipalName?: string }) : {};
    const accountEmail = profile.mail ?? profile.userPrincipalName ?? null;
    const expiresAt = new Date(Date.now() + tok.expires_in * 1000);

    return this.prisma.integrationConnection.upsert({
      where: { organisationId_provider: { organisationId: orgId, provider: "MICROSOFT" } },
      create: { organisationId: orgId, provider: "MICROSOFT", status: "CONNECTED", accountEmail, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt, scopes: tok.scope },
      update: { status: "CONNECTED", accountEmail, accessToken: encryptToken(tok.access_token), refreshToken: encryptToken(tok.refresh_token), expiresAt, scopes: tok.scope },
      select: { provider: true, status: true, accountEmail: true },
    });
  }

  async disconnectMicrosoft(orgId: string) {
    await this.prisma.integrationConnection.updateMany({
      where: { organisationId: orgId, provider: "MICROSOFT" },
      data: { status: "DISCONNECTED", accessToken: null, refreshToken: null, expiresAt: null },
    });
    return { ok: true };
  }

  // Push a set of EDM calendar items to the connected account's Graph calendar.
  // transactionId on each event makes re-syncing idempotent (no duplicates).
  async syncCalendar(orgId: string, items: EdmCalendarItem[], timeZone = "Asia/Dubai") {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organisationId_provider: { organisationId: orgId, provider: "MICROSOFT" } },
    });
    if (!conn || conn.status !== "CONNECTED" || !conn.accessToken) throw new Error("Microsoft account is not connected");

    const appBaseUrl = process.env.WEB_BASE_URL ?? process.env.CORS_ORIGIN ?? "";
    let synced = 0;
    for (const item of items) {
      const event = toGraphEvent(item, { timeZone, appBaseUrl });
      const res = await fetch(GRAPH_EVENTS_ENDPOINT, {
        method: "POST",
        headers: { Authorization: `Bearer ${decryptToken(conn.accessToken)}`, "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (res.ok) synced++;
    }
    await this.prisma.integrationConnection.update({
      where: { organisationId_provider: { organisationId: orgId, provider: "MICROSOFT" } },
      data: { lastSyncedAt: new Date() },
    });
    return { synced, total: items.length };
  }
}
