import { Module } from "@nestjs/common";
import { RfisController } from "./rfis.controller";
import { RfisService } from "./rfis.service";

// RFIs — raise, respond, close, with derived overdue tracking.
// Gated by the `rfis` feature flag.
@Module({ controllers: [RfisController], providers: [RfisService] })
export class RfisModule {}
