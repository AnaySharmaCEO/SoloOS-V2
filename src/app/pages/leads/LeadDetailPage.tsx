import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, AlertCircle, Calendar, DollarSign, Clock, Plus, Send, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeadDetail } from '../../../hooks/useLeadDetail';
import { SendMessageModal } from '../../components/app/SendMessageModal';
import { MoveStageModal } from '../../components/app/MoveStageModal';
import { AddProposalModal } from '../../components/app/AddProposalModal';
import { Button } from '../../components/ui/button';
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
import { StatusBadge } from '../../components/soloos/StatusBadge';
import * as leadService from '../../../services/lead.service';
import * as followupService from '../../../services/followup.service';
import type { ContactChannelType } from '../../../types';
import { toast } from 'sonner';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.user?.id;

  const {
    lead,
    notes,
    activity,
    channels,
    proposals,
    loading,
    error,
    addNote,
    moveStage,
    archive,
    deleteLead,
    refresh,
    addProposal,
  } = useLeadDetail(id, userId);

  const [showSend, setShowSend] = useState(false);
  const [showMoveStage, setShowMoveStage] = useState(false);
  const [showAddProposal, setShowAddProposal] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleDeleteLead = async () => {
    setIsDeleting(true);
    const ok = await deleteLead();
    setIsDeleting(false);
    if (ok) {
      toast.success('Opportunity deleted');
      navigate('/app/leads');
    } else {
      toast.error('Failed to delete opportunity');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <p className="text-sm text-text-secondary">{error || 'Opportunity not found.'}</p>
        <Button asChild variant="outline" size="sm" className="bg-surface border-border text-text-primary">
          <Link to="/app/leads">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to pipeline
          </Link>
        </Button>
      </div>
    );
  }

  const handleMarkSent = async (channel: ContactChannelType, message: string) => {
    if (!userId || !id) return false;
    const r = await leadService.recordMessageSent(userId, id, channel, message);
    if (!r.error) await refresh();
    return !r.error;
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    const ok = await addNote(noteText.trim());
    if (ok) {
      toast.success('Note added to opportunity');
      setNoteText('');
      setShowAddNote(false);
    } else {
      toast.error('Failed to save note');
    }
  };

  const isStuck = lead.days_in_stage > 5 && lead.stage !== 'Won' && lead.stage !== 'Lost';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top back link */}
      <div>
        <Link
          to="/app/leads"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sales Pipeline</span>
        </Link>
      </div>

      {/* Main Lead Header Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                {lead.name}
              </h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-elevated border border-border text-text-primary">
                {lead.stage}
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">
              {lead.company || 'Independent Professional'} {lead.email ? `· ${lead.email}` : ''}
            </p>
            {lead.lost_reason && (
              <p className="mt-2 text-xs font-semibold text-danger">Reason lost: {lead.lost_reason}</p>
            )}
          </div>
          <div className="md:text-right">
            <div className="text-xs font-medium text-text-secondary">Estimated Deal Value</div>
            <div className="font-mono text-2xl md:text-3xl font-bold text-green mt-0.5">
              ${(lead.estimated_value || 0).toLocaleString()}
            </div>
            {lead.next_action && (
              <p className="text-xs text-text-secondary font-medium mt-1">
                Next: <span className="text-green font-semibold">{lead.next_action}</span>
              </p>
            )}
          </div>
        </div>

        {isStuck && (
          <div className="bg-ember-tint border border-ember/30 p-3.5 rounded-xl flex items-center gap-2.5 text-xs text-ember font-medium">
            <AlertCircle className="w-4 h-4 text-ember flex-shrink-0" />
            <span>
              This opportunity has been in <strong>{lead.stage}</strong> for {lead.days_in_stage} days without activity.
            </span>
          </div>
        )}
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Columns: Timeline & Notes */}
        <div className="md:col-span-2 space-y-6">
          {/* Activity Timeline */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Clock className="w-4 h-4 text-green" />
              <span>Activity Timeline</span>
            </h2>
            {activity.length === 0 ? (
              <p className="text-xs text-text-secondary py-2">No activity logged for this opportunity yet.</p>
            ) : (
              <div className="space-y-3">
                {activity.map((a) => (
                  <div key={a.id} className="border-l-2 border-green/40 pl-3 py-0.5">
                    <p className="text-xs font-semibold text-text-primary">{a.action_label}</p>
                    <p className="text-[11px] text-text-secondary font-mono mt-0.5">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Notes & Key Details
              </h2>
              {!showAddNote && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddNote(true)}
                  className="h-7 px-2.5 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add note
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="bg-elevated p-3.5 rounded-lg border border-border">
                  <p className="text-xs text-text-primary leading-relaxed">{note.content}</p>
                  <p className="text-[10px] text-text-secondary font-mono mt-2">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))}

              {showAddNote ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full bg-elevated border border-border text-text-primary rounded-lg p-3 text-xs outline-none focus:border-green min-h-[80px] transition-colors"
                    placeholder="Record meeting notes, client constraints, or next steps..."
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddNote}
                      className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
                    >
                      Save note
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddNote(false)}
                      className="h-8 text-xs font-semibold bg-surface border-border text-text-primary"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : notes.length === 0 ? (
                <p className="text-xs text-text-secondary py-2">
                  No notes added yet. Click above to log your first note.
                </p>
              ) : null}
            </div>
          </div>

          {/* Proposals History */}
          {proposals.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Proposals Sent
              </h2>
              <div className="divide-y divide-border">
                {proposals.map((p) => (
                  <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-semibold text-text-primary">
                        ${p.amount.toLocaleString()}
                      </span>
                      <span className="text-text-secondary ml-2">
                        sent {new Date(p.sent_date).toLocaleDateString()}
                      </span>
                    </div>
                    <StatusBadge
                      tone={p.status === 'accepted' ? 'green' : p.status === 'rejected' ? 'danger' : 'slate'}
                    >
                      {p.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Quick info & Quick actions */}
        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Opportunity Summary
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-text-secondary">Last contact</p>
                  <p className="font-semibold font-mono text-text-primary mt-0.5">
                    {lead.last_contact_date ? new Date(lead.last_contact_date).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-4 h-4 text-text-secondary mt-0.5" />
                <div>
                  <p className="text-text-secondary">Deal size</p>
                  <p className="font-semibold font-mono text-text-primary mt-0.5">
                    ${(lead.estimated_value || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-text-secondary mb-1.5">Contact Channels</p>
                {channels.length ? (
                  <div className="flex flex-wrap gap-1">
                    {channels.map((c) => (
                      <span
                        key={c.id}
                        className="px-2 py-0.5 bg-elevated border border-border text-text-primary rounded-md text-[11px] font-medium"
                      >
                        {c.channel_type}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-secondary text-[11px]">None configured</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Actions</h2>
            <div className="space-y-2">
              <Button
                type="button"
                onClick={() => setShowSend(true)}
                className="w-full h-9 text-xs font-semibold bg-green hover:bg-green-hover text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lead.stage === 'New Lead' ? 'Send first message' : 'Send follow-up'}</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddProposal(true)}
                className="w-full h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
              >
                Structure proposal
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMoveStage(true)}
                className="w-full h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
              >
                Change stage
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
              >
                <Link to="/app/pricing" state={{ leadId: lead.id }}>
                  Run pricing model
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  if (!userId) return;
                  const r = await followupService.scheduleCall(userId, lead.id, lead.name);
                  if (r.error) toast.error(r.error.message);
                  else {
                    toast.success('Call scheduled for tomorrow');
                    await refresh();
                  }
                }}
                className="w-full h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
              >
                Schedule call
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={async () => {
                  if (confirm('Archive this opportunity?')) {
                    await archive();
                    navigate('/app/leads');
                  }
                }}
                className="w-full h-9 text-xs font-semibold text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors"
              >
                Archive opportunity
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteModal(true)}
                className="w-full h-9 text-xs font-semibold text-danger hover:bg-danger-tint hover:text-danger flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete opportunity</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SendMessageModal
        open={showSend}
        onClose={() => setShowSend(false)}
        lead={lead}
        channels={channels}
        onMarkSent={handleMarkSent}
      />

      <MoveStageModal
        open={showMoveStage}
        onClose={() => setShowMoveStage(false)}
        currentStage={lead.stage}
        onConfirm={async (stage, lostReason, winReason) => {
          const ok = await moveStage({ stage, lost_reason: lostReason, win_reason: winReason });
          if (ok) {
            if (stage === 'Won') {
              toast.success('Client record created from won deal');
            } else {
              toast.success('Stage updated successfully');
            }
          } else {
            toast.error('Could not move stage');
          }
          return ok;
        }}
      />

      <AddProposalModal
        open={showAddProposal}
        onClose={() => setShowAddProposal(false)}
        lead={lead}
        onAddProposal={async (data) => {
          const ok = await addProposal(data);
          if (ok) {
            toast.success('Proposal recorded successfully');
          } else {
            toast.error('Failed to record proposal');
          }
          return ok;
        }}
      />

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete opportunity permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{lead.name}</strong>? This will permanently remove the opportunity and all its associated proposals, notes, and activity history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLead}
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
