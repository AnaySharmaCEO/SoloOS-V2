// ============================================
// USE LEADS HOOK
// ============================================
// Cached via React Query: fetched once per (userId, filters) combination
// and reused across page navigation. Mutations invalidate only the leads
// domain (+ the dashboard, which derives counts from it) — switching
// pages never triggers a refetch on its own.

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as leadService from '../services/lead.service';
import type { Lead, CreateLeadInput, UpdateLeadInput, LeadFilters } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface UseLeadsReturn {
  leads: Lead[];
  leadsByStage: Record<string, Lead[]>;
  warmLeads: Lead[];
  atRiskLeads: Lead[];
  loading: boolean;
  error: string | null;
  createLead: (input: CreateLeadInput) => Promise<Lead | null>;
  updateLead: (leadId: string, updates: UpdateLeadInput) => Promise<Lead | null>;
  deleteLead: (leadId: string) => Promise<boolean>;
  getLeadById: (leadId: string) => Promise<Lead | null>;
  moveToStage: (leadId: string, stage: string) => Promise<boolean>;
  logContact: (leadId: string) => Promise<boolean>;
  refreshLeads: () => Promise<void>;
  applyFilters: (filters: LeadFilters) => void;
}

interface LeadsData {
  leads: Lead[];
  leadsByStage: Record<string, Lead[]>;
  warmLeads: Lead[];
  atRiskLeads: Lead[];
}

const EMPTY_DATA: LeadsData = { leads: [], leadsByStage: {}, warmLeads: [], atRiskLeads: [] };

export function useLeads(userId: string | undefined): UseLeadsReturn {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [mutating, setMutating] = useState(false);

  const query = useQuery({
    queryKey: [QUERY_KEYS.leads, userId, filters],
    queryFn: async (): Promise<LeadsData> => {
      const [leadsResult, byStageResult, warmResult, riskResult] = await Promise.all([
        leadService.getAllLeads(userId!, filters),
        leadService.getLeadsByStage(userId!),
        leadService.getWarmLeads(userId!),
        leadService.getAtRiskLeads(userId!),
      ]);

      if (leadsResult.error) throw new Error(leadsResult.error.message);

      return {
        leads: leadsResult.data || [],
        leadsByStage: byStageResult.data || {},
        warmLeads: warmResult.data || [],
        atRiskLeads: riskResult.data || [],
      };
    },
    enabled: !!userId,
  });

  const invalidateLeads = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leads, userId] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
  }, [queryClient, userId]);

  const createLead = useCallback(
    async (input: CreateLeadInput): Promise<Lead | null> => {
      if (!userId) return null;
      setMutating(true);
      setMutationError(null);
      try {
        const result = await leadService.createLead(userId, input);
        if (result.error) {
          setMutationError(result.error.message);
          return null;
        }
        invalidateLeads();
        return result.data;
      } catch (err: any) {
        setMutationError(err.message);
        return null;
      } finally {
        setMutating(false);
      }
    },
    [userId, invalidateLeads]
  );

  const updateLead = useCallback(
    async (leadId: string, updates: UpdateLeadInput): Promise<Lead | null> => {
      if (!userId) return null;
      setMutating(true);
      setMutationError(null);
      try {
        const result = await leadService.updateLead(leadId, userId, updates);
        if (result.error) {
          setMutationError(result.error.message);
          return null;
        }
        invalidateLeads();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leadDetail, leadId] });
        return result.data;
      } catch (err: any) {
        setMutationError(err.message);
        return null;
      } finally {
        setMutating(false);
      }
    },
    [userId, invalidateLeads, queryClient]
  );

  const deleteLead = useCallback(
    async (leadId: string): Promise<boolean> => {
      if (!userId) return false;
      setMutating(true);
      setMutationError(null);
      try {
        const result = await leadService.deleteLead(leadId, userId);
        if (result.error) {
          setMutationError(result.error.message);
          return false;
        }
        invalidateLeads();
        return true;
      } catch (err: any) {
        setMutationError(err.message);
        return false;
      } finally {
        setMutating(false);
      }
    },
    [userId, invalidateLeads]
  );

  const getLeadById = useCallback(
    async (leadId: string): Promise<Lead | null> => {
      if (!userId) return null;
      try {
        const result = await leadService.getLeadById(leadId, userId);
        return result.data || null;
      } catch (err: any) {
        setMutationError(err.message);
        return null;
      }
    },
    [userId]
  );

  const moveToStage = useCallback(
    async (leadId: string, stage: string): Promise<boolean> => {
      if (!userId) return false;
      try {
        const result = await leadService.moveLeadToStage(leadId, userId, stage);
        if (result.error) {
          setMutationError(result.error.message);
          return false;
        }
        invalidateLeads();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leadDetail, leadId] });
        if (stage === 'Won') {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
        }
        return true;
      } catch (err: any) {
        setMutationError(err.message);
        return false;
      }
    },
    [userId, invalidateLeads, queryClient]
  );

  const logContact = useCallback(
    async (leadId: string): Promise<boolean> => {
      if (!userId) return false;
      try {
        const result = await leadService.logLeadContact(leadId, userId);
        if (result.error) {
          setMutationError(result.error.message);
          return false;
        }
        invalidateLeads();
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.leadDetail, leadId] });
        return true;
      } catch (err: any) {
        setMutationError(err.message);
        return false;
      }
    },
    [userId, invalidateLeads, queryClient]
  );

  const refreshLeads = useCallback(async () => {
    await query.refetch();
  }, [query]);

  const applyFilters = useCallback((newFilters: LeadFilters) => {
    setFilters(newFilters);
  }, []);

  const data = query.data ?? EMPTY_DATA;

  return useMemo(
    () => ({
      leads: data.leads,
      leadsByStage: data.leadsByStage,
      warmLeads: data.warmLeads,
      atRiskLeads: data.atRiskLeads,
      loading: query.isLoading || mutating,
      error: mutationError || (query.error ? (query.error as Error).message : null),
      createLead,
      updateLead,
      deleteLead,
      getLeadById,
      moveToStage,
      logContact,
      refreshLeads,
      applyFilters,
    }),
    [
      data,
      query.isLoading,
      query.error,
      mutating,
      mutationError,
      createLead,
      updateLead,
      deleteLead,
      getLeadById,
      moveToStage,
      logContact,
      refreshLeads,
      applyFilters,
    ]
  );
}
