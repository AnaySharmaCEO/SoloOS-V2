import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Plus, Search, TrendingUp, AlertTriangle, Clock, X, LayoutGrid, List, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLeads } from '../../../hooks/useLeads';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { EmptyState } from '../../components/app/EmptyState';
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
import { UsageCapModal } from '../../components/soloos/UsageCapModal';
import type { Lead, LeadStage } from '../../../types';
import { toast } from 'sonner';

const STAGES: LeadStage[] = [
  'New Lead',
  'Contacted',
  'Waiting Reply',
  'Warm Lead',
  'Proposal Sent',
  'Won',
  'Lost',
];

const STAGE_STYLES: Record<string, { dot: string; border: string }> = {
  'New Lead': { dot: 'bg-text-secondary', border: 'border-border' },
  'Contacted': { dot: 'bg-text-secondary', border: 'border-border' },
  'Waiting Reply': { dot: 'bg-ember', border: 'border-ember/30' },
  'Warm Lead': { dot: 'bg-amber-500', border: 'border-amber-500/30' },
  'Proposal Sent': { dot: 'bg-green', border: 'border-green/40' },
  'Won': { dot: 'bg-green', border: 'border-green/50' },
  'Lost': { dot: 'bg-danger', border: 'border-danger/30' },
};

export default function LeadsPage() {
  const { user } = useAuth();
  const userId = user?.user?.id;
  const { leads, loading, error, createLead, deleteLead, applyFilters } = useLeads(userId);
  const { entitlements } = useEntitlements();
  const location = useLocation();

  const isFree = entitlements.planId === 'free';
  const activeLeadsCount = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').length;

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCapModal, setShowCapModal] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!leadToDelete) return;
    setIsDeleting(true);
    const success = await deleteLead(leadToDelete.id);
    setIsDeleting(false);
    if (success) {
      toast.success(`Deleted opportunity "${leadToDelete.name}"`);
      setLeadToDelete(null);
    } else {
      toast.error('Failed to delete opportunity');
    }
  };
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>(() => {
    try {
      const saved = localStorage.getItem('soloos_leads_view');
      if (saved === 'compact' || saved === 'detailed') return saved;
    } catch {}
    return 'detailed';
  });

  const handleViewModeChange = (mode: 'detailed' | 'compact') => {
    setViewMode(mode);
    try {
      localStorage.setItem('soloos_leads_view', mode);
    } catch {}
  };
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    stage: 'New Lead' as LeadStage,
    value: 0,
    source: 'Inbound' as const,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('add') === 'true') {
      if (isFree && activeLeadsCount >= 5) {
        setShowCapModal(true);
      } else {
        setShowAddModal(true);
      }
    }
  }, [location, isFree, activeLeadsCount]);

  useEffect(() => {
    const t = setTimeout(() => {
      applyFilters({ search: searchQuery || undefined });
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, applyFilters]);

  const getLeadsByStage = (stage: string) => leads.filter((l) => l.stage === stage);

  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'Won' && l.stage !== 'Lost')
    .reduce((sum, l) => sum + (l.estimated_value || 0), 0);
  const atRiskCount = leads.filter((l) => l.days_in_stage > 5 && l.stage !== 'Won' && l.stage !== 'Lost').length;

  const handleAddClick = () => {
    if (isFree && activeLeadsCount >= 5) {
      setShowCapModal(true);
    } else {
      setShowAddModal(true);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.name.trim()) return;
    const created = await createLead({
      name: newLead.name.trim(),
      company: newLead.company.trim() || undefined,
      email: newLead.email.trim() || undefined,
      phone: newLead.phone.trim() || undefined,
      stage: newLead.stage,
      source: newLead.source,
      estimated_value: newLead.value,
      channels: [
        ...(newLead.email ? [{ channel_type: 'Email' as const, channel_value: newLead.email }] : []),
        ...(newLead.phone ? [{ channel_type: 'Call' as const, channel_value: newLead.phone }] : []),
      ],
    });
    if (created) {
      toast.success('Opportunity added to pipeline');
      setShowAddModal(false);
      setNewLead({
        name: '',
        company: '',
        email: '',
        phone: '',
        stage: 'New Lead',
        value: 0,
        source: 'Inbound',
      });
    } else {
      toast.error('Failed to add opportunity');
    }
  };

  const renderAddModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-xl shadow-2xl p-6 max-w-md w-full animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <h2 className="text-base font-bold text-text-primary">Add Opportunity</h2>
          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="text-text-secondary hover:text-text-primary p-1 rounded-md cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-text-secondary mb-1">Opportunity name *</label>
            <input
              placeholder="e.g. Acme Corp Redesign or John Smith"
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block font-semibold text-text-secondary mb-1">Company</label>
            <input
              placeholder="e.g. Acme Inc."
              value={newLead.company}
              onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
              className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-text-secondary mb-1">Email</label>
              <input
                placeholder="email@example.com"
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm transition-colors"
              />
            </div>
            <div>
              <label className="block font-semibold text-text-secondary mb-1">Phone</label>
              <input
                placeholder="+1 555 000 0000"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm transition-colors"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-text-secondary mb-1">Estimated Value ($)</label>
              <input
                type="number"
                placeholder="2500"
                value={newLead.value || ''}
                onChange={(e) =>
                  setNewLead({ ...newLead, value: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm font-mono transition-colors"
              />
            </div>
            <div>
              <label className="block font-semibold text-text-secondary mb-1">Pipeline Stage</label>
              <select
                value={newLead.stage}
                onChange={(e) =>
                  setNewLead({ ...newLead, stage: e.target.value as LeadStage })
                }
                className="w-full px-3 py-2 bg-elevated border border-border rounded-lg text-text-primary outline-none focus:border-green text-sm transition-colors"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-2.5 mt-6 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddModal(false)}
            className="flex-1 h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddLead}
            className="flex-1 h-9 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
          >
            Add opportunity
          </Button>
        </div>
      </div>
    </div>
  );

  if (!loading && leads.length === 0 && !searchQuery) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg flex items-center justify-center relative p-4">
        <EmptyState onAddLead={handleAddClick} />
        {showAddModal && renderAddModal()}
        <UsageCapModal
          open={showCapModal}
          onOpenChange={setShowCapModal}
          type="leads"
          currentCount={activeLeadsCount}
          limit={5}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg text-text-primary overflow-hidden">
      {/* Header */}
      <div className="bg-surface border-b border-border flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                  Sales Pipeline
                </h1>
                {isFree && (
                  <Link
                    to="/app/settings/billing"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border border-border bg-elevated text-text-secondary hover:text-text-primary hover:border-text-secondary transition-colors"
                    title="Free plan limit: 5 active leads"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeLeadsCount >= 5 ? 'bg-ember' : 'bg-green'
                      }`}
                    />
                    <span>{activeLeadsCount}/5 active leads</span>
                  </Link>
                )}
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-1">
                Track active revenue opportunities from initial contact to closed deal.
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddClick}
              className="h-9 px-4 text-xs font-semibold bg-green hover:bg-green-hover text-white flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add opportunity</span>
            </Button>
          </div>

          {error && <p className="text-danger text-xs font-medium mb-3">{error}</p>}

          {/* Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-text-secondary text-xs font-medium">
                <TrendingUp className="w-4 h-4 text-green" />
                <span>Pipeline Value</span>
              </div>
              <div className="font-mono text-xl md:text-2xl font-bold text-text-primary">
                ${totalPipelineValue.toLocaleString()}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-text-secondary text-xs font-medium">
                <Clock className="w-4 h-4 text-text-secondary" />
                <span>Active Opportunities</span>
              </div>
              <div className="font-mono text-xl md:text-2xl font-bold text-text-primary">
                {leads.length}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1 text-text-secondary text-xs font-medium">
                <AlertTriangle className={`w-4 h-4 ${atRiskCount > 0 ? 'text-ember' : 'text-text-secondary'}`} />
                <span>Stuck / At Risk</span>
              </div>
              <div
                className={`font-mono text-xl md:text-2xl font-bold ${
                  atRiskCount > 0 ? 'text-ember' : 'text-text-primary'
                }`}
              >
                {atRiskCount}
              </div>
            </div>
          </div>

          {/* Controls: Search & View Toggle */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="relative max-w-sm flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search opportunities..."
                className="w-full pl-9 pr-3 py-2 bg-elevated border border-border rounded-lg text-xs text-text-primary outline-none focus:border-green placeholder:text-text-secondary transition-colors"
              />
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center p-1 bg-elevated border border-border rounded-xl shadow-2xs">
              <button
                type="button"
                onClick={() => handleViewModeChange('detailed')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'detailed'
                    ? 'bg-surface text-text-primary font-semibold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary font-medium'
                }`}
                title="Detailed Pipeline Board"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-surface text-text-primary font-semibold shadow-xs'
                    : 'text-text-secondary hover:text-text-primary font-medium'
                }`}
                title="Compact List View (Vertically scrollable)"
              >
                <List className="w-3.5 h-3.5" />
                <span>Compact List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
          Loading pipeline...
        </div>
      ) : viewMode === 'compact' ? (
        /* Compact List View (Vertically scrollable) */
        <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border bg-elevated/70 text-text-secondary font-semibold">
                    <th className="py-3 px-4">Opportunity</th>
                    <th className="py-3 px-4">Stage</th>
                    <th className="py-3 px-4">Est. Value</th>
                    <th className="py-3 px-4">Time in Stage</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Next Action</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-secondary">
                        No opportunities match your search.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const style = STAGE_STYLES[lead.stage] || STAGE_STYLES['New Lead'];
                      const isStuck = lead.days_in_stage > 5 && !['Won', 'Lost'].includes(lead.stage);

                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-elevated/70 transition-colors group cursor-pointer"
                          onClick={() => window.location.href = `/app/leads/${lead.id}`}
                        >
                          {/* Opportunity & Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-elevated border border-border flex items-center justify-center font-bold text-[11px] text-text-primary flex-shrink-0">
                                {lead.name.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-text-primary group-hover:text-green transition-colors truncate">
                                  {lead.name}
                                </p>
                                <p className="text-[11px] text-text-secondary truncate">
                                  {lead.company || 'Independent'}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Stage Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-elevated border border-border">
                              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                              <span className="text-text-primary">{lead.stage}</span>
                            </span>
                          </td>

                          {/* Estimated Value */}
                          <td className="py-3.5 px-4 font-mono font-semibold text-text-primary whitespace-nowrap">
                            ${(lead.estimated_value || 0).toLocaleString()}
                          </td>

                          {/* Time in Stage */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isStuck ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-ember bg-ember-tint px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                                <span>{lead.days_in_stage}d (stuck)</span>
                              </span>
                            ) : (
                              <span className="text-text-secondary text-[11.5px] font-mono">
                                {lead.days_in_stage}d
                              </span>
                            )}
                          </td>

                          {/* Source */}
                          <td className="py-3.5 px-4 text-text-secondary text-[11.5px] whitespace-nowrap">
                            {lead.source || 'Inbound'}
                          </td>

                          {/* Next Action */}
                          <td className="py-3.5 px-4 max-w-xs">
                            {lead.next_action ? (
                              <span className="text-[10.5px] font-medium text-green bg-green-tint px-2 py-0.5 rounded-md truncate inline-block max-w-full">
                                {lead.next_action}
                              </span>
                            ) : (
                              <span className="text-text-secondary/50 text-[11px] italic">None planned</span>
                            )}
                          </td>

                          {/* Action Links */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-2.5 justify-end">
                              <Link
                                to={`/app/leads/${lead.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-text-secondary group-hover:text-green transition-colors"
                              >
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLeadToDelete(lead);
                                }}
                                className="p-1 rounded text-text-secondary hover:text-danger hover:bg-danger-tint transition-colors cursor-pointer"
                                title="Delete opportunity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Board View (Horizontally scrollable) */
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Scrollable Board */}
          <div className="overflow-x-auto overflow-y-hidden px-4 md:px-8 py-6 scrollbar-thin flex-1 min-h-0">
            <div className="flex gap-4 min-w-max pb-4 h-full">
              {STAGES.map((stage) => {
                const leadsInStage = getLeadsByStage(stage);
                const stageValue = leadsInStage.reduce((s, l) => s + (l.estimated_value || 0), 0);
                const style = STAGE_STYLES[stage] || STAGE_STYLES['New Lead'];
                return (
                  <div
                    key={stage}
                    className="w-72 flex-shrink-0 bg-surface/70 border border-border rounded-xl p-3.5 flex flex-col h-full shadow-sm"
                  >
                    <div className="mb-3 px-1 flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        <h3 className="font-semibold text-xs text-text-primary">{stage}</h3>
                      </div>
                      <p className="text-[11.5px] font-medium text-text-secondary font-mono">
                        {leadsInStage.length} {leadsInStage.length === 1 ? 'lead' : 'leads'} · ${stageValue.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2.5 flex-1 overflow-y-auto scrollbar-thin pr-1 pb-2">
                      {leadsInStage.map((lead) => {
                        const isStuck = lead.days_in_stage > 5 && !['Won', 'Lost'].includes(lead.stage);
                        return (
                          <Link key={lead.id} to={`/app/leads/${lead.id}`} className="block group">
                            <div
                              className={`bg-surface rounded-xl p-3.5 border ${
                                isStuck ? 'border-l-[3px] border-l-ember border-border' : style.border
                              } hover:border-text-secondary/50 shadow-sm transition-all duration-150`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-xs text-text-primary group-hover:text-green transition-colors truncate">
                                  {lead.name}
                                </h4>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                  {isStuck && (
                                    <span
                                      className="w-2 h-2 rounded-full bg-ember mt-0.5"
                                      title={`Stuck in stage for ${lead.days_in_stage} days`}
                                    />
                                  )}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setLeadToDelete(lead);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-text-secondary hover:text-danger hover:bg-danger-tint transition-all cursor-pointer"
                                    title="Delete opportunity"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11.5px] text-text-secondary truncate mt-0.5 mb-2">
                                {lead.company || 'Independent'}
                              </p>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                                <p className="text-xs font-bold font-mono text-text-primary">
                                  ${(lead.estimated_value || 0).toLocaleString()}
                                </p>
                                {isStuck && (
                                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-ember-tint text-ember">
                                    {lead.days_in_stage}d in stage
                                  </span>
                                )}
                              </div>
                              {lead.next_action && (
                                <p className="text-[10.5px] font-medium text-green mt-2 bg-green-tint px-2 py-0.5 rounded-md truncate inline-block max-w-full">
                                  {lead.next_action}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-8 pb-3 text-[11px] text-text-secondary font-medium flex items-center gap-1.5 justify-end flex-shrink-0">
            <span>Scroll horizontally for all stages</span>
            <span className="w-1.5 h-1.5 bg-green rounded-full animate-pulse" />
          </div>
        </div>
      )}

      {showAddModal && renderAddModal()}

      <UsageCapModal
        open={showCapModal}
        onOpenChange={setShowCapModal}
        type="leads"
        currentCount={activeLeadsCount}
        limit={5}
      />

      <AlertDialog open={!!leadToDelete} onOpenChange={(open) => !open && setLeadToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete opportunity?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{leadToDelete?.name}</strong>? All associated notes, proposals, and history will be removed. This action cannot be undone.
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
