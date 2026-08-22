import { Controller, Get, Query } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.FINANCIALS)
@Controller("finance/reconciliation")
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}
  @Get() reconciliation(@CurrentUser() u: AuthContext, @Query("projectId") projectId: string) { return this.finance.reconciliation(u.organisationId, projectId); }
}
