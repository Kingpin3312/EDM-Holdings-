import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { InspectionResult, Role } from "@edm-os/db";
import { InspectionsService } from "./inspections.service";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { UpdateInspectionDto } from "./dto/update-inspection.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER] as const;

@Feature(Features.QUALITY)
@Controller("quality/inspections")
export class InspectionsController {
  constructor(private readonly inspections: InspectionsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("result") result?: InspectionResult) { return this.inspections.list(u.organisationId, projectId, result); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.inspections.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateInspectionDto) { return this.inspections.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateInspectionDto) { return this.inspections.update(u.organisationId, id, dto); }
}
