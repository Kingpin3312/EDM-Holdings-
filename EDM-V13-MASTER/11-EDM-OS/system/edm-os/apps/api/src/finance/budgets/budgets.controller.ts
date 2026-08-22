import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { BudgetsService } from "./budgets.service";
import { CreateBudgetDto, UpdateBudgetDto } from "./dto/budget.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER] as const;

@Feature(Features.FINANCIALS)
@Controller("finance/budgets")
export class BudgetsController {
  constructor(private readonly budgets: BudgetsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.budgets.list(u.organisationId, projectId); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateBudgetDto) { return this.budgets.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateBudgetDto) { return this.budgets.update(u.organisationId, id, dto); }
}
