import { Module } from "@nestjs/common";
import { TradesController } from "./trades.controller";
import { TradesService } from "./trades.service";

// Trade modules — per-trade installed-quantity tracking (drywall, ceilings,
// joinery, cladding, glazing, painting). Gated by the `tradeModules` flag.
@Module({ controllers: [TradesController], providers: [TradesService] })
export class TradesModule {}
