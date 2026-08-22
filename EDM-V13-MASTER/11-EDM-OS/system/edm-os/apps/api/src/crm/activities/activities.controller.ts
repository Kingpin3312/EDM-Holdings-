import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ActivitiesService } from "./activities.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.CRM)
@Controller("crm/activities")
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query() q: { leadId?: string; opportunityId?: string; contactId?: string; projectId?: string }) { return this.activities.list(u.organisationId, q); }
  @Get("upcoming") upcoming(@CurrentUser() u: AuthContext) { return this.activities.upcoming(u.organisationId); }
  @Post() create(@CurrentUser() u: AuthContext, @Body() dto: CreateActivityDto) { return this.activities.create(u.organisationId, dto); }
  @Post(":id/complete") complete(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.activities.complete(u.organisationId, id); }
}
