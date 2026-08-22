import { Module } from "@nestjs/common";
import { InspectionsController } from "./inspections/inspections.controller";
import { InspectionsService } from "./inspections/inspections.service";
import { SnagsController } from "./snags/snags.controller";
import { SnagsService } from "./snags/snags.service";
import { NcrsController } from "./ncrs/ncrs.controller";
import { NcrsService } from "./ncrs/ncrs.service";
import { TemplatesController } from "./templates/templates.controller";
import { TemplatesService } from "./templates/templates.service";
import { QualityController } from "./quality.controller";
import { QualityService } from "./quality.service";

// Quality — inspections, snags, NCRs (+ corrective actions), checklist
// templates and a dashboard. Gated by the `quality` feature flag.
@Module({
  controllers: [QualityController, InspectionsController, SnagsController, NcrsController, TemplatesController],
  providers: [QualityService, InspectionsService, SnagsService, NcrsService, TemplatesService],
})
export class QualityModule {}
