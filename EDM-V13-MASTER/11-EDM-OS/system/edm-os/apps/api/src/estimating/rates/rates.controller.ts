import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RateType, Role } from "@edm-os/db";
import { RatesService } from "./rates.service";
import { CreateRateDto } from "./dto/create-rate.dto";
import { UpdateRateDto } from "./dto/update-rate.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.ESTIMATING)
@Controller("estimating/rates")
export class RatesController {
  constructor(private readonly rates: RatesService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("type") type?: RateType) { return this.rates.list(u.organisationId, type); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.rates.get(u.organisationId, id); }
  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateRateDto) { return this.rates.create(u.organisationId, dto); }
  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateRateDto) { return this.rates.update(u.organisationId, id, dto); }
}
