import { Injectable, NotFoundException } from "@nestjs/common";
import { CompanyType } from "@edm-os/db";
import { PrismaService } from "../../prisma/prisma.service";
import { tenantWhere } from "../../common/tenant";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  list(orgId: string, type?: CompanyType) {
    return this.prisma.company.findMany({
      where: tenantWhere(orgId, type ? { type } : {}),
      include: { _count: { select: { contacts: true, opportunities: true, projects: true } } },
      orderBy: { name: "asc" },
    });
  }

  async get(orgId: string, id: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, organisationId: orgId },
      include: { contacts: true, opportunities: true },
    });
    if (!company) throw new NotFoundException("Company not found");
    return company;
  }

  create(orgId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({ data: { ...dto, organisation: { connect: { id: orgId } } } });
  }

  async update(orgId: string, id: string, dto: UpdateCompanyDto) {
    await this.get(orgId, id);
    return this.prisma.company.update({ where: { id }, data: dto });
  }

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    return this.prisma.company.delete({ where: { id } });
  }
}
