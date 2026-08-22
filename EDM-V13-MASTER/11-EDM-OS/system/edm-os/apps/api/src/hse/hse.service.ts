import { Injectable } from "@nestjs/common";
import { IncidentType, Severity } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";

@Injectable()
export class HseService {
  constructor(private prisma: PrismaService) {}

  async summary(orgId: string, projectId?: string) {
    const where = tenantWhere(orgId, projectId ? { projectId } : {});
    const [byType, lostTime, nearMiss, talks, talkAttendees, highRisk] = await Promise.all([
      this.prisma.incident.groupBy({ by: ["type"], where, _count: true }),
      this.prisma.incident.count({ where: { ...where, type: IncidentType.LOST_TIME } }),
      this.prisma.incident.count({ where: { ...where, type: IncidentType.NEAR_MISS } }),
      this.prisma.toolboxTalk.count({ where }),
      this.prisma.toolboxTalk.aggregate({ where, _sum: { attendees: true } }),
      this.prisma.riskAssessment.count({ where: { ...where, residualRisk: { in: [Severity.HIGH, Severity.CRITICAL] } } }),
    ]);
    const incidentsByType: Record<string, number> = {};
    let totalIncidents = 0;
    for (const g of byType) { incidentsByType[g.type] = g._count; totalIncidents += g._count; }
    return {
      incidents: { total: totalIncidents, byType: incidentsByType, lostTime, nearMiss },
      toolboxTalks: { count: talks, attendees: talkAttendees._sum.attendees ?? 0 },
      riskAssessments: { highResidual: highRisk },
    };
  }
}
