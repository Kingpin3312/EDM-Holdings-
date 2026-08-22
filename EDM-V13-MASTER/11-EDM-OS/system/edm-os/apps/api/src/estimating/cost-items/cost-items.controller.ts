import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Trade, Role } from "@edm-os/db";
import { CostItemsService } from "./cost-items.service";
import { CreateCostItemDto } from "./dto/create-cost-item.dto";
import { UpdateCostItemDto } from "./dto/update-cost-item.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.ESTIMATING)
@Controller("estimating/cost-items")
export class CostItemsController {
  constructor(private readonly costItems: CostItemsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("trade") trade?: Trade) { return this.costItems.list(u.organisationId, trade); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.costItems.get(u.organisationId, id); }
  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateCostItemDto) { return this.costItems.create(u.organisationId, dto); }
  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateCostItemDto) { return this.costItems.update(u.organisationId, id, dto); }
}
