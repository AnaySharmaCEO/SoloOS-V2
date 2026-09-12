/**
 * SoloOS plan & entitlement configuration.
 *
 * Single source of truth for product tiers:
 * - Free ($0): up to 5 active leads, 2 active clients, manual follow-up templates, 30 days history.
 * - Pro ($30/mo or $300/yr): unlimited leads/clients, AI-drafted follow-ups, personalized pricing,
 *   Deal Radar, Account Health Intelligence, Weekly Revenue Debrief, full history.
 */

export type PlanId = 'free' | 'pro';

export type FeatureKey =
  // Core workflow — available on every plan
  | 'lead_pipeline'
  | 'followup_queue'
  | 'followup_fixed_templates'
  | 'pricing_calculator_generic'
  | 'proposal_tracking'
  | 'client_records'
  | 'csv_export'
  // Pro-tier capabilities
  | 'deal_radar'
  | 'personalized_pricing'
  | 'computed_client_health'
  | 'ai_followup_drafts'
  | 'revenue_debrief';

export const TABLE_STAKES_FEATURES: FeatureKey[] = [
  'lead_pipeline',
  'followup_queue',
  'followup_fixed_templates',
  'pricing_calculator_generic',
  'proposal_tracking',
  'client_records',
  'csv_export',
];

export const PRO_FEATURES: FeatureKey[] = [
  'deal_radar',
  'personalized_pricing',
  'computed_client_health',
  'ai_followup_drafts',
  'revenue_debrief',
];

export interface PlanPrice {
  monthly: number;
  yearly: number;
  currency: 'USD';
}

export interface PlanLimits {
  maxActiveLeads: number | 'unlimited';
  maxActiveClients: number | 'unlimited';
  historyDays: number | 'unlimited';
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: PlanPrice | null; // null for Free
  limits: PlanLimits;
  features: FeatureKey[];
  highlight?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    tagline: 'Free forever for solo operators getting started.',
    price: null,
    limits: {
      maxActiveLeads: 5,
      maxActiveClients: 2,
      historyDays: 30,
    },
    features: [...TABLE_STAKES_FEATURES],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    tagline: 'For freelancers past the "just trying it out" phase.',
    price: { monthly: 30, yearly: 300, currency: 'USD' },
    limits: {
      maxActiveLeads: 'unlimited',
      maxActiveClients: 'unlimited',
      historyDays: 'unlimited',
    },
    features: [...TABLE_STAKES_FEATURES, ...PRO_FEATURES],
    highlight: true,
  },
};

export const PLAN_ORDER: PlanId[] = ['free', 'pro'];

export function planIncludes(planId: PlanId, feature: FeatureKey): boolean {
  return PLANS[planId]?.features.includes(feature) ?? false;
}

export function cheapestPlanFor(feature: FeatureKey): PlanId | null {
  for (const id of PLAN_ORDER) {
    if (planIncludes(id, feature)) return id;
  }
  return null;
}
