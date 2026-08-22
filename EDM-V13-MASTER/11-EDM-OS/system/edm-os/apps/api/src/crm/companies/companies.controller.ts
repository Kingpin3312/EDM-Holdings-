import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CompanyType, Role } from "@edm-os/db";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.CRM)
@Controller("crm/companies")
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Get() list(@CurrentUser() u: AuthContext, @Query("type") type?: CompanyType) { return this.companies.list(u.organisationId, type); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.companies.get(u.organisationId, id); }

  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateCompanyDto) { return this.companies.create(u.organisationId, dto); }

  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateCompanyDto) { return this.companies.update(u.organisationId, id, dto); }

  @Delete(":id") @Roles(Role.OWNER, Role.DIRECTOR)
  remove(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.companies.remove(u.organisationId, id); }
}
