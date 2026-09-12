// Cached via React Query — see useLeads.ts for the caching rationale.
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as followupService from '../services/followup.service';
import type { CreateFollowUpInput, FollowUp, UpdateFollowUpInput } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface FollowupsData {
  followups: FollowUp[];
  pending: FollowUp[];
  urgent: FollowUp[];
}

const EMPTY: FollowupsData = { followups: [], pending: [], urgent: [] };

export function useFollowups(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEYS.followups, userId],
    queryFn: async (): Promise<FollowupsData> => {
      const [allRes, pendingRes, urgentRes] = await Promise.all([
        followupService.getAllFollowUps(userId!),
        followupService.getPendingFollowUps(userId!),
        followupService.getUrgentToday(userId!),
      ]);
      if (allRes.error) throw new Error(allRes.error.message);
      return {
        followups: allRes.data || [],
        pending: pendingRes.data || [],
        urgent: urgentRes.data || [],
      };
    },
    enabled: !!userId,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.followups, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
  }, [queryClient, userId]);

  const runMutation = useCallback(
    async (fn: () => Promise<{ error: { message: string } | null }>) => {
      if (!userId) return false;
      setMutationError(null);
      const r = await fn();
      if (r.error) {
        setMutationError(r.error.message);
        return false;
      }
      invalidate();
      return true;
    },
    [userId, invalidate]
  );

  const complete = useCallback(
    (id: string) => runMutation(() => followupService.completeFollowUp(id, userId!)),
    [runMutation, userId]
  );
  const snooze = useCallback(
    (id: string, days = 1) => runMutation(() => followupService.snoozeFollowUp(id, userId!, days)),
    [runMutation, userId]
  );
  const markSent = useCallback(
    (id: string, payload: { channel_used: string; message_sent: string; copied_message?: string }) =>
      runMutation(() => followupService.markFollowUpSent(id, userId!, payload)),
    [runMutation, userId]
  );
  const update = useCallback(
    (id: string, updates: UpdateFollowUpInput) => runMutation(() => followupService.updateFollowUp(id, userId!, updates)),
    [runMutation, userId]
  );
  const create = useCallback(
    (input: CreateFollowUpInput) => runMutation(() => followupService.createFollowUp(userId!, input)),
    [runMutation, userId]
  );

  const data = query.data ?? EMPTY;

  return {
    followups: data.followups,
    pending: data.pending,
    urgent: data.urgent,
    loading: query.isLoading,
    error: mutationError || (query.error ? (query.error as Error).message : null),
    refresh: query.refetch,
    complete,
    snooze,
    markSent,
    update,
    create,
  };
}
