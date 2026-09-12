// ============================================
// PROPOSAL SERVICE
// ============================================
// Business logic for proposal management

import * as proposalsApi from '../api/proposals.api';
import * as activityService from './activity.service';
import * as decisionService from './decision.service';
import * as leadService from './lead.service';
import * as clientService from './client.service';
import type { ApiResponse, Proposal, CreateProposalInput, UpdateProposalInput, ProposalFilters } from '../types';

// ============================================
// PROPOSAL CRUD
// ============================================

export async function getAllProposals(userId: string, filters?: ProposalFilters): Promise<ApiResponse<Proposal[]>> {
  return proposalsApi.getProposals(userId, filters);
}

export async function getProposalById(proposalId: string, userId: string): Promise<ApiResponse<Proposal>> {
  return proposalsApi.getProposalById(proposalId, userId);
}

export async function getPendingProposals(userId: string): Promise<ApiResponse<Proposal[]>> {
  return proposalsApi.getPendingProposals(userId);
}

export async function getDelayedProposals(userId: string): Promise<ApiResponse<Proposal[]>> {
  return proposalsApi.getDelayedProposals(userId, 3);
}

export async function createProposal(userId: string, input: CreateProposalInput): Promise<ApiResponse<Proposal>> {
  // Validate input
  if (!input.lead_id || !input.amount || !input.sent_date) {
    return { data: null, error: { message: 'Lead, amount, and sent date are required' } };
  }

  if (input.amount <= 0) {
    return { data: null, error: { message: 'Amount must be positive' } };
  }

  const result = await proposalsApi.createProposal(userId, input);
  if (result.data) {
    await leadService.moveLeadStage(input.lead_id, userId, { stage: 'Proposal Sent' });
    await activityService.logActivity(userId, {
      lead_id: input.lead_id,
      proposal_id: result.data.id,
      action_type: 'proposal_sent',
      action_label: `Proposal sent ($${input.amount})`,
    });
  }
  return result;
}

export async function updateProposal(
  proposalId: string,
  userId: string,
  updates: UpdateProposalInput
): Promise<ApiResponse<Proposal>> {
  // Validate amount if provided
  if (updates.amount !== undefined && updates.amount <= 0) {
    return { data: null, error: { message: 'Amount must be positive' } };
  }

  return proposalsApi.updateProposal(proposalId, userId, updates);
}

export async function acceptProposal(
  proposalId: string,
  userId: string,
  reason?: string
): Promise<ApiResponse<Proposal>> {
  const result = await proposalsApi.updateProposal(proposalId, userId, {
    status: 'Accepted',
    actual_reply_date: new Date().toISOString(),
    decision_reason: reason,
  });
  if (result.data) {
    await leadService.moveLeadStage(result.data.lead_id, userId, {
      stage: 'Won',
      win_reason: reason || 'Proposal accepted',
    });
    await decisionService.logDecision(userId, {
      lead_id: result.data.lead_id,
      proposal_id: proposalId,
      decision_type: 'proposal_accepted',
      reason,
    });
    await activityService.logActivity(userId, {
      lead_id: result.data.lead_id,
      proposal_id: proposalId,
      action_type: 'proposal_accepted',
      action_label: 'Proposal accepted',
    });
  }
  return result;
}

export async function rejectProposal(
  proposalId: string,
  userId: string,
  reason: string
): Promise<ApiResponse<Proposal>> {
  if (!reason?.trim()) {
    return { data: null, error: { message: 'Rejection reason is required' } };
  }
  const result = await proposalsApi.updateProposal(proposalId, userId, {
    status: 'Rejected',
    actual_reply_date: new Date().toISOString(),
    decision_reason: reason,
  });
  if (result.data) {
    await leadService.moveLeadStage(result.data.lead_id, userId, {
      stage: 'Lost',
      lost_reason: reason,
    });
    await decisionService.logDecision(userId, {
      lead_id: result.data.lead_id,
      proposal_id: proposalId,
      decision_type: 'proposal_rejected',
      reason,
    });
  }
  return result;
}

export async function sendProposalReminder(
  proposalId: string,
  userId: string
): Promise<ApiResponse<Proposal>> {
  const proposal = await proposalsApi.getProposalById(proposalId, userId);
  if (!proposal.data) return { data: null, error: proposal.error };

  const count = (proposal.data.reminder_count || 0) + 1;
  const result = await proposalsApi.updateProposal(proposalId, userId, {
    reminder_count: count,
    last_reminder_sent_at: new Date().toISOString(),
  } as UpdateProposalInput);

  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: result.data.lead_id,
      proposal_id: proposalId,
      action_type: 'proposal_reminder',
      action_label: `Proposal reminder #${count} logged`,
    });
  }
  return result;
}

export async function deleteProposal(proposalId: string, userId: string): Promise<ApiResponse<void>> {
  return proposalsApi.deleteProposal(proposalId, userId);
}

// ============================================
// PROPOSAL ANALYTICS
// ============================================

export async function getProposalStats(userId: string): Promise<ApiResponse<any>> {
  const result = await proposalsApi.getProposals(userId);

  if (result.error) {
    return result;
  }

  const proposals = result.data || [];

  const pending = proposals.filter((p) => p.status === 'Pending');
  const accepted = proposals.filter((p) => p.status === 'Accepted');
  const rejected = proposals.filter((p) => p.status === 'Rejected');

  const stats = {
    total: proposals.length,
    pending: pending.length,
    accepted: accepted.length,
    rejected: rejected.length,
    total_pending_value: pending.reduce((sum, p) => sum + p.amount, 0),
    total_won_value: accepted.reduce((sum, p) => sum + p.amount, 0),
    average_deal_size: accepted.length > 0 ? accepted.reduce((sum, p) => sum + p.amount, 0) / accepted.length : 0,
    win_rate: proposals.length > 0 ? (accepted.length / (accepted.length + rejected.length)) * 100 : 0,
    delayed: pending.filter((p) => p.days_waiting > 3).length,
  };

  return { data: stats, error: null };
}
