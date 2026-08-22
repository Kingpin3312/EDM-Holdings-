import { Body, Controller, Get, Patch } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { SettingsService } from "./settings.service";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { OrgConfig } from "../config/org-config";

@Controller("settings")
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get(@CurrentUser() u: AuthContext) {
    return this.settings.getOrCreate(u.organisationId);
  }

  @Patch()
  @Roles(Role.OWNER, Role.DIRECTOR, Role.ADMINISTRATOR)
  update(@CurrentUser() u: AuthContext, @Body() patch: Partial<OrgConfig>) {
    return this.settings.update(u.organisationId, patch);
  }
}
