import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { DocStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";
import { tenantWhere } from "../common/tenant";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { UpdateDocumentDto } from "./dto/update-document.dto";
import { AddRevisionDto } from "./dto/add-revision.dto";
import { nextRevision } from "./revision";

// Binary files live in Supabase Storage; the API records revision metadata and
// the storage key. Approval moves status FOR_REVIEW → APPROVED; a new revision
// sends it back to FOR_REVIEW and bumps the revision letter.
@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectInOrg(orgId: string, projectId: string) {
    const p = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId }, select: { id: true } });
    if (!p) throw new BadRequestException("Project not in your organisation");
  }

  list(orgId: string, projectId?: string, category?: string, status?: DocStatus) {
    return this.prisma.document.findMany({
      where: tenantWhere(orgId, { ...(projectId && { projectId }), ...(category && { category }), ...(status && { status }) }),
      include: { project: { select: { code: true } }, _count: { select: { revisions: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async get(orgId: string, id: string) {
    const doc = await this.prisma.document.findFirst({ where: { id, organisationId: orgId }, include: { project: true, revisions: { orderBy: { createdAt: "desc" } } } });
    if (!doc) throw new NotFoundException("Document not found");
    return doc;
  }

  async create(orgId: string, dto: CreateDocumentDto) {
    if (dto.projectId) await this.assertProjectInOrg(orgId, dto.projectId);
    const { projectId, tenderId, variationId, rfiId, firstRevision, ...rest } = dto;
    return this.prisma.document.create({
      data: {
        ...rest,
        currentRev: firstRevision ? "A" : "A",
        organisation: { connect: { id: orgId } },
        project: projectId ? { connect: { id: projectId } } : undefined,
        tender: tenderId ? { connect: { id: tenderId } } : undefined,
        variation: variationId ? { connect: { id: variationId } } : undefined,
        rfi: rfiId ? { connect: { id: rfiId } } : undefined,
        revisions: firstRevision ? { create: { revision: "A", storageKey: firstRevision.storageKey, fileName: firstRevision.fileName, fileSize: firstRevision.fileSize, note: firstRevision.note } } : undefined,
      },
      include: { revisions: true },
    });
  }

  async update(orgId: string, id: string, dto: UpdateDocumentDto) {
    await this.get(orgId, id);
    return this.prisma.document.update({ where: { id }, data: dto });
  }

  // Register a new revision (after the file is uploaded to Storage).
  async addRevision(orgId: string, id: string, dto: AddRevisionDto) {
    const doc = await this.get(orgId, id);
    const latest = doc.revisions[0]; // ordered desc by createdAt
    const revision = latest ? nextRevision(latest.revision) : "A";
    await this.prisma.documentRevision.create({ data: { document: { connect: { id } }, revision, storageKey: dto.storageKey, fileName: dto.fileName, fileSize: dto.fileSize, uploadedBy: dto.uploadedBy, note: dto.note } });
    return this.prisma.document.update({ where: { id }, data: { currentRev: revision, status: DocStatus.FOR_REVIEW }, include: { revisions: { orderBy: { createdAt: "desc" } } } });
  }

  async approve(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.document.update({ where: { id }, data: { status: DocStatus.APPROVED } });
  }

  async supersede(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.document.update({ where: { id }, data: { status: DocStatus.SUPERSEDED } });
  }

  async summary(orgId: string, projectId?: string) {
    const where = tenantWhere(orgId, projectId ? { projectId } : {});
    const byStatus = await this.prisma.document.groupBy({ by: ["status"], where, _count: true });
    const byCategory = await this.prisma.document.groupBy({ by: ["category"], where, _count: true });
    const status: Record<string, number> = {}; let total = 0;
    for (const g of byStatus) { status[g.status] = g._count; total += g._count; }
    const category: Record<string, number> = {};
    for (const g of byCategory) category[g.category] = g._count;
    return { total, byStatus: status, byCategory: category };
  }
}
