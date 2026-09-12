// ============================================
// USE DASHBOARD HOOK
// ============================================
// Cached via React Query. The dashboard is a derived/composite view over
// leads, clients, proposals, and follow-ups — its cache key is invalidated
// by mutations in any of those domains (see DASHBOARD_DEPENDENT_DOMAINS /
// each domain hook), not just by its own explicit refresh.

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as dashboardService from '../services/dashboard.service';
import type { DashboardMetrics, RevenueMetrics } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

interface UseDashboardReturn {
  metrics: DashboardMetrics | null;
  revenueMetrics: RevenueMetrics | null;
  actionItems: any[];
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
}

interface DashboardData {
  metrics: DashboardMetrics | null;
  revenueMetrics: RevenueMetrics | null;
  actionItems: any[];
}

export function useDashboard(userId: string | undefined): UseDashboardReturn {
  const query = useQuery({
    queryKey: [QUERY_KEYS.dashboard, userId],
    queryFn: async (): Promise<DashboardData> => {
      const [metricsResult, revenueResult, actionsResult] = await Promise.all([
        dashboardService.getDashboardMetrics(userId!),
        dashboardService.getRevenueMetrics(userId!),
        dashboardService.getTodayActionItems(userId!),
      ]);

      if (metricsResult.error) throw new Error(metricsResult.error.message);

      return {
        metrics: metricsResult.data,
        revenueMetrics: revenueResult.data,
        actionItems: actionsResult.data
          ? dashboardService.prioritizeActionItems(actionsResult.data)
          : [],
      };
    },
    enabled: !!userId,
  });

  const refreshMetrics = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return {
    metrics: query.data?.metrics ?? null,
    revenueMetrics: query.data?.revenueMetrics ?? null,
    actionItems: query.data?.actionItems ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
    refreshMetrics,
  };
}
