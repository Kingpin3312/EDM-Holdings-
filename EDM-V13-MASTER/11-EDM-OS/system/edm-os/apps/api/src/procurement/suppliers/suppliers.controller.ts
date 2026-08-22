import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Trade, Role } from "@edm-os/db";
import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.PROJECT_MANAGER, Role.ADMINISTRATOR] as const;

@Feature(Features.PROCUREMENT)
@Controller("procurement/suppliers")
export class SuppliersController {
  constructor(private readonly suppliers: SuppliersService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("trade") trade?: Trade) { return this.suppliers.list(u.organisationId, trade); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.suppliers.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateSupplierDto) { return this.suppliers.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateSupplierDto) { return this.suppliers.update(u.organisationId, id, dto); }
}
