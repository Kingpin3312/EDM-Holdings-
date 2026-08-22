import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ProjectStatus, Role } from "@edm-os/db";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";

@Controller("projects")
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list(@CurrentUser() u: AuthContext, @Query("status") status?: ProjectStatus) {
    return this.projects.list(u.organisationId, status);
  }

  @Get(":id")
  get(@CurrentUser() u: AuthContext, @Param("id") id: string) {
    return this.projects.get(u.organisationId, id);
  }

  @Get(":id/financials")
  financials(@CurrentUser() u: AuthContext, @Param("id") id: string) {
    return this.projects.financials(u.organisationId, id);
  }

  @Post()
  @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateProjectDto) {
    return this.projects.create(u.organisationId, dto);
  }

  @Patch(":id")
  @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateProjectDto) {
    return this.projects.update(u.organisationId, id, dto);
  }
}
