import { Link } from 'react-router';
import { useState } from 'react';
import { CheckCircle2, XCircle, Send, X, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProposals } from '../../../hooks/useProposals';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { EmptyState } from '../../components/app/EmptyState';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export default function ProposalsPage() {
  const { user } = useAuth();
  const { proposals, pending, delayed, loading, error, accept, reject, remind } = useProposals(
    user?.user?.id
  );
  const { entitlements } = useEntitlements();
  const isPro = entitlements.planId === 'pro';

  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    await reject(rejectId, rejectReason.trim());
    toast.success('Proposal marked rejected');
    setRejectId(null);
    setRejectReason('');
  };

  if (!loading && proposals.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg flex items-center justify-center p-4">
        <EmptyState
          title="No active proposals"
          description="Structure a strategic pricing proposal from any pipeline opportunity to track replies here."
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6 mb-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
              Active Proposals
            </h1>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
              {pending.length} {pending.length === 1 ? 'proposal' : 'proposals'} waiting on client decisions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-4">
        {error && <p className="text-danger text-xs font-medium">{error}</p>}

        {loading ? (
          <div className="space-y-3">
            <div className="h-28 bg-surface border border-border rounded-xl animate-pulse" />
            <div className="h-28 bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Delayed proposals section */}
            {delayed.map((p) => (
              <div
                key={p.id}
                className="bg-surface border border-border border-l-[3px] border-l-ember rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/app/leads/${p.lead_id}`}
                      className="font-bold text-base text-text-primary hover:text-green transition-colors"
                    >
                      {p.lead_name}
                    </Link>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-ember-tint text-ember">
                      {p.days_waiting} days overdue
                    </span>
                  </div>
                  {p.lead_company && (
                    <p className="text-xs text-text-secondary">{p.lead_company}</p>
                  )}
                  {(p.lead_email || p.lead_phone) && (
                    <div className="flex flex-wrap gap-x-2 text-[11.5px] text-text-secondary font-mono">
                      {p.lead_email && <span>{p.lead_email}</span>}
                      {p.lead_phone && <span>· {p.lead_phone}</span>}
                    </div>
                  )}
                  {isPro && (
                    <p className="text-[11.5px] text-text-secondary flex items-center gap-1 mt-1">
                      <Clock className="w-3.5 h-3.5 text-ember" />
                      <span>Clients like this typically respond within 5 days. Consider following up.</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 flex-shrink-0">
                  <div className="font-mono text-xl font-bold text-text-primary">
                    ${p.amount.toLocaleString()}
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      remind(p.id);
                      toast.success('Reminder logged');
                    }}
                    className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Send Reminder
                  </Button>
                </div>
              </div>
            ))}

            {/* Pending proposals section */}
            {pending.map((p) => (
              <div key={p.id} className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <Link
                      to={`/app/leads/${p.lead_id}`}
                      className="font-bold text-base text-text-primary hover:text-green transition-colors"
                    >
                      {p.lead_name}
                    </Link>
                    {p.lead_company && <p className="text-xs text-text-secondary">{p.lead_company}</p>}
                    {(p.lead_email || p.lead_phone) && (
                      <div className="flex flex-wrap gap-x-2 text-[11.5px] text-text-secondary font-mono">
                        {p.lead_email && <span>{p.lead_email}</span>}
                        {p.lead_phone && <span>· {p.lead_phone}</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <p className="text-[11px] text-text-secondary font-mono">
                        Sent {new Date(p.sent_date).toLocaleDateString()}
                      </p>
                      {isPro && (
                        <span className="text-[11px] text-text-secondary">
                          · Clients like this typically respond within 5 days
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="font-mono text-xl font-bold text-text-primary">
                    ${p.amount.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      accept(p.id);
                      toast.success('Proposal marked accepted — won deal created!');
                    }}
                    className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Mark accepted
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      remind(p.id);
                      toast.success('Follow-up reminder sent');
                    }}
                    className="h-8 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Send reminder
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRejectId(p.id)}
                    className="h-8 text-xs font-semibold text-danger hover:bg-danger-tint hover:text-danger ml-auto transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Dialog */}
        {rejectId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
                <h3 className="font-bold text-sm text-text-primary">Rejection Reason</h3>
                <button
                  onClick={() => setRejectId(null)}
                  className="text-text-secondary hover:text-text-primary p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                Logging reasons helps SoloOS adjust strategic pricing warnings for future proposals.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-elevated border border-border rounded-lg p-3 text-xs text-text-primary outline-none focus:border-green mb-4 min-h-[80px] transition-colors leading-relaxed"
                placeholder="e.g. Budget constraints, opted for internal team, timing mismatched..."
              />
              <div className="flex gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectId(null)}
                  className="flex-1 h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleReject}
                  className="flex-1 h-9 text-xs font-semibold bg-danger hover:bg-danger/90 text-white transition-colors shadow-sm"
                >
                  Confirm rejection
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
