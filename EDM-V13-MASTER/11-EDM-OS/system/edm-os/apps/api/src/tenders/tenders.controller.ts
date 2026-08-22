import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { TenderStatus, Role } from "@edm-os/db";
import { TendersService } from "./tenders.service";
import { CreateTenderDto } from "./dto/create-tender.dto";
import { UpdateTenderDto } from "./dto/update-tender.dto";
import { MoveStatusDto } from "./dto/move-status.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

@Feature(Features.TENDERS) // illustrative: gated by the org feature flag
@Controller("tenders")
export class TendersController {
  constructor(private readonly tenders: TendersService) {}

  @Get()
  list(@CurrentUser() u: AuthContext, @Query("status") status?: TenderStatus) {
    return this.tenders.list(u.organisationId, status);
  }

  @Get("pipeline")
  pipeline(@CurrentUser() u: AuthContext) {
    return this.tenders.pipeline(u.organisationId);
  }

  @Get(":id")
  get(@CurrentUser() u: AuthContext, @Param("id") id: string) {
    return this.tenders.get(u.organisationId, id);
  }

  @Post()
  @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateTenderDto) {
    return this.tenders.create(u.organisationId, dto);
  }

  @Patch(":id")
  @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER, Role.ESTIMATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateTenderDto) {
    return this.tenders.update(u.organisationId, id, dto);
  }

  @Patch(":id/status")
  @Roles(Role.OWNER, Role.DIRECTOR, Role.COMMERCIAL_MANAGER)
  moveStatus(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: MoveStatusDto) {
    return this.tenders.moveStatus(u.organisationId, id, dto.status, dto.note);
  }

  @Delete(":id")
  @Roles(Role.OWNER, Role.DIRECTOR)
  remove(@CurrentUser() u: AuthContext, @Param("id") id: string) {
    return this.tenders.remove(u.organisationId, id);
  }
}
