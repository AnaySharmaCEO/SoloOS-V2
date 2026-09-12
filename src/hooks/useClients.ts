// Cached via React Query — see useLeads.ts for the caching rationale.
import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as clientService from '../services/client.service';
import type { Client, UpdateClientInput } from '../types';
import { QUERY_KEYS } from '../lib/queryClient';

export function useClients(userId: string | undefined) {
  const queryClient = useQueryClient();
  const [mutationError, setMutationError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: [QUERY_KEYS.clients, userId],
    queryFn: async () => {
      const result = await clientService.getAllClients(userId!);
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    },
    enabled: !!userId,
  });

  const update = useCallback(
    async (clientId: string, updates: UpdateClientInput) => {
      if (!userId) return false;
      setMutationError(null);
      const result = await clientService.updateClient(clientId, userId, updates);
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clientDetail, clientId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
      return true;
    },
    [userId, queryClient]
  );

  const deleteClient = useCallback(
    async (clientId: string) => {
      if (!userId) return false;
      setMutationError(null);
      const result = await clientService.deleteClient(clientId, userId);
      if (result.error) {
        setMutationError(result.error.message);
        return false;
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clients, userId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.clientDetail, clientId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboard, userId] });
      return true;
    },
    [userId, queryClient]
  );

  return {
    clients: (query.data ?? []) as Client[],
    loading: query.isLoading,
    error: mutationError || (query.error ? (query.error as Error).message : null),
    refresh: query.refetch,
    update,
    deleteClient,
  };
}
