import { Module } from "@nestjs/common";
import { SuppliersController } from "./suppliers/suppliers.controller";
import { SuppliersService } from "./suppliers/suppliers.service";
import { PurchaseOrdersController } from "./purchase-orders/purchase-orders.controller";
import { PurchaseOrdersService } from "./purchase-orders/purchase-orders.service";
import { ProcurementController } from "./procurement.controller";
import { ProcurementService } from "./procurement.service";

// Procurement — suppliers, purchase orders (lines, issue, receive) and a spend
// dashboard. Gated by the `procurement` feature flag.
@Module({
  controllers: [ProcurementController, SuppliersController, PurchaseOrdersController],
  providers: [ProcurementService, SuppliersService, PurchaseOrdersService],
})
export class ProcurementModule {}
