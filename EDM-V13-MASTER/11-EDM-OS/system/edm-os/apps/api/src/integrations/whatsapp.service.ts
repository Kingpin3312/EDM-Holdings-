import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { toWhatsAppTemplate, WhatsAppAlertInput } from "./whatsapp";
import { encryptToken, decryptToken } from "../common/crypto";

const GRAPH_VERSION = "v18.0";

@Injectable()
export class WhatsAppService {
  constructor(private prisma: PrismaService) {}

  // WhatsApp uses a permanent token + phone number id rather than an OAuth
  // redirect, so connecting means storing those credentials.
  async connect(orgId: string, input: { phoneNumberId: string; accessToken: string; businessName?: string }) {
    return this.prisma.integrationConnection.upsert({
      where: { organisationId_provider: { organisationId: orgId, provider: "WHATSAPP" } },
      create: { organisationId: orgId, provider: "WHATSAPP", status: "CONNECTED", externalTenantId: input.phoneNumberId, accessToken: encryptToken(input.accessToken), accountEmail: input.businessName },
      update: { status: "CONNECTED", externalTenantId: input.phoneNumberId, accessToken: encryptToken(input.accessToken), accountEmail: input.businessName },
      select: { provider: true, status: true, accountEmail: true },
    });
  }

  async disconnect(orgId: string) {
    await this.prisma.integrationConnection.updateMany({
      where: { organisationId: orgId, provider: "WHATSAPP" },
      data: { status: "DISCONNECTED", accessToken: null, externalTenantId: null },
    });
    return { ok: true };
  }

  // Send a proactive template alert (bid deadline, follow-up, task) to a number.
  async sendAlert(orgId: string, alert: WhatsAppAlertInput, to: string, languageCode = "en") {
    const conn = await this.prisma.integrationConnection.findUnique({
      where: { organisationId_provider: { organisationId: orgId, provider: "WHATSAPP" } },
    });
    if (!conn || conn.status !== "CONNECTED" || !conn.accessToken || !conn.externalTenantId) throw new Error("WhatsApp is not connected");

    const message = toWhatsAppTemplate(alert, to, { languageCode });
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${conn.externalTenantId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${decryptToken(conn.accessToken)}`, "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error(`WhatsApp send failed: ${res.status}`);
    await this.prisma.integrationConnection.update({
      where: { organisationId_provider: { organisationId: orgId, provider: "WHATSAPP" } },
      data: { lastSyncedAt: new Date() },
    });
    return res.json();
  }
}
