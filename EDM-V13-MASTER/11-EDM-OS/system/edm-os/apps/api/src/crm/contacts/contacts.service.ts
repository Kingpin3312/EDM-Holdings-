import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";

// Contact has no organisationId of its own — it is scoped THROUGH its Company.
// Every query filters on company.organisationId so the tenant boundary holds.
@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, companyId?: string) {
    return this.prisma.contact.findMany({
      where: { company: { organisationId: orgId }, ...(companyId ? { companyId } : {}) },
      include: { company: { select: { id: true, name: true } } },
      orderBy: [{ isPrimary: "desc" }, { lastName: "asc" }],
    });
  }

  async get(orgId: string, id: string) {
    const contact = await this.prisma.contact.findFirst({ where: { id, company: { organisationId: orgId } }, include: { company: true } });
    if (!contact) throw new NotFoundException("Contact not found");
    return contact;
  }

  private async assertCompanyInOrg(orgId: string, companyId: string) {
    const company = await this.prisma.company.findFirst({ where: { id: companyId, organisationId: orgId }, select: { id: true } });
    if (!company) throw new BadRequestException("Company not in your organisation");
  }

  async create(orgId: string, dto: CreateContactDto) {
    await this.assertCompanyInOrg(orgId, dto.companyId);
    return this.prisma.contact.create({ data: dto });
  }

  async update(orgId: string, id: string, dto: UpdateContactDto) {
    await this.get(orgId, id);
    if (dto.companyId) await this.assertCompanyInOrg(orgId, dto.companyId);
    return this.prisma.contact.update({ where: { id }, data: dto });
  }
}
