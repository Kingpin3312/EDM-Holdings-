import { IsString } from "class-validator";
export class RespondRfiDto {
  @IsString() response!: string;
}
