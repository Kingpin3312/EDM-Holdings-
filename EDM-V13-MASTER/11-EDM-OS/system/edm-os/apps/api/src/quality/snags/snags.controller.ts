import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { SnagStatus, Role } from "@edm-os/db";
import { SnagsService } from "./snags.service";
import { CreateSnagDto } from "./dto/create-snag.dto";
import { UpdateSnagDto } from "./dto/update-snag.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.FOREMAN] as const;

@Feature(Features.QUALITY)
@Controller("quality/snags")
export class SnagsController {
  constructor(private readonly snags: SnagsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: SnagStatus) { return this.snags.list(u.organisationId, projectId, status); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.snags.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateSnagDto) { return this.snags.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateSnagDto) { return this.snags.update(u.organisationId, id, dto); }
  @Patch(":id/close") @Roles(...WRITE) close(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.snags.close(u.organisationId, id); }
}
