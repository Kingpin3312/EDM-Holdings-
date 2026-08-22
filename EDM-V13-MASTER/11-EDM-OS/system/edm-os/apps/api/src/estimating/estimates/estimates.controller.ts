import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { EstimateStatus, Role } from "@edm-os/db";
import { EstimatesService } from "./estimates.service";
import { CreateEstimateDto } from "./dto/create-estimate.dto";
import { UpdateEstimateDto } from "./dto/update-estimate.dto";
import { CreateLineDto } from "./dto/create-line.dto";
import { UpdateLineDto } from "./dto/update-line.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR] as const;

@Feature(Features.ESTIMATING)
@Controller("estimating/estimates")
export class EstimatesController {
  constructor(private readonly estimates: EstimatesService) {}

  @Get() list(@CurrentUser() u: AuthContext, @Query("status") status?: EstimateStatus) { return this.estimates.list(u.organisationId, status); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.estimates.get(u.organisationId, id); }
  @Get(":id/summary") summary(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.estimates.summary(u.organisationId, id); }

  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateEstimateDto) { return this.estimates.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateEstimateDto) { return this.estimates.update(u.organisationId, id, dto); }

  @Post(":id/lines") @Roles(...WRITE) addLine(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: CreateLineDto) { return this.estimates.addLine(u.organisationId, id, dto); }
  @Patch(":id/lines/:lineId") @Roles(...WRITE) updateLine(@CurrentUser() u: AuthContext, @Param("id") id: string, @Param("lineId") lineId: string, @Body() dto: UpdateLineDto) { return this.estimates.updateLine(u.organisationId, id, lineId, dto); }
  @Delete(":id/lines/:lineId") @Roles(...WRITE) removeLine(@CurrentUser() u: AuthContext, @Param("id") id: string, @Param("lineId") lineId: string) { return this.estimates.removeLine(u.organisationId, id, lineId); }

  @Post(":id/quotation") @Roles(...WRITE) quote(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.estimates.generateQuotation(u.organisationId, id); }
}
