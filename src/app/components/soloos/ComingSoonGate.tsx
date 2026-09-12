import { Link } from 'react-router';
import { Lock, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { cheapestPlanFor, PLANS, type FeatureKey } from '../../../config/plans';

interface ComingSoonGateProps {
  feature: FeatureKey;
  title: string;
  /** One or two honest sentences describing what this will do once it
   *  ships. Do not describe it as already working. */
  description: string;
}

/**
 * Renders one of two honest states — never a working feature with
 * placeholder data:
 *
 * 1. The user's plan doesn't include this feature yet → upsell, with the
 *    correct plan name and an "Upgrade" CTA.
 * 2. The user's plan already includes it, but it isn't built yet →
 *    "coming soon, you'll get it automatically" — no CTA needed.
 */
export function ComingSoonGate({ feature, title, description }: ComingSoonGateProps) {
  const { entitlements, canUse } = useEntitlements();
  const included = canUse(feature);
  const requiredPlanId = cheapestPlanFor(feature);
  const requiredPlan = requiredPlanId ? PLANS[requiredPlanId] : null;

  return (
    <div className="rounded-md border border-dashed border-line-strong bg-paper p-6 max-w-md">
      <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-slate-tint text-slate mb-3">
        {included ? <Clock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      </div>
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      <p className="text-[13px] text-ink-faint mb-4 leading-relaxed">{description}</p>

      {included ? (
        <p className="text-xs text-ink-faint">
          Included in your {entitlements.planId !== 'free' ? 'plan' : ''} — we're still building
          this. You'll get it automatically the moment it ships, no action needed.
        </p>
      ) : requiredPlan ? (
        <Button asChild size="sm">
          <Link to="/app/settings/billing">Upgrade to {requiredPlan.name}</Link>
        </Button>
      ) : null}
    </div>
  );
}
