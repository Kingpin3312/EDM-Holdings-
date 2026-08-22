import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { DocStatus, Role } from "@edm-os/db";
import { DocumentsService } from "./documents.service";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { AddRevisionDto } from "./dto/add-revision.dto";
import { CurrentUser, AuthContext } from "../common/current-user.decorator";
import { Roles } from "../common/roles.decorator";
import { Feature } from "../common/feature.decorator";
import { Features } from "../config/org-config";

const WRITE = [Role.OWNER, Role.DIRECTOR, Role.GENERAL_MANAGER, Role.PROJECT_MANAGER, Role.COMMERCIAL_MANAGER, Role.ADMINISTRATOR] as const;

@Feature(Features.DOCUMENTS)
@Controller("documents")
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}
  @Get() list(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string, @Query("category") category?: string, @Query("status") status?: DocStatus) { return this.documents.list(u.organisationId, projectId, category, status); }
  @Get("summary") summary(@CurrentUser() u: AuthContext, @Query("projectId") projectId?: string) { return this.documents.summary(u.organisationId, projectId); }
  @Get(":id") get(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.documents.get(u.organisationId, id); }
  @Post() @Roles(...WRITE) create(@CurrentUser() u: AuthContext, @Body() dto: CreateDocumentDto) { return this.documents.create(u.organisationId, dto); }
  @Patch(":id") @Roles(...WRITE) update(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: UpdateDocumentDto) { return this.documents.update(u.organisationId, id, dto); }
  @Post(":id/revisions") @Roles(...WRITE) addRevision(@CurrentUser() u: AuthContext, @Param("id") id: string, @Body() dto: AddRevisionDto) { return this.documents.addRevision(u.organisationId, id, dto); }
  @Post(":id/approve") @Roles(...WRITE) approve(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.documents.approve(u.organisationId, id); }
  @Post(":id/supersede") @Roles(...WRITE) supersede(@CurrentUser() u: AuthContext, @Param("id") id: string) { return this.documents.supersede(u.organisationId, id); }
}
