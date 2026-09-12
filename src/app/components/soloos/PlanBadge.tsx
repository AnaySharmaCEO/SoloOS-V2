import type { PlanId } from '../../../config/plans';
import { StatusBadge, type StatusTone } from './StatusBadge';

const PLAN_TONE: Record<PlanId, StatusTone> = {
  free: 'slate',
  pro: 'green',
};

const PLAN_LABEL: Record<PlanId, string> = {
  free: 'Free plan',
  pro: 'Pro plan',
};

export function PlanBadge({ planId, className }: { planId: PlanId; className?: string }) {
  return (
    <StatusBadge tone={PLAN_TONE[planId] || 'slate'} className={className}>
      {PLAN_LABEL[planId] || 'Plan'}
    </StatusBadge>
  );
}
