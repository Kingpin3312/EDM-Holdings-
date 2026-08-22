// Standard tenant-scoping helper. Use in every service query so the
// organisation boundary is applied consistently and never forgotten.
//   this.prisma.tender.findMany({ where: tenantWhere(orgId, { status }) })
export const tenantWhere = <T extends object>(organisationId: string, extra?: T) =>
  ({ organisationId, ...(extra ?? {}) });
