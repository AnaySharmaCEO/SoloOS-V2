import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Plus, Download, Clock, Flame, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../../hooks/useDashboard';
import { useLeads } from '../../../hooks/useLeads';
import { useProposals } from '../../../hooks/useProposals';
import { useClients } from '../../../hooks/useClients';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { EmptyState } from '../../components/app/EmptyState';
import { Button } from '../../components/ui/button';
import { UsageCapModal } from '../../components/soloos/UsageCapModal';
import { toast } from 'sonner';
import { exportAllWorkspaceData } from '../../../lib/dataExporter';

function formatLastExported(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return `Today at ${timeString}`;
  } else if (isYesterday) {
    return `Yesterday at ${timeString}`;
  } else {
    return `${date.toLocaleDateString()} at ${timeString}`;
  }
}

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.user?.id;
  const { metrics, actionItems, loading } = useDashboard(userId);
  const { leads } = useLeads(userId);
  const { proposals } = useProposals(userId);
  const { clients } = useClients(userId);
  const { entitlements, canUse } = useEntitlements();

  const [exporting, setExporting] = useState(false);
  const [lastExported, setLastExported] = useState<string | null>(null);
  const [showCapModal, setShowCapModal] = useState(false);

  useEffect(() => {
    const savedExportTime = localStorage.getItem('last_data_export_time');
    if (savedExportTime) {
      setLastExported(formatLastExported(savedExportTime));
    }
  }, []);

  const handleExportData = async () => {
    setExporting(true);
    const result = await exportAllWorkspaceData(userId);
    setExporting(false);
    if (result.success) {
      toast.success('Export ready — downloading now');
      const nowStr = new Date().toISOString();
      localStorage.setItem('last_data_export_time', nowStr);
      setLastExported(formatLastExported(nowStr));
    } else {
      toast.error('Export failed — please try again');
    }
  };

  const isFree = entitlements.planId === 'free';
  const activeLeadsCount = leads.filter(
    (l) => l.stage !== 'Won' && l.stage !== 'Lost'
  ).length;

  const firstName =
    user?.profile?.full_name?.trim()?.split(' ')[0] ||
    user?.user?.email?.split('@')[0] ||
    'there';

  const sortedActionItems = useMemo(() => {
    if (!actionItems || actionItems.length === 0) return [];
    if (entitlements.planId === 'pro') {
      // Deal Radar prioritization: urgent items first, then higher value deals, then warm leads
      return [...actionItems].sort((a, b) => {
        const aUrgent = a.type === 'overdue' || a.type === 'followup' || a.urgency === 'urgent';
        const bUrgent = b.type === 'overdue' || b.type === 'followup' || b.urgency === 'urgent';
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        const aVal = Number(a.value) || 0;
        const bVal = Number(b.value) || 0;
        return bVal - aVal;
      });
    }
    return actionItems;
  }, [actionItems, entitlements.planId]);

  const isEmptyState =
    !loading &&
    metrics &&
    metrics.total_leads_count === 0 &&
    metrics.total_proposals_count === 0 &&
    metrics.total_clients_count === 0;

  if (isEmptyState) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg flex items-center justify-center">
        <EmptyState />
      </div>
    );
  }

  // Stage breakdown for Pipeline Snapshot fetching from leads, proposals, and clients
  const stageStats = useMemo(() => {
    // 1. New Lead
    const newLeads = leads.filter((l) => l.stage === 'New Lead');
    const newVal = newLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);

    // 2. Contacted
    const contactedLeads = leads.filter((l) => l.stage === 'Contacted');
    const contactedVal = contactedLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);

    // 3. Waiting Reply
    const waitingLeads = leads.filter((l) => l.stage === 'Waiting Reply');
    const waitingVal = waitingLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);

    // 4. Warm Lead
    const warmLeads = leads.filter((l) => l.stage === 'Warm Lead');
    const warmVal = warmLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);

    // 5. Proposal Sent (combining leads with stage 'Proposal Sent' and active proposals)
    const proposalLeads = leads.filter((l) => l.stage === 'Proposal Sent');
    const pendingProposals = proposals.filter((p) => p.status === 'Pending' || p.status === 'Sent');
    const proposalLeadsVal = proposalLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);
    const pendingProposalsVal = pendingProposals.reduce((acc, p) => acc + (p.amount || 0), 0);
    const proposalVal = Math.max(proposalLeadsVal, pendingProposalsVal);
    const proposalCount = Math.max(proposalLeads.length, pendingProposals.length);

    // 6. Closed Won (combining won leads, accepted proposals, and active clients)
    const wonLeads = leads.filter((l) => l.stage === 'Won');
    const acceptedProposals = proposals.filter((p) => p.status === 'Accepted');
    const activeClients = clients.filter((c) => c.client_status === 'active');
    const wonVal =
      wonLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0) +
      acceptedProposals.reduce((acc, p) => acc + (p.amount || 0), 0) +
      activeClients.reduce((acc, c) => acc + (c.retainer_amount || c.total_revenue || 0), 0);
    const wonCount = Math.max(wonLeads.length, activeClients.length + acceptedProposals.length);

    const items = [
      { name: 'New Lead', count: newLeads.length, value: newVal, barColor: 'bg-text-secondary/40', href: '/app/leads' },
      { name: 'Contacted', count: contactedLeads.length, value: contactedVal, barColor: 'bg-text-secondary/60', href: '/app/leads' },
      { name: 'Waiting Reply', count: waitingLeads.length, value: waitingVal, barColor: 'bg-ember', href: '/app/leads' },
      { name: 'Warm Lead', count: warmLeads.length, value: warmVal, barColor: 'bg-amber-500', href: '/app/leads' },
      { name: 'Proposal Sent', count: proposalCount, value: proposalVal, barColor: 'bg-green/70', href: '/app/proposals' },
      { name: 'Closed Won', count: wonCount, value: wonVal, barColor: 'bg-green', href: '/app/clients' },
    ];

    const totalCalculated = items.reduce((acc, s) => acc + s.value, 0) || metrics?.total_pipeline_value || 1;

    return items.map((st) => ({
      ...st,
      pct: Math.min(100, Math.round((st.value / totalCalculated) * 100)),
    }));
  }, [leads, proposals, clients, metrics]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Page Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                Good morning, {firstName}
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
              Here's what actually needs you today.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={exporting}
              className="h-9 px-3.5 text-xs font-semibold bg-surface border-border hover:bg-elevated text-text-primary"
            >
              {exporting ? (
                <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Export data</span>
            </Button>

            {isFree && activeLeadsCount >= 5 ? (
              <Button
                size="sm"
                onClick={() => setShowCapModal(true)}
                className="h-9 px-4 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add opportunity</span>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="h-9 px-4 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
              >
                <Link to="/app/leads?add=true">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add opportunity</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Weekly Revenue Debrief Card — shown for Pro users (absence over padlock for Free) */}
        {canUse('revenue_debrief') && (
          <Link
            to="/app/debrief"
            className="flex items-center justify-between p-4 md:p-5 bg-surface border border-border rounded-xl hover:border-green/50 transition-all group shadow-sm"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-green-tint text-green flex items-center justify-center flex-shrink-0 font-bold text-sm">
                ✦
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-text-primary group-hover:text-green transition-colors">
                    Your Monday debrief is ready
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-tint text-green">
                    Pro
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate mt-0.5">
                  See how your pipeline moved last week and what's gone quiet.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-green group-hover:translate-x-0.5 transition-transform flex-shrink-0 ml-3">
              <span className="hidden sm:inline">View debrief</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        )}

        {/* Section: Needs you right now */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-primary">
              <span className="w-2 h-2 rounded-full bg-ember" />
              <span>Needs you right now</span>
            </div>
            {lastExported && (
              <span className="text-[11px] text-text-secondary">
                Last exported: <span className="font-mono font-medium text-text-primary">{lastExported}</span>
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-2.5">
              <div className="h-14 bg-surface border border-border rounded-xl animate-pulse" />
              <div className="h-14 bg-surface border border-border rounded-xl animate-pulse" />
            </div>
          ) : sortedActionItems.length === 0 ? (
            <div className="p-6 bg-surface border border-border rounded-xl text-left shadow-sm">
              <p className="text-sm font-semibold text-text-primary">You are fully caught up for today</p>
              <p className="text-xs text-text-secondary mt-1">
                Add new leads or structure a pricing proposal to keep your pipeline moving forward.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sortedActionItems.slice(0, 6).map((item: any) => {
                const isUrgent = item.type === 'overdue' || item.type === 'followup' || item.urgency === 'urgent';
                const isWarm = item.type === 'warm_lead';

                return (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={item.href || '/app/leads'}
                    className={`flex items-center justify-between p-4 bg-surface border border-border rounded-xl transition-all group cursor-pointer shadow-sm hover:border-text-secondary/40 ${
                      isUrgent ? 'border-l-[3px] border-l-ember' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isUrgent
                            ? 'bg-ember-tint text-ember'
                            : isWarm
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-elevated text-text-secondary'
                        }`}
                      >
                        {isUrgent ? (
                          <Clock className="w-4 h-4" />
                        ) : isWarm ? (
                          <Flame className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-text-primary group-hover:text-green transition-colors truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      {isUrgent ? (
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-ember-tint text-ember">
                          Overdue
                        </span>
                      ) : isWarm ? (
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                          Warm
                        </span>
                      ) : (
                        <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-elevated text-text-secondary">
                          Pending
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Subordinate Stat Tiles */}
        {metrics && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 md:p-5 bg-surface border border-border rounded-xl shadow-sm">
              <div className="text-xs text-text-secondary mb-2">Warm leads</div>
              <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
                {metrics.warm_leads_count}
              </div>
              <div className="text-[11.5px] text-text-secondary mt-1">Active opportunities</div>
            </div>
            <div className="p-4 md:p-5 bg-surface border border-border rounded-xl shadow-sm">
              <div className="text-xs text-text-secondary mb-2">Follow-ups due</div>
              <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
                {metrics.pending_followups_count}
              </div>
              <div className="text-[11.5px] text-text-secondary mt-1">Queued for today</div>
            </div>
            <div className="p-4 md:p-5 bg-surface border border-border rounded-xl shadow-sm">
              <div className="text-xs text-text-secondary mb-2">Proposals out</div>
              <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
                {metrics.proposals_out_count}
              </div>
              <div className="text-[11.5px] text-text-secondary mt-1">Waiting on a decision</div>
            </div>
            <div className="p-4 md:p-5 bg-surface border border-border rounded-xl shadow-sm">
              <div className="text-xs text-text-secondary mb-2">Pipeline value</div>
              <div className="font-mono text-2xl font-bold tracking-tight text-green">
                ${metrics.total_pipeline_value.toLocaleString()}
              </div>
              <div className="text-[11.5px] text-text-secondary mt-1">Total active deal value</div>
            </div>
          </section>
        )}

        {/* Pipeline Snapshot */}
        <section className="bg-surface border border-border rounded-xl p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Pipeline snapshot</h3>
            <Link
              to="/app/leads"
              className="text-xs text-green hover:underline font-medium flex items-center gap-1 transition-colors"
            >
              <span>View pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3.5">
            {stageStats.map((st) => (
              <Link
                key={st.name}
                to={st.href}
                className="grid grid-cols-[115px_40px_1fr_85px] items-center gap-3 text-xs group hover:opacity-90 transition-opacity"
              >
                <span className="font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
                  {st.name}
                </span>
                <span className="text-[11px] font-mono text-text-secondary">
                  {st.count} {st.count === 1 ? 'deal' : 'deals'}
                </span>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full ${st.barColor} transition-all duration-300 rounded-full`}
                    style={{ width: `${Math.max(st.pct, st.count > 0 ? 5 : 0)}%` }}
                  />
                </div>
                <span className="font-mono text-right font-semibold text-text-primary">
                  ${st.value.toLocaleString()}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Usage cap modal if free user reaches 5 leads limit */}
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
