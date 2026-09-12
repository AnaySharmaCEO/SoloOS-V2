// Cached via React Query — see useLeads.ts for the caching rationale.
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as proposalService from '../services/proposal.service';
import type { CreateProposalInput, Proposal } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface ProposalsData {
  proposals: Proposal[];
  pending: Proposal[];
  delayed: Proposal[];
}

const EMPTY: ProposalsData = { proposals: [], pending: [], delayed: [] };

export function useProposals(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEYS.proposals, userId],
    queryFn: async (): Promise<ProposalsData> => {
      const [allRes, pendingRes, delayedRes] = await Promise.all([
        proposalService.getAllProposals(userId!),
        proposalService.getPendingProposals(userId!),
        proposalService.getDelayedProposals(userId!),
      ]);
      if (allRes.error) throw new Error(allRes.error.message);
      return {
        proposals: allRes.data || [],
        pending: pendingRes.data || [],
        delayed: delayedRes.data || [],
      };
    },
    enabled: !!userId,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.proposals, userId] });
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

  const accept = useCallback(
    (id: string, reason?: string) => runMutation(() => proposalService.acceptProposal(id, userId!, reason)),
    [runMutation, userId]
  );
  const reject = useCallback(
    (id: string, reason: string) => runMutation(() => proposalService.rejectProposal(id, userId!, reason)),
    [runMutation, userId]
  );
  const remind = useCallback(
    (id: string) => runMutation(() => proposalService.sendProposalReminder(id, userId!)),
    [runMutation, userId]
  );
  const create = useCallback(
    (input: CreateProposalInput) => runMutation(() => proposalService.createProposal(userId!, input)),
    [runMutation, userId]
  );

  const data = query.data ?? EMPTY;

  return {
    proposals: data.proposals,
    pending: data.pending,
    delayed: data.delayed,
    loading: query.isLoading,
    error: mutationError || (query.error ? (query.error as Error).message : null),
    refresh: query.refetch,
    accept,
    reject,
    remind,
    create,
  };
}
