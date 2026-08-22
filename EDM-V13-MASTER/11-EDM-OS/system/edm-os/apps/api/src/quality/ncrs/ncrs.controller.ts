import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { NcrStatus, Role } from "@edm-os/db";
import { NcrsService } from "./ncrs.service";
import { CreateNcrDto } from "./dto/create-ncr.dto";
import { UpdateNcrDto } from "./dto/update-ncr.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER] as const;

@Feature(Features.QUALITY)
@Controller("quality/ncrs")
export class NcrsController {
  constructor(private readonly ncrs: NcrsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: NcrStatus) { return this.ncrs.list(u.organisationId, projectId, status); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.ncrs.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateNcrDto) { return this.ncrs.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateNcrDto) { return this.ncrs.update(u.organisationId, id, dto); }
  @Patch(":id/corrective-action") @Roles(...WRITE) corrective(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() body: { correctiveAction: string }) { return this.ncrs.correctiveAction(u.organisationId, id, body.correctiveAction); }
  @Patch(":id/close") @Roles(...WRITE) close(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.ncrs.close(u.organisationId, id); }
}
