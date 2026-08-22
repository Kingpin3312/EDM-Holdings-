import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { CostCodesService } from "./cost-codes.service";
import { CreateCostCodeDto, UpdateCostCodeDto } from "./dto/cost-code.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR] as const;

@Feature(Features.FINANCIALS)
@Controller("finance/cost-codes")
export class CostCodesController {
  constructor(private readonly costCodes: CostCodesService) {}
  @Get() list(@CurrentUser() u: AuthContext) { return this.costCodes.list(u.organisationId); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateCostCodeDto) { return this.costCodes.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateCostCodeDto) { return this.costCodes.update(u.organisationId, id, dto); }
}
