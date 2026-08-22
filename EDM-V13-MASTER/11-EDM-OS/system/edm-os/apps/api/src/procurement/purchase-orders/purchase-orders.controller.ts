import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { PoStatus, Role } from "@edm-os/db";
import { PurchaseOrdersService } from "./purchase-orders.service";
import { CreatePoDto, PoLineDto } from "./dto/create-po.dto";
import { UpdatePoDto } from "./dto/update-po.dto";
import { ReceiveDto } from "./dto/receive.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.PROJECT_MANAGER] as const;

@Feature(Features.PROCUREMENT)
@Controller("procurement/purchase-orders")
export class PurchaseOrdersController {
  constructor(private readonly pos: PurchaseOrdersService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: PoStatus, @Query("supplierId") supplierId?: string) { return this.pos.list(u.organisationId, projectId, status, supplierId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.pos.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreatePoDto) { return this.pos.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdatePoDto) { return this.pos.update(u.organisationId, id, dto); }
  @Post(":id/lines") @Roles(...WRITE) addLine(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() line: PoLineDto) { return this.pos.addLine(u.organisationId, id, line); }
  @Post(":id/issue") @Roles(...WRITE) issue(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.pos.issue(u.organisationId, id); }
  @Post(":id/receive") @Roles(...WRITE) receive(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: ReceiveDto) { return this.pos.receive(u.organisationId, id, dto); }
}
