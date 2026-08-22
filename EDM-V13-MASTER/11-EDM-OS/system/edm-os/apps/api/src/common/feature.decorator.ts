import { SetMetadata } from "@nestjs/common";
import { FeatureKey } from "../config/org-config";
export const FEATURE_KEY = "feature";
// Gate a controller/route behind an organisation feature flag.
// Core (Phase 1) modules are on by default; later modules ship dark and are
// switched on per organisation — which is also the SaaS tiering primitive.
export const Feature = (flag: FeatureKey) => SetMetadata(FEATURE_KEY, flag);
