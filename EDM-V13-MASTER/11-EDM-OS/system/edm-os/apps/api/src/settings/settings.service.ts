import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { DEFAULT_ORG_CONFIG, OrgConfig } from "../config/org-config";

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  // Returns the org's config, creating a defaults row the first time.
  async getOrCreate(orgId: string): Promise<OrgConfig> {
    const existing = await this.prisma.organisationSettings.findUnique({ where: { organisationId: orgId } });
    if (existing) return existing.config as unknown as OrgConfig;
    const created = await this.prisma.organisationSettings.create({
      data: { organisationId: orgId, config: DEFAULT_ORG_CONFIG as unknown as object },
    });
    return created.config as unknown as OrgConfig;
  }

  // Shallow-merge a patch into the config (e.g. toggle a feature, edit trades).
  async update(orgId: string, patch: Partial<OrgConfig>): Promise<OrgConfig> {
    const current = await this.getOrCreate(orgId);
    const next = { ...current, ...patch } as OrgConfig;
    const saved = await this.prisma.organisationSettings.update({
      where: { organisationId: orgId },
      data: { config: next as unknown as object },
    });
    return saved.config as unknown as OrgConfig;
  }
}
