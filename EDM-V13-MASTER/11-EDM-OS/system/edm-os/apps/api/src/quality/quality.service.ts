import { Injectable } from "@nestjs/common";
import { SnagStatus, NcrStatus, InspectionResult, Severity } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";

@Injectable()
export class QualityService {
  constructor(private prisma: PrismaService) {}

  async summary(orgId: string, projectId?: string) {
    const orgWhere = tenantWhere(orgId, projectId ? { projectId } : {});
    const projWhere = { project: { organisationId: orgId }, ...(projectId ? { projectId } : {}) };
    const [openSnags, closedSnags, openNcrs, criticalNcrs, inspTotal, inspPass] = await Promise.all([
      this.prisma.snag.count({ where: { ...projWhere, status: { not: SnagStatus.CLOSED } } }),
      this.prisma.snag.count({ where: { ...projWhere, status: SnagStatus.CLOSED } }),
      this.prisma.ncr.count({ where: { ...orgWhere, status: { not: NcrStatus.CLOSED } } }),
      this.prisma.ncr.count({ where: { ...orgWhere, status: { not: NcrStatus.CLOSED }, severity: { in: [Severity.HIGH, Severity.CRITICAL] } } }),
      this.prisma.inspection.count({ where: { ...orgWhere, result: { not: InspectionResult.PENDING } } }),
      this.prisma.inspection.count({ where: { ...orgWhere, result: { in: [InspectionResult.PASS, InspectionResult.PASS_WITH_COMMENTS] } } }),
    ]);
    return {
      snags: { open: openSnags, closed: closedSnags },
      ncrs: { open: openNcrs, critical: criticalNcrs },
      inspections: { completed: inspTotal, passed: inspPass, passRate: inspTotal > 0 ? Math.round((inspPass / inspTotal) * 100) : null },
    };
  }
}
