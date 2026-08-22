import { BadRequestException } from "@nestjs/common";
import type { PrismaService } from "../prisma/prisma.service";

// Standard tenant-scoping helper. Use in every service query so the
// organisation boundary is applied consistently and never forgotten.
//   this.prisma.tender.findMany({ where: tenantWhere(orgId, { status }) })
export const tenantWhere = <T extends object>(organisationId: string, extra?: T) =>
  ({ organisationId, ...(extra ?? {}) });

// Models that carry organisationId directly and can therefore be ownership-checked
// by this helper. Adding a model here is all that is needed to guard a new relation.
type OwnedModel =
  | "company" | "contact" | "lead" | "opportunity" | "project" | "tender"
  | "estimate" | "user" | "supplier" | "costCode" | "costItem" | "variation" | "rfi";

// Confirms every related record named in a request body belongs to the caller's
// organisation, BEFORE it is connected. Without this a user can attach their own
// record to another organisation's company or project, and read its name back out
// through the `include` on the next list call.
//
//   await assertOwned(this.prisma, orgId, { company: dto.companyId, lead: dto.leadId });
//
// Ids that are undefined or null are skipped, so it is safe to pass optional fields.
export async function assertOwned(
  prisma: PrismaService,
  organisationId: string,
  refs: Partial<Record<OwnedModel, string | null | undefined>>,
): Promise<void> {
  const pending = Object.entries(refs).filter(([, id]) => typeof id === "string" && id.length > 0) as [OwnedModel, string][];
  if (!pending.length) return;

  const misses: string[] = [];
  await Promise.all(
    pending.map(async ([model, id]) => {
      // Contact has no organisationId of its own — it is scoped through its company.
      const where =
        model === "contact"
          ? { id, company: { organisationId } }
          : { id, organisationId };
      const found = await (prisma as any)[model].findFirst({ where, select: { id: true } });
      if (!found) misses.push(model);
    }),
  );

  if (misses.length) {
    throw new BadRequestException(
      `Not found in your organisation: ${misses.sort().join(", ")}`,
    );
  }
}
