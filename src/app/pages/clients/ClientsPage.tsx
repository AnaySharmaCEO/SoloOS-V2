import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useClients } from '../../../hooks/useClients';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { EmptyState } from '../../components/app/EmptyState';
import { StatusBadge } from '../../components/soloos/StatusBadge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { ArrowUpRight, Trash2 } from 'lucide-react';
import type { Client } from '../../../types';
import { toast } from 'sonner';

export default function ClientsPage() {
  const { user } = useAuth();
  const { clients, loading, error, deleteClient } = useClients(user?.user?.id);
  const { entitlements } = useEntitlements();

  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    const ok = await deleteClient(clientToDelete.id);
    setIsDeleting(false);
    if (ok) {
      toast.success(`Deleted client "${clientToDelete.client_name}"`);
      setClientToDelete(null);
    } else {
      toast.error('Failed to delete client');
    }
  };

  const isFree = entitlements.planId === 'free';
  const isPro = entitlements.planId === 'pro';
  const activeClientsCount = clients.filter((c) => c.client_status === 'active').length;

  if (!loading && clients.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg flex items-center justify-center p-4">
        <EmptyState
          title="No active clients yet"
          description="Client records are automatically created when a pipeline opportunity is marked as Won."
        />
      </div>
    );
  }

  const getHealthTone = (health: string): 'green' | 'ember' | 'slate' => {
    switch (health) {
      case 'healthy':
        return 'green';
      case 'at_risk':
        return 'ember';
      case 'expansion_ready':
        return 'green';
      default:
        return 'slate';
    }
  };

  const getStatusTone = (status: string): 'green' | 'amber' | 'slate' => {
    switch (status) {
      case 'active':
        return 'green';
      case 'paused':
        return 'amber';
      case 'churned':
      case 'inactive':
        return 'slate';
      default:
        return 'slate';
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                Clients & Retainers
              </h1>
              {isFree && (
                <Link
                  to="/app/settings/billing"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border border-border bg-elevated text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                  title="Free plan limit: 2 active clients"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeClientsCount >= 2 ? 'bg-ember' : 'bg-green'
                    }`}
                  />
                  <span>{activeClientsCount}/2 active clients</span>
                </Link>
              )}
            </div>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
              Active relationships, retainer contracts, upsells, and account history.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {error && <p className="text-danger text-xs font-medium">{error}</p>}

        {loading ? (
          <div className="p-12 text-center text-text-secondary text-sm flex items-center justify-center">
            Loading client records...
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-elevated/60 border-b border-border text-text-secondary font-semibold">
                  <tr>
                    <th className="p-3.5 font-semibold">Client</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold">Revenue / MRR</th>
                    <th className="p-3.5 font-semibold">Next Relationship Action</th>
                    <th className="p-3.5 font-semibold">Account Health</th>
                    <th className="p-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {clients.map((c) => {
                    const isAtRisk = c.account_health === 'at_risk';
                    return (
                      <tr key={c.id} className="hover:bg-elevated/40 transition-colors">
                        <td className="p-3.5">
                          <p className="font-semibold text-text-primary text-sm">{c.client_name}</p>
                          <p className="text-text-secondary text-[11px]">{c.company || 'Independent'}</p>
                          <div className="flex gap-2 items-center mt-1 text-[11px]">
                            <Link
                              to={`/app/clients/${c.id}`}
                              className="font-medium text-green hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Open profile</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            <span className="text-border">•</span>
                            <Link to={`/app/leads/${c.lead_id}`} className="text-text-secondary hover:underline">
                              Lead record
                            </Link>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <StatusBadge tone={getStatusTone(c.client_status)}>
                            {c.client_status.replace('_', ' ')}
                          </StatusBadge>
                        </td>

                        <td className="p-3.5">
                          <p className="font-mono font-semibold text-text-primary text-sm">
                            ${(c.total_revenue || 0).toLocaleString()}
                          </p>
                          {c.retainer_active && (
                            <p className="text-[11px] text-green font-medium">
                              Retainer (${(c.retainer_value || 0).toLocaleString()}/mo)
                            </p>
                          )}
                          {c.repeat_work_count > 0 && (
                            <p className="text-[11px] text-text-secondary">{c.repeat_work_count} repeat jobs</p>
                          )}
                        </td>

                        <td className="p-3.5 font-medium text-text-primary max-w-[220px]">
                          {c.next_client_action ? (
                            <span className="line-clamp-2">{c.next_client_action}</span>
                          ) : (
                            <span className="text-text-secondary">—</span>
                          )}
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            {isPro && isAtRisk && (
                              <span
                                className="w-2 h-2 rounded-full bg-ember flex-shrink-0 animate-pulse"
                                title="At risk account"
                              />
                            )}
                            <StatusBadge tone={getHealthTone(c.account_health)}>
                              {c.account_health.replace('_', ' ')}
                            </StatusBadge>
                          </div>
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setClientToDelete(c)}
                            className="p-1 rounded text-text-secondary hover:text-danger hover:bg-danger-tint transition-colors cursor-pointer"
                            title="Delete client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client record?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{clientToDelete?.client_name}</strong>? All associated account history and timeline logs will be removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-danger hover:bg-danger/90 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
