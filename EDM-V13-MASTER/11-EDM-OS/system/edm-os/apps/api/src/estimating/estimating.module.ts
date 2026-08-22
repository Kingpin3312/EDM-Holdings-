import { Module } from "@nestjs/common";
import { CostItemsController } from "./cost-items/cost-items.controller";
import { CostItemsService } from "./cost-items/cost-items.service";
import { RatesController } from "./rates/rates.controller";
import { RatesService } from "./rates/rates.service";
import { EstimatesController } from "./estimates/estimates.controller";
import { EstimatesService } from "./estimates/estimates.service";

// Estimating — cost library, rate library, estimates (BOQ lines + pricing) and
// quotation generation. Gated by the `estimating` feature flag.
@Module({
  controllers: [CostItemsController, RatesController, EstimatesController],
  providers: [CostItemsService, RatesService, EstimatesService],
})
export class EstimatingModule {}
