import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { OpportunityStatus, OpportunityStage, Role } from "@edm-os/db";
import { OpportunitiesService } from "./opportunities.service";
import { CreateOpportunityDto } from "./dto/create-opportunity.dto";
import { UpdateOpportunityDto } from "./dto/update-opportunity.dto";
import { MoveStageDto } from "./dto/move-stage.dto";
import { ConvertToProjectDto } from "./dto/convert-to-project.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.CRM)
@Controller("crm/opportunities")
export class OpportunitiesController {
  constructor(private readonly opportunities: OpportunitiesService) {}

  @Get() list(@CurrentUser() u: AuthContext, @Query("status") status?: OpportunityStatus, @Query("stage") stage?: OpportunityStage) {
    return this.opportunities.list(u.organisationId, status, stage);
  }
  @Get("board") board(@CurrentUser() u: AuthContext) { return this.opportunities.board(u.organisationId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.opportunities.get(u.organisationId, id); }

  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateOpportunityDto) { return this.opportunities.create(u.organisationId, dto); }

  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateOpportunityDto) { return this.opportunities.update(u.organisationId, id, dto); }

  @Patch(":id/stage") @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER)
  moveStage(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: MoveStageDto) { return this.opportunities.moveStage(u.organisationId, id, dto.stage); }

  @Post(":id/convert-to-project") @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER)
  convertToProject(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: ConvertToProjectDto) { return this.opportunities.convertToProject(u.organisationId, id, dto); }
}
