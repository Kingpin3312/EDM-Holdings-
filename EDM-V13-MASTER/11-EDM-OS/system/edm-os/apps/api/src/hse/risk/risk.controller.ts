import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { RiskService } from "./risk.service";
import { CreateRiskDto } from "./dto/create-risk.dto";
import { UpdateRiskDto } from "./dto/update-risk.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER] as const;

@Feature(Features.HSE)
@Controller("hse/risk-assessments")
export class RiskController {
  constructor(private readonly risk: RiskService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.risk.list(u.organisationId, projectId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.risk.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateRiskDto) { return this.risk.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateRiskDto) { return this.risk.update(u.organisationId, id, dto); }
}
