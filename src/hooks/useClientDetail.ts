// Cached via React Query, keyed per client — see useLeads.ts for rationale.
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as clientService from '../services/client.service';
import * as activityService from '../services/activity.service';
import type { Client, ActivityLogEntry, UpdateClientInput } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface ClientDetailData {
  client: Client | null;
  timeline: ActivityLogEntry[];
}

export function useClientDetail(clientId: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEYS.clientDetail, clientId],
    queryFn: async (): Promise<ClientDetailData> => {
      const [clientRes, timelineRes] = await Promise.all([
        clientService.getClientById(clientId!, userId!),
        activityService.getClientTimeline(clientId!, userId!),
      ]);
      if (clientRes.error) throw new Error(clientRes.error.message);
      return { client: clientRes.data, timeline: timelineRes.data || [] };
    },
    enabled: !!clientId && !!userId,
  });

  const client = query.data?.client ?? null;
  const timeline = query.data?.timeline ?? [];

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clientDetail, clientId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
  }, [queryClient, clientId, userId]);

  const update = useCallback(
    async (updates: UpdateClientInput) => {
      if (!clientId || !userId) return false;
      setMutationError(null);
      const result = await clientService.updateClient(clientId, userId, updates);
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      invalidate();
      return true;
    },
    [clientId, userId, invalidate]
  );

  const logActivity = useCallback(
    async (type: string, label: string, metadata?: Record<string, any>) => {
      if (!clientId || !userId || !client) return;
      await activityService.logActivity(userId, {
        client_id: clientId,
        lead_id: client.lead_id,
        action_type: type,
        action_label: label,
        metadata,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clientDetail, clientId] });
    },
    [clientId, userId, client, queryClient]
  );

  const logWorkDelivered = useCallback(
    async (notes?: string) => {
      if (!client) return false;
      const updates: UpdateClientInput = {
        repeat_work_count: (client.repeat_work_count || 0) + 1,
        next_client_action: 'Request testimonial',
        notes: notes ? `${client.notes || ''}\n\n[Work Logged]: ${notes}` : client.notes,
      };
      const ok = await update(updates);
      if (ok) {
        await logActivity(
          'work_delivered',
          `Delivered job successfully. Total repeat jobs: ${updates.repeat_work_count}`,
          { notes }
        );
      }
      return ok;
    },
    [client, update, logActivity]
  );

  const proposeUpsell = useCallback(
    async (opportunity: string) => {
      if (!client) return false;
      const updates: UpdateClientInput = {
        upsell_opportunity: opportunity,
        account_health: 'expansion_ready',
        next_client_action: 'Follow up on upsell proposal',
      };
      const ok = await update(updates);
      if (ok) {
        await logActivity('upsell_started', `Proposing new upsell: "${opportunity}"`);
      }
      return ok;
    },
    [client, update, logActivity]
  );

  const requestReferral = useCallback(
    async (source: string) => {
      if (!client) return false;
      const updates: UpdateClientInput = {
        referral_opportunity: source,
        next_client_action: 'Send referral reward pitch',
      };
      const ok = await update(updates);
      if (ok) {
        await logActivity('referral_asked', `Requested client referral through: ${source}`);
      }
      return ok;
    },
    [client, update, logActivity]
  );

  const askForTestimonial = useCallback(async () => {
    if (!client) return false;
    const updates: UpdateClientInput = { next_client_action: 'Follow up on testimonial' };
    const ok = await update(updates);
    if (ok) {
      await logActivity('testimonial_requested', 'Sent formal request for client testimonial');
    }
    return ok;
  }, [client, update, logActivity]);

  const scheduleReviewCall = useCallback(async () => {
    if (!client) return false;
    const updates: UpdateClientInput = { next_client_action: 'Prepare deck for review call' };
    const ok = await update(updates);
    if (ok) {
      await logActivity('review_call_scheduled', 'Scheduled client relationship review call');
    }
    return ok;
  }, [client, update, logActivity]);

  const markRetainerRenewed = useCallback(
    async (value: number) => {
      if (!client) return false;
      const updates: UpdateClientInput = {
        total_revenue: (client.total_revenue || 0) + value,
        retainer_active: true,
        retainer_value: value,
        next_client_action: 'Schedule monthly sync call',
      };
      const ok = await update(updates);
      if (ok) {
        await logActivity(
          'retainer_renewed',
          `Retainer renewed successfully for $${value.toLocaleString()}`,
          { value }
        );
      }
      return ok;
    },
    [client, update, logActivity]
  );

  const deleteClient = useCallback(async () => {
    if (!clientId || !userId) return false;
    setMutationError(null);
    const result = await clientService.deleteClient(clientId, userId);
    if (result.error) {
      setMutationError(result.error.message);
      return false;
    }
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
    return true;
  }, [clientId, userId, queryClient]);

  return {
    client,
    timeline,
    loading: query.isLoading,
    error: mutationError || (query.error ? (query.error as Error).message : null),
    refresh: query.refetch,
    update,
    deleteClient,
    logWorkDelivered,
    proposeUpsell,
    requestReferral,
    askForTestimonial,
    scheduleReviewCall,
    markRetainerRenewed,
  };
}
