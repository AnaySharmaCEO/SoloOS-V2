import { Link } from 'react-router';
import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle, Timer, Copy, Edit3, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFollowups } from '../../../hooks/useFollowups';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { EmptyState } from '../../components/app/EmptyState';
import { FollowUpSenderModal } from '../../components/app/FollowUpSenderModal';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export default function FollowUpsPage() {
  const { user } = useAuth();
  const { pending, urgent, loading, error, complete, snooze, update } = useFollowups(user?.user?.id);
  const { entitlements, canUse } = useEntitlements();
  const isPro = canUse('ai_followup_drafts') || entitlements.planId === 'pro';

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sendingLeadId, setSendingLeadId] = useState<string | null>(null);

  const FollowUpCard = ({ followUp }: { followUp: (typeof pending)[0] }) => {
    const isUrgent = followUp.urgency === 'urgent' || followUp.urgency === 'overdue';

    return (
      <div
        className={`bg-surface rounded-xl p-5 mb-3.5 border border-border shadow-sm space-y-3.5 transition-all ${
          isUrgent ? 'border-l-[3px] border-l-ember' : ''
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/app/leads/${followUp.lead_id}`}
                className="text-base font-bold text-text-primary hover:text-green transition-colors"
              >
                {followUp.lead_name || 'Opportunity'}
              </Link>
              {isUrgent && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-ember-tint text-ember">
                  Overdue
                </span>
              )}
            </div>
            {followUp.lead_company && (
              <p className="text-xs text-text-secondary mt-0.5">{followUp.lead_company}</p>
            )}
            <p className="text-xs font-medium text-text-primary mt-1.5">{followUp.reason}</p>
          </div>

          <div className="flex items-center gap-2">
            {isPro ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-tint text-green">
                <Sparkles className="w-2.5 h-2.5" /> Calibrated
              </span>
            ) : (
              <span className="text-[10px] font-medium text-text-secondary px-2 py-0.5 rounded-full bg-elevated border border-border">
                Template
              </span>
            )}
          </div>
        </div>

        {editingId === followUp.id ? (
          <div className="space-y-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-elevated border border-border rounded-lg p-3 text-xs text-text-primary outline-none focus:border-green min-h-[80px] transition-colors leading-relaxed"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  const ok = await update(followUp.id, { suggested_message: editText });
                  if (ok) {
                    toast.success('Follow-up message updated');
                    setEditingId(null);
                  } else {
                    toast.error('Failed to update message');
                  }
                }}
                className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
              >
                <Save className="w-3.5 h-3.5 mr-1" /> Save draft
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingId(null)}
                className="h-8 text-xs font-semibold bg-surface border-border text-text-primary"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs bg-elevated p-3.5 rounded-lg border border-border text-text-primary leading-relaxed">
            "{followUp.suggested_message || 'Hi there, just following up on our recent conversation — let me know if this is still top of mind for your team.'}"
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border">
          <Button
            type="button"
            size="sm"
            onClick={() => setSendingLeadId(followUp.lead_id)}
            className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white shadow-sm transition-colors"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" /> Send now
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (editingId === followUp.id) {
                setEditingId(null);
              } else {
                setEditingId(followUp.id);
                setEditText(followUp.suggested_message || '');
              }
            }}
            className="h-8 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            {editingId === followUp.id ? 'Cancel' : 'Edit draft'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(followUp.suggested_message || '');
              toast.success('Message copied to clipboard');
            }}
            className="h-8 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
          >
            <Copy className="w-3.5 h-3.5 mr-1" /> Copy
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              const ok = await complete(followUp.id);
              if (ok) {
                toast.success('Follow-up marked complete');
              } else {
                toast.error('Could not complete follow-up');
              }
            }}
            className="h-8 text-xs font-semibold text-green hover:bg-green-tint border-border ml-auto"
          >
            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Complete
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              const ok = await snooze(followUp.id, 1);
              if (ok) {
                toast.success('Follow-up snoozed 1 day');
              } else {
                toast.error('Could not snooze follow-up');
              }
            }}
            className="h-8 text-xs font-semibold bg-surface border-border text-text-secondary hover:text-text-primary"
          >
            <Timer className="w-3.5 h-3.5 mr-1" /> Snooze 1d
          </Button>
        </div>
      </div>
    );
  };

  if (!loading && pending.length === 0 && urgent.length === 0) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg flex items-center justify-center p-4">
        <EmptyState
          title="Your follow-up queue is clear"
          description="High-value opportunities and upcoming alert dates will automatically populate here."
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6 mb-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
            Follow-Up Queue
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Never let a warm conversation die of silence.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-6">
        {error && <p className="text-danger text-xs font-medium">{error}</p>}
        {loading ? (
          <div className="space-y-3">
            <div className="h-28 bg-surface border border-border rounded-xl animate-pulse" />
            <div className="h-28 bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        ) : (
          <>
            {urgent.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-ember" />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-ember">
                    Urgent Follow-Ups
                  </h2>
                </div>
                {urgent.map((f) => (
                  <FollowUpCard key={f.id} followUp={f} />
                ))}
              </section>
            )}

            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Pending Queue
                  </h2>
                </div>
                {pending.map((f) => (
                  <FollowUpCard key={f.id} followUp={f} />
                ))}
              </section>
            )}
          </>
        )}
      </div>

      <FollowUpSenderModal
        leadId={sendingLeadId}
        onClose={() => setSendingLeadId(null)}
        onMarkSent={() => {
          const f =
            pending.find((p) => p.lead_id === sendingLeadId) ||
            urgent.find((u) => u.lead_id === sendingLeadId);
          if (f) {
            complete(f.id).then((ok) => {
              if (ok) {
                toast.success('Follow-up marked sent');
              } else {
                toast.error('Failed to mark follow-up');
              }
            });
          }
          setSendingLeadId(null);
        }}
      />
    </div>
  );
}
