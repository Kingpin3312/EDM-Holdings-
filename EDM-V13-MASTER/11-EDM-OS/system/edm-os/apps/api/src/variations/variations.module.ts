import { Module } from "@nestjs/common";
import { VariationsController } from "./variations.controller";
import { VariationsService } from "./variations.service";

// Variations (change orders) — workflow, financial impact, log.
// Gated by the `variations` feature flag.
@Module({ controllers: [VariationsController], providers: [VariationsService] })
export class VariationsModule {}
