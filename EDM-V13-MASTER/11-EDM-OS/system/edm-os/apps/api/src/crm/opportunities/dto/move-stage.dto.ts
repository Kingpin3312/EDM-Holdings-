import { IsEnum } from "class-validator";
import { OpportunityStage } from "@edm-os/db";
export class MoveStageDto {
  @IsEnum(OpportunityStage) stage!: OpportunityStage;
}
