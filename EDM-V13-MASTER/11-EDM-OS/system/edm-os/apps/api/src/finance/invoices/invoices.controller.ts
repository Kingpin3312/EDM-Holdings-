import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { InvoiceStatus, Role } from "@edm-os/db";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto, UpdateInvoiceDto } from "./dto/invoice.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER] as const;

@Feature(Features.FINANCIALS)
@Controller("finance/invoices")
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("status") status?: InvoiceStatus) { return this.invoices.list(u.organisationId, projectId, status); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.invoices.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateInvoiceDto) { return this.invoices.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateInvoiceDto) { return this.invoices.update(u.organisationId, id, dto); }
  @Post(":id/submit") @Roles(...WRITE) submit(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.invoices.submit(u.organisationId, id); }
  @Post(":id/certify") @Roles(...WRITE) certify(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.invoices.certify(u.organisationId, id); }
  @Post(":id/pay") @Roles(...WRITE) pay(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.invoices.markPaid(u.organisationId, id); }
}
