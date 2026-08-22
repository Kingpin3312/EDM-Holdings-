import { Injectable, NotFoundException } from "@nestjs/common";
import { VariationStatus, PoStatus, InvoiceStatus } from "@edm-os/db";
import { PrismaService } from "../prisma/prisma.service";

const n = (v: unknown) => Number(v ?? 0);
const r2 = (x: number) => Math.round(x * 100) / 100;

// Cost-Value Reconciliation — the QS's single source of truth. Revenue side =
// contract value + approved variations. Cost side = budgets, cross-checked
// against committed POs. Cash side = certified/paid invoices and retention.
@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async reconciliation(orgId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId, organisationId: orgId } });
    if (!project) throw new NotFoundException("Project not found");

    const [variationAgg, budgets, poAgg, invoices] = await Promise.all([
      this.prisma.variation.aggregate({ where: { organisationId: orgId, projectId, status: { in: [VariationStatus.APPROVED, VariationStatus.PAID] } }, _sum: { value: true } }),
      this.prisma.budget.findMany({ where: { organisationId: orgId, projectId }, include: { costCode: { select: { code: true } } } }),
      this.prisma.purchaseOrder.aggregate({ where: { organisationId: orgId, projectId, status: { notIn: [PoStatus.DRAFT, PoStatus.CANCELLED] } }, _sum: { total: true } }),
      this.prisma.invoice.findMany({ where: { organisationId: orgId, projectId } }),
    ]);

    // Value
    const contract = n(project.contractValue);
    const variations = n(variationAgg._sum.value);
    const forecastValue = r2(contract + variations);

    // Cost (from budgets), with PO cross-check
    const budgetTotal = r2(budgets.reduce((s, b) => s + n(b.budgetAmount), 0));
    const committed = r2(budgets.reduce((s, b) => s + n(b.committedAmount), 0));
    const actual = r2(budgets.reduce((s, b) => s + n(b.actualAmount), 0));
    const committedFromPOs = r2(n(poAgg._sum.total));

    // Margin
    const forecastMargin = r2(forecastValue - budgetTotal);
    const marginPct = forecastValue > 0 ? r2((forecastMargin / forecastValue) * 100) : null;
    const costToComplete = r2(budgetTotal - actual);

    // Cash (applications for payment)
    const certifiedStatuses = [InvoiceStatus.CERTIFIED, InvoiceStatus.PAID];
    const certified = r2(invoices.filter((i) => certifiedStatuses.includes(i.status)).reduce((s, i) => s + n(i.grossAmount), 0));
    const paid = r2(invoices.filter((i) => i.status === InvoiceStatus.PAID).reduce((s, i) => s + n(i.netAmount), 0));
    const certifiedNet = r2(invoices.filter((i) => certifiedStatuses.includes(i.status)).reduce((s, i) => s + n(i.netAmount), 0));
    const outstanding = r2(certifiedNet - paid);
    const retentionHeld = r2(invoices.filter((i) => certifiedStatuses.includes(i.status)).reduce((s, i) => s + n(i.retentionAmount), 0));
    const applicationsPending = r2(invoices.filter((i) => i.status === InvoiceStatus.SUBMITTED).reduce((s, i) => s + n(i.netAmount), 0));

    return {
      project: { code: project.code, name: project.name },
      value: { contract, variations, forecast: forecastValue },
      cost: { budget: budgetTotal, committed, actual, committedFromPOs, costToComplete },
      margin: { forecast: forecastMargin, pct: marginPct },
      cash: { certified, paid, outstanding, retentionHeld, applicationsPending },
      costCodes: budgets.map((b) => ({
        code: b.costCode?.code ?? "—",
        description: b.description,
        budget: n(b.budgetAmount),
        committed: n(b.committedAmount),
        actual: n(b.actualAmount),
        variance: r2(n(b.budgetAmount) - n(b.committedAmount)),
      })),
    };
  }
}
