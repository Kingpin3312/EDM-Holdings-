import { Controller, Get, Query } from "@nestjs/common";
import { HseService } from "./hse.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.HSE)
@Controller("hse/dashboard")
export class HseController {
  constructor(private readonly hse: HseService) {}
  @Get() summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.hse.summary(u.organisationId, projectId); }
}
