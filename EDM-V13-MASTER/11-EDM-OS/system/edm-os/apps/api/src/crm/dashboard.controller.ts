import { Controller, Get, Query } from "@nestjs/common";
import { CrmDashboardService } from "./dashboard.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.CRM)
@Controller("crm/dashboard")
export class CrmDashboardController {
  constructor(private readonly dashboard: CrmDashboardService) {}
  @Get() summary(@CurrentUser() u: AuthContext) { return this.dashboard.summary(u.organisationId); }
  @Get("analytics") analytics(@CurrentUser() u: AuthContext) { return this.dashboard.analytics(u.organisationId); }
  @Get("agenda") agenda(@CurrentUser() u: AuthContext) { return this.dashboard.agenda(u.organisationId); }
  @Get("forecast") forecast(@CurrentUser() u: AuthContext, @Query("capacity") capacity?: string) { return this.dashboard.forecast(u.organisationId, capacity ? Number(capacity) : undefined); }
  @Get("accounts") accounts(@CurrentUser() u: AuthContext) { return this.dashboard.accounts(u.organisationId); }
  @Get("estimators") estimators(@CurrentUser() u: AuthContext) { return this.dashboard.estimators(u.organisationId); }
}
