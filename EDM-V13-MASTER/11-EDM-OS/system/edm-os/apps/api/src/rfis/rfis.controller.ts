import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RfiStatus, Role } from "@edm-os/db";
import { RfisService } from "./rfis.service";
import { CreateRfiDto } from "./dto/create-rfi.dto";
import { UpdateRfiDto } from "./dto/update-rfi.dto";
import { RespondRfiDto } from "./dto/respond-rfi.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.COMMERCIAL_MANAGER] as const;

@Feature(Features.RFIS)
@Controller("rfis")
export class RfisController {
  constructor(private readonly rfis: RfisService) {}

  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: RfiStatus) {
    return this.rfis.list(u.organisationId, projectId, status);
  }
  @Get("overdue") overdue(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.rfis.overdue(u.organisationId, projectId); }
  @Get("summary") summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.rfis.summary(u.organisationId, projectId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.rfis.get(u.organisationId, id); }

  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateRfiDto) { return this.rfis.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateRfiDto) { return this.rfis.update(u.organisationId, id, dto); }
  @Post(":id/respond") @Roles(...WRITE) respond(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: RespondRfiDto) { return this.rfis.respond(u.organisationId, id, dto.response); }
  @Patch(":id/close") @Roles(...WRITE) close(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.rfis.close(u.organisationId, id); }
}
