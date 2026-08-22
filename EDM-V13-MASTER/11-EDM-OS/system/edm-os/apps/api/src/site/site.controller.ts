import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { SiteService } from "./site.service";
import { CreateDailyReportDto } from "./dto/create-daily-report.dto";
import { UpdateDailyReportDto } from "./dto/update-daily-report.dto";
import { LabourEntryDto, PlantEntryDto, DeliveryEntryDto } from "./dto/entries.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

// Site staff capture daily reports; PMs/directors read everything.
const SITE_WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.FOREMAN] as const;

@Feature(Features.SITE_REPORTS)
@Controller("site")
export class SiteController {
  constructor(private readonly site: SiteService) {}

  @Get("daily-reports")
  list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("from") from?: string, @Query("to") to?: string) {
    return this.site.list(u.organisationId, projectId, from, to);
  }
  @Get("daily-reports/:id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.site.get(u.organisationId, id); }

  @Post("daily-reports") @Roles(...SITE_WRITE)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateDailyReportDto) { return this.site.create(u.organisationId, dto); }
  @Patch("daily-reports/:id") @Roles(...SITE_WRITE)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateDailyReportDto) { return this.site.update(u.organisationId, id, dto); }

  @Post("daily-reports/:id/labour") @Roles(...SITE_WRITE)
  addLabour(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: LabourEntryDto) { return this.site.addLabour(u.organisationId, id, dto); }
  @Post("daily-reports/:id/plant") @Roles(...SITE_WRITE)
  addPlant(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: PlantEntryDto) { return this.site.addPlant(u.organisationId, id, dto); }
  @Post("daily-reports/:id/deliveries") @Roles(...SITE_WRITE)
  addDelivery(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: DeliveryEntryDto) { return this.site.addDelivery(u.organisationId, id, dto); }

  // Generated reports
  @Get("reports/weekly") weekly(@CurrentUser() u: AuthContext, @Query("projectId") projectId: string, @Query("weekOf") weekOf: string) {
    return this.site.weekly(u.organisationId, projectId, weekOf);
  }
  @Get("reports/monthly") monthly(@CurrentUser() u: AuthContext, @Query("projectId") projectId: string, @Query("month") month: string) {
    return this.site.monthly(u.organisationId, projectId, month);
  }

  // Claims register — chargeable delays/instructions rolled into a recoverable position
  @Get("claims") claims(@CurrentUser() u: AuthContext) {
    return this.site.claims(u.organisationId);
  }
}
