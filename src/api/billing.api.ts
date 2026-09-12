// Replaces: src/api/billing.api.ts
// Keeps the dev override for local UI preview, but now getEntitlements()
// reads the real table when a user is signed in and has a row.
// aiActionsRemaining stays DERIVED from plans.ts (not stored in the DB) —
// keeps plan configuration in exactly one place.

import type { ApiResponse } from '../types';
import { supabase } from '../lib/supabase';
import { FREE_ENTITLEMENTS, type Entitlements } from '../services/entitlement.service';
import { PLANS, type PlanId } from '../config/plans';

const DEV_OVERRIDE_KEY = 'soloos:dev-plan-override';

// Clean up any lingering dev plan override from localStorage so real DB is queried
try {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(DEV_OVERRIDE_KEY);
  }
} catch {}

export function getDevOverride(): PlanId | null {
  return null;
}

/** Local, synchronous fallback — used before the real query resolves */
export function getCurrentEntitlements(): Entitlements {
  return FREE_ENTITLEMENTS;
}

export function setDevPlanOverride(planId: PlanId | null): void {
  try {
    if (planId) window.localStorage.setItem(DEV_OVERRIDE_KEY, planId);
    else window.localStorage.removeItem(DEV_OVERRIDE_KEY);
  } catch {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('soloos:plan-change', { detail: planId }));
  }
}

function deriveAiActionsRemaining(planId: PlanId): number | 'unlimited' {
  return PLANS[planId]?.features.includes('ai_followup_drafts') ? 'unlimited' : 0;
}

/** Real read from the `entitlements` table (see supabase/migrations/create_subscriptions_table_v1.sql). */
export async function getEntitlements(userId: string): Promise<ApiResponse<Entitlements>> {
  try {
    const { data, error } = await supabase
      .from('entitlements')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[getEntitlements] Warning loading entitlements from DB:', error.message);
      return { data: FREE_ENTITLEMENTS, error: null };
    }

    if (!data) {
      // No row yet (e.g. brand-new user or Free plan default) → Free.
      return { data: FREE_ENTITLEMENTS, error: null };
    }

    const entitlements: Entitlements = {
      planId: (data.plan_id as PlanId) || 'free',
      status: data.status,
      renewsAt: data.current_period_end,
      cancelAtPeriodEnd: Boolean(data.cancel_at_period_end),
      aiActionsRemaining: deriveAiActionsRemaining(data.plan_id),
    };

    return { data: entitlements, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Failed to load entitlements' } };
  }
}
