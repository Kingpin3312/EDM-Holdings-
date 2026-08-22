import { Module } from "@nestjs/common";
import { SiteController } from "./site.controller";
import { SiteService } from "./site.service";

// Site reporting — daily reports (labour, plant, deliveries, weather, delays)
// and weekly/monthly rollups. Gated by the `siteReports` feature flag.
@Module({ controllers: [SiteController], providers: [SiteService] })
export class SiteModule {}
