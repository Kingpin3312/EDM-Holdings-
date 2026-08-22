// The configuration layer for EDM OS.
// Trades, workflows and feature flags are DATA, not code. An organisation's
// settings row holds this shape; absent settings fall back to these defaults.
// Keeping all "how we work" here is the single discipline that preserves the
// option to sell the platform later — no tenant-specific logic in the code.

export type FeatureKey =
  | "tenders" | "estimating" | "projects" | "siteReports" | "crm"      // Phase 1
  | "variations" | "rfis" | "quality" | "hse" | "procurement" | "documents" | "tradeModules" | "mobile" // Phase 2
  | "financials" | "ai";                                              // Phase 3

export const Features = {
  TENDERS: "tenders", ESTIMATING: "estimating", PROJECTS: "projects",
  SITE_REPORTS: "siteReports", CRM: "crm",
  VARIATIONS: "variations", RFIS: "rfis", QUALITY: "quality", HSE: "hse",
  PROCUREMENT: "procurement", DOCUMENTS: "documents", TRADE_MODULES: "tradeModules", MOBILE: "mobile",
  FINANCIALS: "financials", AI: "ai",
} as const;

export interface OrgConfig {
  enabledTrades: string[];                  // Trade enum values this org delivers
  features: Record<FeatureKey, boolean>;    // per-module on/off (and SaaS tiering)
  tenderWorkflow: { stages: string[]; transitions: Record<string, string[]> };
  projectWorkflow: { stages: string[] };
  crmPipeline: { stages: string[]; transitions: Record<string, string[]> };
  variationWorkflow: { stages: string[]; transitions: Record<string, string[]> };
  fiscal: { currency: string; retentionPctDefault: number; overheadPctDefault: number; profitPctDefault: number };
}

// EDM's defaults: Phase 1 features on, later phases off until built.
export const DEFAULT_ORG_CONFIG: OrgConfig = {
  enabledTrades: ["DRYWALL", "CEILINGS", "JOINERY", "TIMBER_CLADDING", "ALUMINIUM_GLAZING", "PAINTING", "FITOUT", "REFURBISHMENT", "TECHNICAL"],
  features: {
    tenders: true, estimating: true, projects: true, siteReports: true, crm: true,
    variations: true, rfis: true, quality: true, hse: true, procurement: true, documents: true, tradeModules: true, mobile: false,
    financials: true, ai: false,
  },
  tenderWorkflow: {
    stages: ["IDENTIFIED", "REGISTERED", "IN_PROGRESS", "SUBMITTED", "SHORTLISTED", "AWARDED", "LOST", "NO_BID", "WITHDRAWN"],
    transitions: {
      IDENTIFIED: ["REGISTERED", "NO_BID"],
      REGISTERED: ["IN_PROGRESS", "NO_BID", "WITHDRAWN"],
      IN_PROGRESS: ["SUBMITTED", "NO_BID", "WITHDRAWN"],
      SUBMITTED: ["SHORTLISTED", "AWARDED", "LOST"],
      SHORTLISTED: ["AWARDED", "LOST"],
      AWARDED: [], LOST: [], NO_BID: [], WITHDRAWN: [],
    },
  },
  projectWorkflow: { stages: ["PRECONSTRUCTION", "ACTIVE", "ON_HOLD", "SNAGGING", "COMPLETED", "CLOSED"] },
  crmPipeline: {
    stages: ["QUALIFYING", "ENGAGED", "PROPOSAL", "NEGOTIATION"],
    // Sales is non-linear — an opportunity may move to any other open stage.
    transitions: {
      QUALIFYING: ["ENGAGED", "PROPOSAL", "NEGOTIATION"],
      ENGAGED: ["QUALIFYING", "PROPOSAL", "NEGOTIATION"],
      PROPOSAL: ["QUALIFYING", "ENGAGED", "NEGOTIATION"],
      NEGOTIATION: ["QUALIFYING", "ENGAGED", "PROPOSAL"],
    },
  },
  variationWorkflow: {
    stages: ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "PAID"],
    transitions: {
      DRAFT: ["SUBMITTED"],
      SUBMITTED: ["UNDER_REVIEW", "APPROVED", "REJECTED"],
      UNDER_REVIEW: ["APPROVED", "REJECTED"],
      APPROVED: ["PAID"],
      REJECTED: [],
      PAID: [],
    },
  },
  fiscal: { currency: "AED", retentionPctDefault: 5, overheadPctDefault: 8, profitPctDefault: 12 },
};
