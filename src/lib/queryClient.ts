import { QueryClient } from '@tanstack/react-query';

/**
 * SoloOS caching rules (see the caching architecture note in
 * ARCHITECTURE.md): once a domain (leads, clients, proposals, follow-ups,
 * dashboard) is fetched, it stays in memory and is reused across route
 * changes. It should only refetch when:
 *   1. The browser is hard-refreshed (cache is naturally gone — nothing
 *      to configure).
 *   2. The user explicitly triggers a refresh action for that page.
 *   3. A mutation in that domain succeeds (create/edit/delete/stage move)
 *      — the owning hook calls `queryClient.invalidateQueries` for its
 *      own key only, never a blanket invalidation.
 *
 * staleTime: Infinity + refetchOnWindowFocus/refetchOnMount: false is what
 * encodes rule (2)/(3) — TanStack Query will otherwise refetch on window
 * refocus or remount by default, which is exactly the "reloads on every
 * page switch" behavior we're removing.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 30 * 60 * 1000, // keep cached data 30 min after last use
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

/** Domain-scoped query key roots. Every hook should build its keys from
 *  these so invalidation stays precise — e.g. invalidating 'leads' never
 *  touches 'clients' or 'dashboard'. Composite views (like the dashboard,
 *  which reads counts derived from leads/proposals) should list their
 *  source domains in DEPENDENTS below so a mutation in a source domain
 *  can also refresh the pages that summarize it. */
export const QUERY_KEYS = {
  leads: 'leads',
  leadDetail: 'lead-detail',
  clients: 'clients',
  clientDetail: 'client-detail',
  proposals: 'proposals',
  followups: 'followups',
  dashboard: 'dashboard',
  pricing: 'pricing',
  entitlements: 'entitlements',
  profile: 'profile',
} as const;

/** Domains whose data feeds into the dashboard's aggregate view. A
 *  mutation in any of these should also invalidate 'dashboard' so its
 *  counts stay correct — this is the one intentional exception to
 *  "only invalidate your own domain," since the dashboard is explicitly
 *  a derived/composite view, not a domain of its own. */
export const DASHBOARD_DEPENDENT_DOMAINS = [
  QUERY_KEYS.leads,
  QUERY_KEYS.clients,
  QUERY_KEYS.proposals,
  QUERY_KEYS.followups,
] as const;
