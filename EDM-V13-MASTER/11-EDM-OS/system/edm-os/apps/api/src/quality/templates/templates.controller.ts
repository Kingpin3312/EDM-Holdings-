import { Body, Controller, Get, Post } from "@nestjs/common";
import { Role } from "@edm-os/db";
import { TemplatesService } from "./templates.service";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { Roles } from "../../common/roles.decorator";
import { Feature } from "../../common/feature.decorator";
import { Features } from "../../config/org-config";

@Feature(Features.QUALITY)
@Controller("quality/templates")
export class TemplatesController {
  constructor(private readonly templates: TemplatesService) {}
  @Get() list() { return this.templates.list(); }
  @Post() @Roles(Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER) create(@Body() dto: CreateTemplateDto) { return this.templates.create(dto); }
}
