import { IsEnum, IsNumber, IsObject, IsOptional, IsString, IsDateString } from "class-validator";
import { Trade } from "@edm-os/db";

// attributes carries trade-specific fields (typed loosely on purpose):
//  DRYWALL  { boardType, fireRating, acousticRating, partitionType }
//  CEILINGS { gridSystem, tileSystem }
//  JOINERY  { stage: production|delivery|installation, approvalStatus }
//  GLAZING  { stage: fabrication|delivery|installation, system }
//  PAINTING { stage: prep|primer|finish, coats, system }
export class CreateProgressDto {
  @IsString() projectId!: string;
  @IsEnum(Trade) trade!: Trade;
  @IsOptional() @IsString() area?: string;
  @IsNumber() quantity!: number;
  @IsString() unit!: string;
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsObject() attributes?: Record<string, unknown>;
  @IsOptional() @IsString() notes?: string;
}
