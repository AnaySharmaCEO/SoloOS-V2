import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../app/context/AuthContext';
import { getEntitlements, getCurrentEntitlements, setDevPlanOverride } from '../api/billing.api';
import { canUseFeature, FREE_ENTITLEMENTS, type Entitlements } from '../services/entitlement.service';
import type { FeatureKey } from '../config/plans';

const ENTITLEMENTS_QUERY_KEY = ['entitlements'] as const;

export function useEntitlements() {
  const { user } = useAuth();
  const userId = user?.user.id;
  const queryClient = useQueryClient();

  useEffect(() => {
    const handlePlanChange = () => {
      queryClient.invalidateQueries({ queryKey: ENTITLEMENTS_QUERY_KEY });
    };
    window.addEventListener('soloos:plan-change', handlePlanChange);
    return () => window.removeEventListener('soloos:plan-change', handlePlanChange);
  }, [queryClient]);

  const query = useQuery({
    queryKey: [...ENTITLEMENTS_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) return getCurrentEntitlements();
      const result = await getEntitlements(userId);
      if (result.error || !result.data) return getCurrentEntitlements();
      return result.data;
    },
    staleTime: 0,
    initialData: () => getCurrentEntitlements(),
  });

  const entitlements: Entitlements = query.data ?? getCurrentEntitlements();

  return {
    entitlements,
    isLoading: query.isLoading,
    canUse: (feature: FeatureKey) => canUseFeature(entitlements, feature),
    refetch: query.refetch,
    setPlan: (planId: 'free' | 'pro') => {
      setDevPlanOverride(planId);
      queryClient.setQueryData([...ENTITLEMENTS_QUERY_KEY, userId], getCurrentEntitlements());
      queryClient.invalidateQueries({ queryKey: ENTITLEMENTS_QUERY_KEY });
    },
  };
}

export { ENTITLEMENTS_QUERY_KEY };
