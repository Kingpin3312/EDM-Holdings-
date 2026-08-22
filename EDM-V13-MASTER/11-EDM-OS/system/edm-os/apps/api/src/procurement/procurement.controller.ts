import { Controller, Get, Query } from "@nestjs/common";
import { ProcurementService } from "./procurement.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.PROCUREMENT)
@Controller("procurement/dashboard")
export class ProcurementController {
  constructor(private readonly procurement: ProcurementService) {}
  @Get() summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.procurement.summary(u.organisationId, projectId); }
}
