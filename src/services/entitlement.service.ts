import { PLANS, planIncludes, type FeatureKey, type PlanId } from '../config/plans';

export interface Entitlements {
  planId: PlanId;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'free';
  /** ISO date string, null on Free */
  renewsAt: string | null;
  cancelAtPeriodEnd: boolean;
  aiActionsRemaining: number | 'unlimited';
}

export const FREE_ENTITLEMENTS: Entitlements = {
  planId: 'free',
  status: 'free',
  renewsAt: null,
  cancelAtPeriodEnd: false,
  aiActionsRemaining: 0,
};

/**
 * The single check every gate in the product should call. Never inline
 * `plan === 'pro'` in a component — route it through here so adding a new
 * gated feature later only means editing plans.ts, not every screen.
 *
 * NOTE: this is a UX convenience check, not a security boundary. Any
 * server mutation that a feature unlocks must independently verify
 * entitlement server-side (RLS / Edge Function), per the billing audit.
 */
export function canUseFeature(entitlements: Entitlements, feature: FeatureKey): boolean {
  if (entitlements.status === 'past_due' || entitlements.status === 'canceled') {
    // Grace period handling: downgrade to Free capability, never delete
    // access to data itself. Only gated *features* are affected.
    return planIncludes('free', feature);
  }
  return planIncludes(entitlements.planId, feature);
}

export function hasAiActionsRemaining(entitlements: Entitlements): boolean {
  return entitlements.aiActionsRemaining === 'unlimited' || entitlements.aiActionsRemaining > 0;
}

export function planLabel(planId: PlanId): string {
  return PLANS[planId].name;
}
