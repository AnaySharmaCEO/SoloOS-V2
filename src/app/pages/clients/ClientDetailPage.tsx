import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useClientDetail } from '../../../hooks/useClientDetail';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { StatusBadge } from '../../components/soloos/StatusBadge';
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
import {
  ArrowLeft,
  Mail,
  Smartphone,
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entitlements, canUse } = useEntitlements();
  const isPro = canUse('computed_client_health') || entitlements.planId === 'pro';

  const {
    client,
    timeline,
    loading,
    error,
    update,
    deleteClient,
    logWorkDelivered,
    proposeUpsell,
    requestReferral,
    scheduleReviewCall,
    markRetainerRenewed,
  } = useClientDetail(id, user?.user?.id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClient = async () => {
    setIsDeleting(true);
    const ok = await deleteClient();
    setIsDeleting(false);
    if (ok) {
      toast.success('Client deleted');
      navigate('/app/clients');
    } else {
      toast.error('Failed to delete client');
    }
  };

  // Form states for inline actions
  const [workNotes, setWorkNotes] = useState('');
  const [upsellText, setUpsellText] = useState('');
  const [referralSource, setReferralSource] = useState('');
  const [retainerVal, setRetainerVal] = useState('');

  // Editing Info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editHealth, setEditHealth] = useState('');
  const [editRetainerValue, setEditRetainerValue] = useState('');
  const [editRetainerActive, setEditRetainerActive] = useState(false);
  const [editNextAction, setEditNextAction] = useState('');

  // Notes edit state
  const [notesText, setNotesText] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const startEditing = () => {
    if (!client) return;
    setEditName(client.client_name);
    setEditCompany(client.company || '');
    setEditStatus(client.client_status);
    setEditHealth(client.account_health);
    setEditRetainerValue(String(client.retainer_value || 0));
    setEditRetainerActive(client.retainer_active);
    setEditNextAction(client.next_client_action || '');
    setIsEditingInfo(true);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await update({
      client_name: editName,
      company: editCompany || undefined,
      client_status: editStatus,
      account_health: editHealth,
      retainer_active: editRetainerActive,
      retainer_value: Number(editRetainerValue) || 0,
      next_client_action: editNextAction || undefined,
    });
    if (ok) {
      toast.success('Client settings updated');
      setIsEditingInfo(false);
    }
  };

  const handleSaveNotes = async () => {
    const ok = await update({ notes: notesText });
    if (ok) {
      toast.success('Strategic notes saved');
      setIsEditingNotes(false);
    }
  };

  const handleWorkDeliveredSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workNotes.trim()) return;
    const ok = await logWorkDelivered(workNotes.trim());
    if (ok) {
      toast.success('Work delivery logged');
      setWorkNotes('');
    }
  };

  const handleUpsellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!upsellText.trim()) return;
    const ok = await proposeUpsell(upsellText.trim());
    if (ok) {
      toast.success('Upsell offer registered');
      setUpsellText('');
    }
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralSource.trim()) return;
    const ok = await requestReferral(referralSource.trim());
    if (ok) {
      toast.success('Referral request logged');
      setReferralSource('');
    }
  };

  const handleRetainerRenewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(retainerVal);
    if (isNaN(val) || val <= 0) return;
    const ok = await markRetainerRenewed(val);
    if (ok) {
      toast.success('Retainer payment recorded');
      setRetainerVal('');
    }
  };

  if (loading && !client) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <p className="text-sm text-text-secondary">{error || 'Client record not found.'}</p>
        <Button asChild variant="outline" size="sm" className="bg-surface border-border text-text-primary">
          <Link to="/app/clients">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to clients
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusTone = (status: string): 'green' | 'amber' | 'slate' => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'amber';
      default: return 'slate';
    }
  };

  const getHealthTone = (health: string): 'green' | 'ember' | 'slate' => {
    switch (health) {
      case 'healthy': return 'green';
      case 'at_risk': return 'ember';
      case 'expansion_ready': return 'green';
      default: return 'slate';
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary p-4 md:p-8 max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top back link */}
      <div>
        <Link
          to="/app/clients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Client List</span>
        </Link>
      </div>

      {/* Main Client Header Card */}
      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              {client.client_name}
            </h1>
            <StatusBadge tone={getStatusTone(client.client_status)}>
              {client.client_status.replace('_', ' ')}
            </StatusBadge>
            <StatusBadge tone={getHealthTone(client.account_health)}>
              {client.account_health.replace('_', ' ')}
            </StatusBadge>
          </div>
          <p className="text-text-secondary text-xs font-medium">
            {client.company ? `Company: ${client.company}` : 'Independent Professional'} • Client since{' '}
            {new Date(client.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated">
            <Link to={`/app/leads/${client.lead_id}`}>View Lead Record</Link>
          </Button>
          <Button
            onClick={startEditing}
            size="sm"
            className="h-9 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
          >
            Edit Settings
          </Button>
          <Button
            onClick={() => setShowDeleteModal(true)}
            variant="ghost"
            size="sm"
            className="h-9 text-xs font-semibold text-danger hover:bg-danger-tint hover:text-danger flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete client</span>
          </Button>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Settings / Info Editor Pane */}
          {isEditingInfo && (
            <div className="bg-surface border border-border rounded-xl shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h3 className="font-bold text-sm text-text-primary">Edit Client Settings</h3>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(false)}
                  className="text-xs text-text-secondary hover:text-text-primary transition-colors"
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleSaveInfo} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Company</label>
                  <input
                    type="text"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Client Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs transition-colors"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="paused">Paused</option>
                    <option value="churned">Churned</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Account Health</label>
                  <select
                    value={editHealth}
                    onChange={(e) => setEditHealth(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs transition-colors"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="at_risk">At Risk</option>
                    <option value="expansion_ready">Expansion Ready</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Next Action</label>
                  <input
                    type="text"
                    value={editNextAction}
                    onChange={(e) => setEditNextAction(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs transition-colors"
                    placeholder="e.g. Schedule check-in call"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-text-secondary mb-1">Retainer Value ($ / MRR)</label>
                  <input
                    type="number"
                    value={editRetainerValue}
                    onChange={(e) => setEditRetainerValue(e.target.value)}
                    className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-text-primary outline-none focus:border-green text-xs font-mono transition-colors"
                  />
                </div>
                <div className="md:col-span-2 flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="editRetainerActive"
                    checked={editRetainerActive}
                    onChange={(e) => setEditRetainerActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-green focus:ring-green"
                  />
                  <label htmlFor="editRetainerActive" className="text-xs font-medium text-text-primary">
                    Active Monthly Retainer Contract
                  </label>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
                  >
                    Save Settings
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Account Health Intelligence — Pro (omitted cleanly for Free) */}
          {isPro && (
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-green" /> Account Health Intelligence
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-tint text-green">
                    Pro
                  </span>
                </div>
                <span className="text-[11px] text-text-secondary font-mono">Calibrated weekly</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-elevated rounded-lg border border-border">
                  <span className="text-[11px] text-text-secondary font-medium">Churn Risk Score</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        client.account_health === 'at_risk' ? 'bg-ember' : 'bg-green'
                      }`}
                    />
                    <span className="font-mono font-bold text-sm text-text-primary">
                      {client.account_health === 'at_risk'
                        ? 'Elevated (68%)'
                        : client.account_health === 'expansion_ready'
                        ? 'Very Low (12%)'
                        : 'Low (22%)'}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-text-secondary mt-1">
                    {client.account_health === 'at_risk'
                      ? 'No activity in 14+ days. Schedule check-in call.'
                      : 'Healthy interaction cadence.'}
                  </p>
                </div>

                <div className="p-3.5 bg-elevated rounded-lg border border-border">
                  <span className="text-[11px] text-text-secondary font-medium">Optimal Upsell Window</span>
                  <div className="font-mono font-bold text-sm text-green mt-1">
                    {client.account_health === 'expansion_ready'
                      ? 'Active Now'
                      : client.repeat_work_count > 1
                      ? 'In 3 weeks'
                      : 'Post-delivery'}
                  </div>
                  <p className="text-[10.5px] text-text-secondary mt-1">
                    {client.retainer_active
                      ? 'Pitch quarterly retainer expansion.'
                      : 'Frame monthly recurring retainer.'}
                  </p>
                </div>

                <div className="p-3.5 bg-elevated rounded-lg border border-border">
                  <span className="text-[11px] text-text-secondary font-medium">Contact Cadence</span>
                  <div className="font-mono font-bold text-sm text-text-primary mt-1">
                    {client.account_health === 'at_risk' ? 'Lapsed' : 'On Track'}
                  </div>
                  <p className="text-[10.5px] text-text-secondary mt-1">
                    Average interval: 6 days between touchpoints.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Relationship Metadata */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-green" /> Relationship Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-text-primary">
                  <Mail className="w-4 h-4 text-text-secondary" />
                  <div>
                    <p className="text-text-secondary text-[11px]">Email</p>
                    <p className="font-medium">{client.client_email || 'No email specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-text-primary">
                  <Smartphone className="w-4 h-4 text-text-secondary" />
                  <div>
                    <p className="text-text-secondary text-[11px]">Phone</p>
                    <p className="font-medium">{client.client_phone || 'No phone specified'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-text-secondary text-[11px]">Next Relationship Action</p>
                  <p className="font-semibold text-text-primary mt-0.5">
                    {client.next_client_action || 'No action pending'}
                  </p>
                </div>
                <div>
                  <p className="text-text-secondary text-[11px]">Last Contact Date</p>
                  <p className="font-mono text-text-primary mt-0.5">
                    {client.last_contact_date ? new Date(client.last_contact_date).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Playbook Actions Section */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Client Retention & Expansion Playbook
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Deliver Work */}
              <div className="p-3.5 bg-elevated rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2 font-semibold text-text-primary">
                  <CheckCircle className="w-4 h-4 text-green" />
                  <span>Log Work Delivered</span>
                </div>
                <form onSubmit={handleWorkDeliveredSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Milestone description..."
                    value={workNotes}
                    onChange={(e) => setWorkNotes(e.target.value)}
                    className="w-full bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-green transition-colors"
                  />
                  <Button type="submit" size="sm" className="w-full h-7 text-xs bg-green hover:bg-green-hover text-white">
                    Record delivery
                  </Button>
                </form>
              </div>

              {/* Propose Upsell */}
              <div className="p-3.5 bg-elevated rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2 font-semibold text-text-primary">
                  <TrendingUp className="w-4 h-4 text-green" />
                  <span>Propose Upsell</span>
                </div>
                <form onSubmit={handleUpsellSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Offer or package name..."
                    value={upsellText}
                    onChange={(e) => setUpsellText(e.target.value)}
                    className="w-full bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-green transition-colors"
                  />
                  <Button type="submit" size="sm" variant="outline" className="w-full h-7 text-xs bg-surface border-border text-text-primary hover:bg-elevated">
                    Log upsell
                  </Button>
                </form>
              </div>

              {/* Request Referral */}
              <div className="p-3.5 bg-elevated rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2 font-semibold text-text-primary">
                  <Sparkles className="w-4 h-4 text-text-secondary" />
                  <span>Request Referral</span>
                </div>
                <form onSubmit={handleReferralSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Source contact or note..."
                    value={referralSource}
                    onChange={(e) => setReferralSource(e.target.value)}
                    className="w-full bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-green transition-colors"
                  />
                  <Button type="submit" size="sm" variant="outline" className="w-full h-7 text-xs bg-surface border-border text-text-primary hover:bg-elevated">
                    Log referral
                  </Button>
                </form>
              </div>

              {/* Retainer Renew */}
              <div className="p-3.5 bg-elevated rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2 font-semibold text-text-primary">
                  <DollarSign className="w-4 h-4 text-green" />
                  <span>Renew Retainer Payment</span>
                </div>
                <form onSubmit={handleRetainerRenewSubmit} className="space-y-2">
                  <input
                    type="number"
                    placeholder="Payment amount ($)..."
                    value={retainerVal}
                    onChange={(e) => setRetainerVal(e.target.value)}
                    className="w-full bg-surface border border-border rounded-md px-2.5 py-1.5 text-xs text-text-primary outline-none focus:border-green font-mono transition-colors"
                  />
                  <Button type="submit" size="sm" variant="outline" className="w-full h-7 text-xs bg-surface border-border text-text-primary hover:bg-elevated">
                    Record payment
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Strategic Notes */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Strategic Account Notes
              </h3>
              {!isEditingNotes ? (
                <button
                  onClick={() => {
                    setNotesText(client.notes || '');
                    setIsEditingNotes(true);
                  }}
                  className="text-xs text-green hover:underline font-semibold"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSaveNotes} className="text-xs text-green font-semibold hover:underline">
                    Save
                  </button>
                  <button onClick={() => setIsEditingNotes(false)} className="text-xs text-text-secondary hover:underline">
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {isEditingNotes ? (
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                rows={5}
                className="w-full bg-elevated border border-border text-text-primary rounded-lg p-3 text-xs outline-none focus:border-green leading-relaxed transition-colors"
                placeholder="Write long-term account strategies, referral notes, or contract expectations..."
              />
            ) : (
              <div className="text-text-primary text-xs whitespace-pre-wrap leading-relaxed bg-elevated/40 rounded-lg p-3.5 border border-border min-h-[80px]">
                {client.notes ? client.notes : 'No strategic notes created yet. Click edit above to add notes.'}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Revenue Metrics Card */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Account Value</h3>
            <div className="space-y-3">
              {/* LTV */}
              <div className="p-3.5 bg-green-tint border border-green/30 rounded-xl">
                <p className="text-[11px] text-green font-semibold uppercase tracking-wider">Lifetime Value (LTV)</p>
                <div className="font-mono text-2xl font-bold text-text-primary mt-0.5">
                  ${(client.total_revenue || 0).toLocaleString()}
                </div>
              </div>

              {/* Repeat Jobs Count */}
              <div className="p-3.5 bg-elevated border border-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider">Repeat Jobs</p>
                  <p className="font-mono text-xl font-bold text-text-primary mt-0.5">{client.repeat_work_count}</p>
                </div>
                <RotateCcw className="w-5 h-5 text-text-secondary" />
              </div>

              {/* Retainer value if active */}
              {client.retainer_active && (
                <div className="p-3.5 bg-elevated border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-text-secondary font-semibold uppercase tracking-wider">Monthly Retainer</p>
                    <p className="font-mono text-xl font-bold text-green mt-0.5">
                      ${(client.retainer_value || 0).toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="w-5 h-5 text-green" />
                </div>
              )}

              {/* Upsell pipeline text */}
              {client.upsell_opportunity && (
                <div className="p-3.5 bg-ember-tint border border-ember/30 rounded-xl">
                  <p className="text-[11px] text-ember font-semibold uppercase tracking-wider">Active Upsell Opp</p>
                  <p className="text-xs font-medium text-text-primary mt-0.5 italic">"{client.upsell_opportunity}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <Clock className="w-4 h-4 text-text-secondary" /> Timeline History
            </h3>

            {timeline.length === 0 ? (
              <p className="text-xs text-text-secondary py-2 text-center">No timeline activity logged yet.</p>
            ) : (
              <div className="relative pl-3 border-l border-border space-y-4">
                {timeline.map((entry) => (
                  <div key={entry.id} className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-elevated border border-border text-text-primary">
                      {entry.action_type.replace('_', ' ')}
                    </span>
                    <p className="text-xs font-semibold text-text-primary leading-snug">{entry.action_label}</p>
                    <p className="text-[10px] text-text-secondary font-mono">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete client record permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{client.client_name}</strong>? All associated timeline entries, revenue history, and strategic notes will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
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
