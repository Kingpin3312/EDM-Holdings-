import { Controller, Get, Query } from "@nestjs/common";
import { QualityService } from "./quality.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.QUALITY)
@Controller("quality/dashboard")
export class QualityController {
  constructor(private readonly quality: QualityService) {}
  @Get() summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.quality.summary(u.organisationId, projectId); }
}
