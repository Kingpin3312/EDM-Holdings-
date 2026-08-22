import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { ToolboxService } from "./toolbox.service";
import { CreateToolboxDto } from "./dto/create-toolbox.dto";
import { UpdateToolboxDto } from "./dto/update-toolbox.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.FOREMAN] as const;

@Feature(Features.HSE)
@Controller("hse/toolbox-talks")
export class ToolboxController {
  constructor(private readonly toolbox: ToolboxService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.toolbox.list(u.organisationId, projectId); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateToolboxDto) { return this.toolbox.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateToolboxDto) { return this.toolbox.update(u.organisationId, id, dto); }
}
