// ============================================
// DASHBOARD API
// ============================================
// All dashboard metrics and analytics operations

import { supabase } from '../lib/supabase';
import type { ApiResponse, DashboardMetrics, RevenueMetrics } from '../types';

// ============================================
// GET DASHBOARD METRICS
// ============================================

export async function getDashboardMetrics(userId: string): Promise<ApiResponse<DashboardMetrics>> {
  try {
    // This would typically be a database function or view
    // For now, we'll use multiple queries

    // Get warm leads count
    const { count: warmCount, error: warmError } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('stage', 'Warm Lead')
      .is('archived_at', null);

    if (warmError) {
      return { data: null, error: { message: warmError.message } };
    }

    // Get pending follow-ups count
    const { count: pendingCount, error: followupError } = await supabase
      .from('followups')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (followupError) {
      return { data: null, error: { message: followupError.message } };
    }

    // Get proposals out count
    const { count: proposalsCount, error: proposalError } = await supabase
      .from('proposals')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'Pending');

    if (proposalError) {
      return { data: null, error: { message: proposalError.message } };
    }

    // Get monthly revenue (accepted proposals this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: acceptedProposals, error: revenueError } = await supabase
      .from('proposals')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'Accepted')
      .gte('actual_reply_date', startOfMonth.toISOString());

    if (revenueError) {
      return { data: null, error: { message: revenueError.message } };
    }

    const monthly_revenue = acceptedProposals?.reduce((sum, p) => sum + p.amount, 0) || 0;

    // Get total pipeline value
    const { data: allLeads, error: pipelineError } = await supabase
      .from('leads')
      .select('estimated_value')
      .eq('user_id', userId)
      .not('stage', 'in', '(Won,Lost)');

    if (pipelineError) {
      return { data: null, error: { message: pipelineError.message } };
    }

    const total_pipeline_value = allLeads?.reduce((sum, l) => sum + l.estimated_value, 0) || 0;

    // Get at-risk count (leads stuck for 5+ days)
    const { count: atRiskCount, error: riskError } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('days_in_stage', 5)
      .not('stage', 'in', '(Won,Lost)')
      .is('archived_at', null);

    if (riskError) {
      return { data: null, error: { message: riskError.message } };
    }

    // Fetch total counts for data-driven empty states
    const { count: leadsCount } = await supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: totalProposalsCount } = await supabase
      .from('proposals')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: clientsCount } = await supabase
      .from('clients')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    const metrics: DashboardMetrics = {
      warm_leads_count: warmCount || 0,
      pending_followups_count: pendingCount || 0,
      proposals_out_count: proposalsCount || 0,
      monthly_revenue,
      total_pipeline_value,
      at_risk_count: atRiskCount || 0,
      total_leads_count: leadsCount || 0,
      total_proposals_count: totalProposalsCount || 0,
      total_clients_count: clientsCount || 0,
    };

    return { data: metrics, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET REVENUE METRICS
// ============================================

export async function getRevenueMetrics(userId: string): Promise<ApiResponse<RevenueMetrics>> {
  try {
    // Get all proposals for metrics calculation
    const { data: allProposals, error: proposalError } = await supabase
      .from('proposals')
      .select('*')
      .eq('user_id', userId);

    if (proposalError) {
      return { data: null, error: { message: proposalError.message } };
    }

    const proposals = allProposals || [];

    const acceptedProposals = proposals.filter((p) => p.status === 'Accepted');
    const pendingProposals = proposals.filter((p) => p.status === 'Pending');

    const total_won = acceptedProposals.reduce((sum, p) => sum + p.amount, 0);
    const total_pending = pendingProposals.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue (this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyAccepted = acceptedProposals.filter(
      (p) => p.actual_reply_date && new Date(p.actual_reply_date) >= startOfMonth
    );
    const monthly_revenue = monthlyAccepted.reduce((sum, p) => sum + p.amount, 0);

    // Average deal size
    const average_deal_size = acceptedProposals.length > 0 ? total_won / acceptedProposals.length : 0;

    // Win rate
    const totalDecided = proposals.filter((p) => p.status !== 'Pending').length;
    const win_rate = totalDecided > 0 ? (acceptedProposals.length / totalDecided) * 100 : 0;

    const metrics: RevenueMetrics = {
      total_won,
      total_pending,
      monthly_revenue,
      average_deal_size,
      win_rate,
      deals_closed_count: acceptedProposals.length,
    };

    return { data: metrics, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET TODAY'S ACTION ITEMS
// ============================================

export async function getTodayActionItems(userId: string): Promise<ApiResponse<any[]>> {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    // Get overdue follow-ups
    const { data: overdueFollowups, error: followupError } = await supabase
      .from('followups')
      .select(`
        *,
        leads!inner(name, company, estimated_value)
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .lte('due_date', today.toISOString())
      .order('urgency', { ascending: true })
      .limit(5);

    if (followupError) {
      return { data: null, error: { message: followupError.message } };
    }

    // Get delayed proposals
    const { data: delayedProposals, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .eq('status', 'Pending')
      .gte('days_waiting', 3)
      .order('days_waiting', { ascending: false })
      .limit(5);

    if (proposalError) {
      return { data: null, error: { message: proposalError.message } };
    }

    // Get warm leads needing movement
    const { data: warmLeads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', 'Warm Lead')
      .order('days_in_stage', { ascending: false})
      .limit(3);

    if (leadsError) {
      return { data: null, error: { message: leadsError.message } };
    }

    const actionItems = [
      ...(overdueFollowups || []).map((f: any) => {
        const name = f.leads?.name || 'lead';
        return {
          type: 'follow-up',
          ...f,
          id: f.lead_id,
          title: `Follow up with ${name} now`,
          subtitle: f.reason || 'Overdue follow-up',
          href: `/app/leads/${f.lead_id}`,
        };
      }),
      ...(delayedProposals || []).map((p: any) => {
        const name = p.leads?.name || 'client';
        return {
          type: 'proposal',
          ...p,
          id: p.lead_id,
          title: `Send proposal reminder to ${name}`,
          subtitle: `Waiting ${p.days_waiting || 0} days for decision`,
          href: `/app/proposals`,
        };
      }),
      ...(warmLeads || []).map((l: any) => ({
        type: 'warm-lead',
        ...l,
        title: `Move ${l.name} forward`,
        subtitle: `Warm lead — ${l.days_in_stage} days in stage`,
        href: `/app/leads/${l.id}`,
      })),
    ];

    return { data: actionItems, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
