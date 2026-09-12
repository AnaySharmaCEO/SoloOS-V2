import { useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PLANS, PLAN_ORDER, type PlanId } from '../../../config/plans';
import { getDefaultProvider, startCheckout } from '../../../services/billing/billing.service';
import type { BillingCycle } from '../../../services/billing/types';
import { useAuth } from '../../context/AuthContext';

interface PlanCardsProps {
  currentPlanId?: PlanId;
  userId?: string;
  userEmail?: string;
  context?: 'marketing' | 'settings';
}

export function PlanCards({ currentPlanId, userId: propUserId, userEmail: propUserEmail, context = 'marketing' }: PlanCardsProps) {
  const { user } = useAuth();
  const userId = propUserId || user?.user?.id;
  const userEmail = propUserEmail || user?.user?.email;

  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelect = async (planId: Exclude<PlanId, 'free'>) => {
    if (!userId || !userEmail) {
      toast.info('Please create an account or sign in first to upgrade.');
      if (context === 'marketing') {
        window.location.href = '/signup';
      }
      return;
    }

    try {
      setLoadingPlan(planId);
      const provider = getDefaultProvider();
      const result = await startCheckout(provider, {
        planId,
        cycle,
        userId,
        email: userEmail,
        successUrl: `${window.location.origin}/app/settings/billing?checkout=success`,
        cancelUrl: `${window.location.origin}/app/settings/billing?checkout=cancelled`,
      });

      if (result.error) {
        if (result.error.includes('closed before completing')) {
          toast.info(result.error);
        } else {
          toast.error(result.error);
        }
      } else {
        toast.success('Subscription active! Welcome to SoloOS Pro.');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to start checkout.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const PRO_HIGHLIGHT_FEATURES = [
    'Unlimited active leads and clients',
    'Weekly Revenue Debrief (pipeline movement & wins)',
    'AI-drafted, context-aware follow-up messages',
    'Personalized pricing calibrated against accepted proposals',
    'Deal Radar deal prioritization',
    'Account Health Intelligence & churn prediction',
    'Full historical data retention',
  ];

  const FREE_FEATURES = [
    'Up to 5 active leads & 2 active clients',
    'Visual lead pipeline & stage tracking',
    'Daily urgency-sorted follow-up queue',
    'Follow-up message templates',
    'Strategic project pricing calculator',
    'Proposal tracking with decision logs',
    'Client records & relationship history',
    'CSV data export',
  ];

  return (
    <div className="space-y-8">
      {/* Billing Cycle Switcher */}
      <div className="flex items-center justify-center gap-1 bg-muted/60 p-1 rounded-full w-fit mx-auto border border-border">
        <button
          type="button"
          onClick={() => setCycle('monthly')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            cycle === 'monthly'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Monthly billing
        </button>
        <button
          type="button"
          onClick={() => setCycle('yearly')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            cycle === 'yearly'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Yearly billing <span className="text-green font-bold">— 2 months free</span>
        </button>
      </div>

      {/* 2-Tier Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {PLAN_ORDER.map((planId) => {
          const plan = PLANS[planId];
          const isCurrent = currentPlanId === planId;
          const price = plan.price ? (cycle === 'monthly' ? plan.price.monthly : plan.price.yearly) : 0;
          const features = planId === 'pro' ? PRO_HIGHLIGHT_FEATURES : FREE_FEATURES;

          return (
            <div
              key={planId}
              className={`rounded-xl border bg-card p-6 md:p-8 flex flex-col transition-all shadow-xs ${
                plan.highlight
                  ? 'border-green ring-1 ring-green'
                  : 'border-border'
              }`}
            >
              {plan.highlight ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green bg-green-tint px-2.5 py-0.5 rounded-full w-fit mb-3">
                  <Sparkles className="w-3 h-3" />
                  <span>Solo Growth</span>
                </div>
              ) : (
                <div className="text-[11px] font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full w-fit mb-3">
                  Free Forever
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground tracking-tight">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-5 leading-relaxed">{plan.tagline}</p>

              <div className="font-mono mb-6">
                {plan.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground tracking-tight">${price}</span>
                    <span className="text-xs text-muted-foreground">/{cycle === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground tracking-tight">$0</span>
                    <span className="text-xs text-muted-foreground">/forever</span>
                  </div>
                )}
              </div>

              <div className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                {planId === 'pro' ? 'What you get in Pro:' : 'Included free:'}
              </div>

              <ul className="space-y-2.5 mb-8 flex-1 text-xs">
                {features.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-foreground leading-snug">
                    <Check className="w-4 h-4 text-green shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button disabled variant="outline" className="w-full h-10 text-xs font-semibold">
                  Current plan
                </Button>
              ) : planId === 'free' ? (
                context === 'settings' ? (
                  <Button
                    variant="outline"
                    className="w-full h-10 text-xs font-semibold border-border text-foreground hover:bg-muted cursor-pointer"
                    onClick={() => {
                      toast.info('To manage or cancel your Pro subscription, please contact support or wait until your billing period concludes.');
                    }}
                  >
                    Downgrade to Free
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full h-10 text-xs font-semibold">
                    <a href="/signup">Start free</a>
                  </Button>
                )
              ) : (
                <Button
                  disabled={loadingPlan === planId}
                  className="w-full h-10 text-xs font-semibold bg-green hover:bg-green-hover text-white shadow-xs cursor-pointer disabled:opacity-60"
                  onClick={() => handleSelect(planId as Exclude<PlanId, 'free'>)}
                >
                  {loadingPlan === planId ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Opening checkout…
                    </span>
                  ) : (
                    'Upgrade to Pro'
                  )}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
