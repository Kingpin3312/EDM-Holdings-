import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { RolesGuard } from "./common/roles.guard";
import { FeatureGuard } from "./common/feature.guard";
import { SettingsModule } from "./settings/settings.module";
import { TendersModule } from "./tenders/tenders.module";
import { ProjectsModule } from "./projects/projects.module";
import { SiteModule } from "./site/site.module";
import { LabourModule } from "./labour/labour.controller";
import { VariationsModule } from "./variations/variations.module";
import { RfisModule } from "./rfis/rfis.module";
import { QualityModule } from "./quality/quality.module";
import { HseModule } from "./hse/hse.module";
import { ProcurementModule } from "./procurement/procurement.module";
import { DocumentsModule } from "./documents/documents.module";
import { TradesModule } from "./trades/trades.module";
import { FinanceModule } from "./finance/finance.module";
import { CrmModule } from "./crm/crm.module";
import { EstimatingModule } from "./estimating/estimating.module";
import { IntegrationsModule } from "./integrations/integrations.controller";
import { HealthController } from "./health/health.controller";

@Module({
  imports: [PrismaModule, AuthModule, SettingsModule, CrmModule, EstimatingModule, TendersModule, ProjectsModule, SiteModule, LabourModule, VariationsModule, RfisModule, QualityModule, HseModule, ProcurementModule, DocumentsModule, TradesModule, FinanceModule, IntegrationsModule],
  controllers: [HealthController],
  providers: [
    // Auth + RBAC applied globally; routes opt out with @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    // Feature flags run after auth so the org context is available.
    { provide: APP_GUARD, useClass: FeatureGuard },
  ],
})
export class AppModule {}
