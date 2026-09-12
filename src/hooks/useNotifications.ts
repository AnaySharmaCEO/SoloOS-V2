import { useMemo } from 'react';
import { useFollowups } from './useFollowups';
import { useLeads } from './useLeads';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: 'amber' | 'brick';
}

/**
 * A real, if modest, notification center: it surfaces things that
 * genuinely need attention today (urgent follow-ups, at-risk leads)
 * using data the app already has cached \u2014 no separate notifications
 * table, no fabricated content. Extend this with real push/webhook-driven
 * notifications (proposal viewed, payment received, etc.) once those
 * events exist server-side.
 */
export function useNotifications(userId: string | undefined) {
  const { urgent } = useFollowups(userId);
  const { atRiskLeads } = useLeads(userId);

  const notifications: AppNotification[] = useMemo(() => {
    const items: AppNotification[] = [];

    urgent.slice(0, 5).forEach((f) => {
      items.push({
        id: `followup-${f.id}`,
        title: 'Follow-up due today',
        description: f.lead_name ? `${f.lead_name}` : 'A lead is waiting on you',
        href: '/app/follow-ups',
        tone: 'amber',
      });
    });

    atRiskLeads.slice(0, 5).forEach((l) => {
      items.push({
        id: `lead-risk-${l.id}`,
        title: 'Lead going cold',
        description: l.name || 'A lead needs attention',
        href: `/app/leads/${l.id}`,
        tone: 'brick',
      });
    });

    return items;
  }, [urgent, atRiskLeads]);

  return { notifications, count: notifications.length };
}
