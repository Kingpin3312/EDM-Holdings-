import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { LeadStage, Role } from "@edm-os/db";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { ConvertLeadDto } from "./dto/convert-lead.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.CRM)
@Controller("crm/leads")
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("stage") stage?: LeadStage) { return this.leads.list(u.organisationId, stage); }
  @Get("follow-ups") followUps(@CurrentUser() u: AuthContext) { return this.leads.followUpsDue(u.organisationId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.leads.get(u.organisationId, id); }
  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateLeadDto) { return this.leads.create(u.organisationId, dto); }
  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateLeadDto) { return this.leads.update(u.organisationId, id, dto); }
  @Post(":id/convert") @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER)
  convert(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: ConvertLeadDto) { return this.leads.convert(u.organisationId, id, dto); }
}
