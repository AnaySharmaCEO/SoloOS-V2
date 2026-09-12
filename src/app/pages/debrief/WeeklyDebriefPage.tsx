import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../../hooks/useDashboard';
import { useLeads } from '../../../hooks/useLeads';
import { useProposals } from '../../../hooks/useProposals';
import { useClients } from '../../../hooks/useClients';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { Button } from '../../components/ui/button';

export default function WeeklyDebriefPage() {
  const { user } = useAuth();
  const userId = user?.user?.id;
  const { metrics, loading: dashLoading } = useDashboard(userId);
  const { leads, loading: leadsLoading } = useLeads(userId);
  const { proposals } = useProposals(userId);
  const { clients } = useClients(userId);
  const { entitlements, canUse } = useEntitlements();

  const isPro = canUse('revenue_debrief') || entitlements.planId === 'pro';

  const loading = dashLoading || leadsLoading;

  // Derive weekly metrics
  const activeLeads = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost');
  const quietLeads = leads.filter((l) => l.days_in_stage > 5 && l.stage !== 'Won' && l.stage !== 'Lost');
  const wonLeads = leads.filter((l) => l.stage === 'Won');
  const totalPipelineVal = activeLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0);
  const avgDealSize = activeLeads.length > 0 ? Math.round(totalPipelineVal / activeLeads.length) : 0;

  // Format date range for the current week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

  const dateRangeStr = `${startOfWeek.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })} – ${endOfWeek.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  if (!isPro) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary p-4 md:p-8 flex items-center justify-center">
        <div className="bg-surface border border-border rounded-2xl p-8 max-w-lg w-full text-center shadow-sm space-y-5">
          <div className="w-12 h-12 rounded-xl bg-green-tint text-green mx-auto flex items-center justify-center font-bold text-xl">
            ✦
          </div>
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-green-tint text-green mb-2">
              Pro Capability
            </span>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
              Weekly Revenue Debrief
            </h1>
            <p className="text-xs md:text-sm text-text-secondary mt-2 leading-relaxed">
              Every Monday at 8:00 AM, SoloOS analyzes your pipeline movements, stalled conversations, proposal velocity, and projected revenue to generate an executive debrief.
            </p>
          </div>

          <div className="bg-elevated p-4 rounded-xl border border-border text-left space-y-2 text-xs">
            <div className="flex items-center gap-2 font-semibold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span>Deal movement & pipeline velocity summary</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span>Flagged quiet opportunities requiring follow-up</span>
            </div>
            <div className="flex items-center gap-2 font-semibold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-green" />
              <span>Projected cashflow and prioritized actions for the week</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <Button
              asChild
              className="flex-1 h-9 text-xs font-semibold bg-green hover:bg-green-hover text-white transition-colors"
            >
              <Link to="/app/settings/billing">Upgrade to Pro ($30/mo)</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-9 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
            >
              <Link to="/app">Back to dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Top Banner */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6 mb-8">
        <div className="max-w-4xl mx-auto space-y-2">
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary">
                  Weekly Revenue Debrief
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-tint text-green">
                  Pro
                </span>
              </div>
              <p className="text-xs md:text-sm text-text-secondary mt-0.5">
                Week of {dateRangeStr} · Grounded pipeline intelligence
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary font-mono bg-elevated px-3 py-1.5 rounded-lg border border-border">
              <Calendar className="w-3.5 h-3.5 text-green" />
              <span>Prepared for Monday morning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8">
        {/* Executive Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <div className="text-xs text-text-secondary mb-1.5">Active Pipeline Value</div>
            <div className="font-mono text-2xl font-bold tracking-tight text-green">
              ${totalPipelineVal.toLocaleString()}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Across {activeLeads.length} open opportunities
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <div className="text-xs text-text-secondary mb-1.5">Average Deal Size</div>
            <div className="font-mono text-2xl font-bold tracking-tight text-text-primary">
              ${avgDealSize.toLocaleString()}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              Based on your active pipeline
            </p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
            <div className="text-xs text-text-secondary mb-1.5">Quiet / Stalled Deals</div>
            <div
              className={`font-mono text-2xl font-bold tracking-tight ${
                quietLeads.length > 0 ? 'text-ember' : 'text-text-primary'
              }`}
            >
              {quietLeads.length}
            </div>
            <p className="text-[11px] text-text-secondary mt-1">
              {quietLeads.length > 0 ? 'Need a nudge this week' : 'All conversations active'}
            </p>
          </div>
        </section>

        {/* Focus for the Week Ahead */}
        <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-green" />
            <h2 className="text-sm font-bold tracking-tight text-text-primary">
              Top 3 Priorities for This Week
            </h2>
          </div>

          <div className="space-y-3">
            {quietLeads.length > 0 ? (
              <div className="flex items-start gap-3.5 p-3.5 bg-elevated rounded-xl border border-border">
                <span className="w-5 h-5 rounded-full bg-ember-tint text-ember text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs leading-relaxed">
                  <strong className="text-text-primary block mb-0.5">
                    Revive quiet opportunities ({quietLeads.length} waiting)
                  </strong>
                  <span className="text-text-secondary">
                    {quietLeads.slice(0, 2).map((l) => l.name).join(', ')}
                    {quietLeads.length > 2 ? ` and ${quietLeads.length - 2} others` : ''} have had no interaction in 5+ days. Send a low-pressure follow-up before they go cold.
                  </span>
                  <div className="mt-2">
                    <Link
                      to="/app/follow-ups"
                      className="text-green font-semibold inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Open follow-up queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3.5 p-3.5 bg-elevated rounded-xl border border-border">
                <span className="w-5 h-5 rounded-full bg-green-tint text-green text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="text-xs leading-relaxed">
                  <strong className="text-text-primary block mb-0.5">Pipeline engagement is pristine</strong>
                  <span className="text-text-secondary">
                    None of your open deals are stalled. Focus on adding new inbound opportunities or qualifying top prospects.
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3.5 p-3.5 bg-elevated rounded-xl border border-border">
              <span className="w-5 h-5 rounded-full bg-green-tint text-green text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </span>
              <div className="text-xs leading-relaxed">
                <strong className="text-text-primary block mb-0.5">
                  Review proposals waiting on client decisions
                </strong>
                <span className="text-text-secondary">
                  Ensure any sent proposals have an explicit decision milestone on the client's calendar. If waiting over 3 days, send a clarifying check-in.
                </span>
                <div className="mt-2">
                  <Link
                    to="/app/proposals"
                    className="text-green font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>View active proposals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 bg-elevated rounded-xl border border-border">
              <span className="w-5 h-5 rounded-full bg-green-tint text-green text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </span>
              <div className="text-xs leading-relaxed">
                <strong className="text-text-primary block mb-0.5">
                  Check retainer renewal & client satisfaction
                </strong>
                <span className="text-text-secondary">
                  Active retainer clients should receive a quick delivery update or check-in to protect account health and position future upsells.
                </span>
                <div className="mt-2">
                  <Link
                    to="/app/clients"
                    className="text-green font-semibold inline-flex items-center gap-1 hover:underline"
                  >
                    <span>View client accounts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quiet Deals Breakdown */}
        {quietLeads.length > 0 && (
          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-ember" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Deals That Went Quiet Last Week
                </h3>
              </div>
              <span className="text-xs text-text-secondary font-mono">
                {quietLeads.length} flagged
              </span>
            </div>

            <div className="divide-y divide-border">
              {quietLeads.map((l) => (
                <div key={l.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <Link
                      to={`/app/leads/${l.id}`}
                      className="font-semibold text-text-primary hover:text-green transition-colors"
                    >
                      {l.name}
                    </Link>
                    <p className="text-text-secondary text-[11px] mt-0.5">
                      {l.company || 'Independent'} · in <strong className="text-text-primary">{l.stage}</strong> for {l.days_in_stage} days
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-text-primary">
                      ${(l.estimated_value || 0).toLocaleString()}
                    </span>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
                    >
                      <Link to={`/app/leads/${l.id}`}>Review</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Win Celebrations */}
        {wonLeads.length > 0 && (
          <section className="bg-surface border border-border rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green" />
              <h3 className="text-sm font-semibold text-text-primary">
                Closed Deals & Won Revenue
              </h3>
            </div>
            <p className="text-xs text-text-secondary">
              You've closed {wonLeads.length} {wonLeads.length === 1 ? 'deal' : 'deals'} worth a total of $
              {wonLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0).toLocaleString()}.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
