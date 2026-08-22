import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Trade, Role } from "@edm-os/db";
import { TradesService } from "./trades.service";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.SITE_ENGINEER, Role.FOREMAN] as const;

@Feature(Features.TRADE_MODULES)
@Controller("trades/progress")
export class TradesController {
  constructor(private readonly trades: TradesService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("trade") trade?: Trade) { return this.trades.list(u.organisationId, projectId, trade); }
  @Get("summary") summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.trades.summary(u.organisationId, projectId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.trades.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateProgressDto) { return this.trades.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateProgressDto) { return this.trades.update(u.organisationId, id, dto); }
}
