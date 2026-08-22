import { Module } from "@nestjs/common";
import { CostCodesController } from "./cost-codes/cost-codes.controller";
import { CostCodesService } from "./cost-codes/cost-codes.service";
import { BudgetsController } from "./budgets/budgets.controller";
import { BudgetsService } from "./budgets/budgets.service";
import { InvoicesController } from "./invoices/invoices.controller";
import { InvoicesService } from "./invoices/invoices.service";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";

// Financials — cost codes, budgets, invoices (applications for payment) and the
// cost-value reconciliation. Gated by the `financials` feature flag.
@Module({
  controllers: [FinanceController, CostCodesController, BudgetsController, InvoicesController],
  providers: [FinanceService, CostCodesService, BudgetsService, InvoicesService],
})
export class FinanceModule {}
