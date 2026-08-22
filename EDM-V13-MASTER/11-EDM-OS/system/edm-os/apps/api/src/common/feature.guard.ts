import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SettingsService } from "../settings/settings.service";
import { FEATURE_KEY } from "./feature.decorator";
import { FeatureKey } from "../config/org-config";

// Reads the org's config and blocks routes whose feature is disabled.
// NOTE: in production, cache settings per-request (interceptor) or on the
// session to avoid a lookup per call; kept simple here for clarity.
@Injectable()
export class FeatureGuard implements CanActivate {
  constructor(private reflector: Reflector, private settings: SettingsService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const flag = this.reflector.getAllAndOverride<FeatureKey>(FEATURE_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!flag) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) return false;
    const config = await this.settings.getOrCreate(user.organisationId);
    if (!config.features?.[flag]) {
      throw new ForbiddenException(`Feature '${flag}' is not enabled for this organisation`);
    }
    return true;
  }
}
