import { Module } from "@nestjs/common";
import { IncidentsController } from "./incidents/incidents.controller";
import { IncidentsService } from "./incidents/incidents.service";
import { ToolboxController } from "./toolbox/toolbox.controller";
import { ToolboxService } from "./toolbox/toolbox.service";
import { RiskController } from "./risk/risk.controller";
import { RiskService } from "./risk/risk.service";
import { HseController } from "./hse.controller";
import { HseService } from "./hse.service";

// HSE — incidents, toolbox talks, risk assessments and a safety dashboard.
// Gated by the `hse` feature flag.
@Module({
  controllers: [HseController, IncidentsController, ToolboxController, RiskController],
  providers: [HseService, IncidentsService, ToolboxService, RiskService],
})
export class HseModule {}
