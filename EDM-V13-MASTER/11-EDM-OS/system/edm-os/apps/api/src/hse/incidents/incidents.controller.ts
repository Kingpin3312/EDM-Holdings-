import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { IncidentType, Role } from "@edm-os/db";
import { IncidentsService } from "./incidents.service";
import { CreateIncidentDto } from "./dto/create-incident.dto";
import { UpdateIncidentDto } from "./dto/update-incident.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.FOREMAN] as const;

@Feature(Features.HSE)
@Controller("hse/incidents")
export class IncidentsController {
  constructor(private readonly incidents: IncidentsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("type") type?: IncidentType) { return this.incidents.list(u.organisationId, projectId, type); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.incidents.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateIncidentDto) { return this.incidents.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateIncidentDto) { return this.incidents.update(u.organisationId, id, dto); }
}
