import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { CurrentUser, AuthContext } from "../../common/current-user.decorator";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.CRM)
@Controller("crm/contacts")
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("companyId") companyId?: string) { return this.contacts.list(u.organisationId, companyId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.contacts.get(u.organisationId, id); }
  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  create(@CurrentUser() u: AuthContext, @Body() dto: CreateContactDto) { return this.contacts.create(u.organisationId, dto); }
  @Patch(":id") @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR)
  update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateContactDto) { return this.contacts.update(u.organisationId, id, dto); }
}
