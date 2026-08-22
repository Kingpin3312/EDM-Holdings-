import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { VariationStatus, Role } from "@edm-os/db";
import { VariationsService } from "./variations.service";
import { CreateVariationDto } from "./dto/create-variation.dto";
import { UpdateVariationDto } from "./dto/update-variation.dto";
import { MoveStatusDto } from "./dto/move-status.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.PROJECT_MANAGER] as const;

@Feature(Features.VARIATIONS)
@Controller("variations")
export class VariationsController {
  constructor(private readonly variations: VariationsService) {}

  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: VariationStatus) {
    return this.variations.list(u.organisationId, projectId, status);
  }
  @Get("summary") summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.variations.summary(u.organisationId, projectId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.variations.get(u.organisationId, id); }

  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateVariationDto) { return this.variations.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateVariationDto) { return this.variations.update(u.organisationId, id, dto); }
  @Patch(":id/status") @Roles(...WRITE) moveStatus(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: MoveStatusDto) { return this.variations.moveStatus(u.organisationId, id, dto.status); }
}
