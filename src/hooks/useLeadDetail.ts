// Cached via React Query, keyed per lead — see useLeads.ts for rationale.
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as leadService from '../services/lead.service';
import * as noteService from '../services/note.service';
import * as activityService from '../services/activity.service';
import * as channelsApi from '../api/channels.api';
import * as pricingApi from '../api/pricing.api';
import * as proposalsApi from '../api/proposals.api';
import * as proposalService from '../services/proposal.service';
import type {
  ActivityLogEntry,
  Lead,
  LeadContactChannel,
  LeadNote,
  MoveStageInput,
  PricingRecord,
  Proposal,
} from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface LeadDetailData {
  lead: Lead | null;
  notes: LeadNote[];
  activity: ActivityLogEntry[];
  channels: LeadContactChannel[];
  proposals: Proposal[];
  pricingHistory: PricingRecord[];
}

const EMPTY: LeadDetailData = {
  lead: null,
  notes: [],
  activity: [],
  channels: [],
  proposals: [],
  pricingHistory: [],
};

export function useLeadDetail(leadId: string | undefined, userId: string | undefined) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEYS.leadDetail, leadId],
    queryFn: async (): Promise<LeadDetailData> => {
      const [leadRes, notesRes, activityRes, channelsRes, proposalsRes, pricingRes] =
        await Promise.all([
          leadService.getLeadById(leadId!, userId!),
          noteService.getNotesForLead(leadId!, userId!),
          activityService.getLeadTimeline(leadId!, userId!),
          channelsApi.getChannelsForLead(leadId!, userId!),
          proposalsApi.getProposals(userId!, {}),
          pricingApi.getPricingHistoryForLead(leadId!, userId!),
        ]);

      if (leadRes.error) throw new Error(leadRes.error.message);

      return {
        lead: leadRes.data,
        notes: notesRes.data || [],
        activity: activityRes.data || [],
        channels: channelsRes.data || [],
        proposals: (proposalsRes.data || []).filter((p) => p.lead_id === leadId),
        pricingHistory: pricingRes.data || [],
      };
    },
    enabled: !!leadId && !!userId,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leadDetail, leadId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leads, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
  }, [queryClient, leadId, userId]);

  const addNote = useCallback(
    async (content: string) => {
      if (!leadId || !userId) return false;
      setMutationError(null);
      const result = await noteService.addNote(userId, leadId, content);
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      invalidate();
      return true;
    },
    [leadId, userId, invalidate]
  );

  const moveStage = useCallback(
    async (input: MoveStageInput) => {
      if (!leadId || !userId) return false;
      setMutationError(null);
      const result = await leadService.moveLeadStage(leadId, userId, input);
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      invalidate();
      if (input.stage === 'Won') {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
      }
      return true;
    },
    [leadId, userId, invalidate, queryClient]
  );

  const archive = useCallback(async () => {
    if (!leadId || !userId) return false;
    setMutationError(null);
    const result = await leadService.archiveLead(leadId, userId);
    if (result.error) {
      setMutationError(result.error.message);
      return false;
    }
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leads, userId] });
    return true;
  }, [leadId, userId, queryClient]);

  const deleteLead = useCallback(async () => {
    if (!leadId || !userId) return false;
    setMutationError(null);
    const result = await leadService.deleteLead(leadId, userId);
    if (result.error) {
      setMutationError(result.error.message);
      return false;
    }
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leads, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
    return true;
  }, [leadId, userId, queryClient]);

  const addProposal = useCallback(
    async (input: { amount: number; sent_date: string; expected_reply_date?: string; notes?: string }) => {
      if (!leadId || !userId) return false;
      setMutationError(null);
      const result = await proposalService.createProposal(userId, { ...input, lead_id: leadId });
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      invalidate();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.proposals, userId] });
      return true;
    },
    [leadId, userId, invalidate, queryClient]
  );

  const data = query.data ?? EMPTY;

  return {
    lead: data.lead,
    notes: data.notes,
    activity: data.activity,
    channels: data.channels,
    proposals: data.proposals,
    pricingHistory: data.pricingHistory,
    loading: query.isLoading,
    error: mutationError || (query.error ? (query.error as Error).message : null),
    refresh: query.refetch,
    addNote,
    moveStage,
    archive,
    deleteLead,
    addProposal,
  };
}
