// ============================================
// LEAD SERVICE — orchestrates prospect domain
// ============================================

import * as leadsApi from '../api/leads.api';
import * as channelsApi from '../api/channels.api';
import * as activityService from './activity.service';
import * as clientService from './client.service';
import * as decisionService from './decision.service';
import * as messageService from './message.service';
import type {
  ApiResponse,
  ContactChannelType,
  CreateLeadInput,
  Lead,
  LeadStage,
  MoveStageInput,
  UpdateLeadInput,
  LeadFilters,
} from '../types';

export async function getAllLeads(
  userId: string,
  filters?: LeadFilters
): Promise<ApiResponse<Lead[]>> {
  return leadsApi.getLeads(userId, filters);
}

export async function getLeadById(leadId: string, userId: string): Promise<ApiResponse<Lead>> {
  return leadsApi.getLeadById(leadId, userId);
}

export async function createLead(
  userId: string,
  input: CreateLeadInput
): Promise<ApiResponse<Lead>> {
  if (!input.name?.trim() || !input.stage) {
    return { data: null, error: { message: 'Name and stage are required' } };
  }
  if (input.estimated_value < 0) {
    return { data: null, error: { message: 'Estimated value must be positive' } };
  }

  const next_action =
    input.next_action || messageService.getDefaultNextAction(input.stage);

  const result = await leadsApi.createLead(userId, {
    ...input,
    next_action,
    priority: input.priority || 'medium',
  });

  if (!result.data) return result;

  const lead = result.data;
  const channels = input.channels?.length
    ? input.channels
    : buildDefaultChannels(input);

  if (channels.length) {
    await channelsApi.upsertChannels(userId, lead.id, channels);
  }

  await activityService.logActivity(userId, {
    lead_id: lead.id,
    action_type: 'lead_created',
    action_label: `Lead created: ${lead.name}`,
    metadata: { stage: lead.stage, value: lead.estimated_value },
  });

  return result;
}

function buildDefaultChannels(input: CreateLeadInput) {
  const channels: { channel_type: ContactChannelType; channel_value?: string }[] = [];
  if (input.email) channels.push({ channel_type: 'Email', channel_value: input.email });
  if (input.phone) channels.push({ channel_type: 'Call', channel_value: input.phone });
  if (input.source === 'LinkedIn') channels.push({ channel_type: 'LinkedIn' });
  if (input.source === 'Instagram DM') channels.push({ channel_type: 'Instagram' });
  if (input.source === 'Twitter/X') channels.push({ channel_type: 'X' });
  return channels;
}

export async function updateLead(
  leadId: string,
  userId: string,
  updates: UpdateLeadInput
): Promise<ApiResponse<Lead>> {
  if (updates.estimated_value !== undefined && updates.estimated_value < 0) {
    return { data: null, error: { message: 'Estimated value must be positive' } };
  }
  return leadsApi.updateLead(leadId, userId, updates);
}

export async function archiveLead(leadId: string, userId: string): Promise<ApiResponse<Lead>> {
  const result = await leadsApi.updateLead(leadId, userId, {
    archived_at: new Date().toISOString(),
  });
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: leadId,
      action_type: 'lead_archived',
      action_label: 'Lead archived',
    });
  }
  return result;
}

export async function moveLeadStage(
  leadId: string,
  userId: string,
  input: MoveStageInput
): Promise<ApiResponse<Lead>> {
  if (input.stage === 'Lost' && !input.lost_reason?.trim()) {
    return { data: null, error: { message: 'Lost reason is required' } };
  }

  const updates: UpdateLeadInput = {
    stage: input.stage,
    lost_reason: input.stage === 'Lost' ? input.lost_reason : null,
    win_reason: input.stage === 'Won' ? input.win_reason : undefined,
    next_action: messageService.getDefaultNextAction(input.stage),
    days_in_stage: 0,
    last_contact_date:
      input.stage !== 'New Lead' ? new Date().toISOString() : undefined,
  };

  const result = await leadsApi.updateLead(leadId, userId, updates);
  if (!result.data) return result;

  const lead = result.data;

  await activityService.logActivity(userId, {
    lead_id: leadId,
    action_type: 'stage_changed',
    action_label: `Stage moved to ${input.stage}`,
    metadata: { from: lead.stage, lost_reason: input.lost_reason },
  });

  if (input.stage === 'Lost') {
    await decisionService.logDecision(userId, {
      lead_id: leadId,
      decision_type: 'deal_lost',
      reason: input.lost_reason,
    });
  }

  if (input.stage === 'Won') {
    await decisionService.logDecision(userId, {
      lead_id: leadId,
      decision_type: 'deal_won',
      reason: input.win_reason,
    });
    await clientService.createClientFromLead(userId, lead);
  }

  return result;
}

export async function deleteLead(leadId: string, userId: string): Promise<ApiResponse<void>> {
  return leadsApi.deleteLead(leadId, userId);
}

export async function getLeadsByStage(
  userId: string
): Promise<ApiResponse<Record<string, Lead[]>>> {
  return leadsApi.getLeadsByStage(userId);
}

export async function getWarmLeads(userId: string): Promise<ApiResponse<Lead[]>> {
  return leadsApi.getWarmLeads(userId);
}

export async function getAtRiskLeads(userId: string): Promise<ApiResponse<Lead[]>> {
  return leadsApi.getAtRiskLeads(userId, 5);
}

export async function recordMessageSent(
  userId: string,
  leadId: string,
  channel: ContactChannelType,
  message: string
): Promise<ApiResponse<Lead>> {
  const updates: UpdateLeadInput = {
    last_contact_date: new Date().toISOString(),
  };
  if (channel) {
    const leadRes = await leadsApi.getLeadById(leadId, userId);
    if (leadRes.data?.stage === 'New Lead') {
      updates.stage = 'Contacted';
      updates.next_action = messageService.getDefaultNextAction('Contacted');
    }
  }
  const result = await leadsApi.updateLead(leadId, userId, updates);
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: leadId,
      action_type: 'message_sent',
      action_label: `Message sent via ${channel}`,
      metadata: { channel, preview: message.slice(0, 120) },
    });
  }
  return result;
}

export async function logLeadContact(leadId: string, userId: string): Promise<ApiResponse<Lead>> {
  const result = await leadsApi.updateLead(leadId, userId, {
    last_contact_date: new Date().toISOString(),
  });
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: leadId,
      action_type: 'contact_logged',
      action_label: 'Contact logged',
    });
  }
  return result;
}

export async function getLeadStats(userId: string): Promise<ApiResponse<Record<string, unknown>>> {
  const result = await leadsApi.getLeads(userId);
  if (result.error) return result;

  const leads = result.data || [];
  return {
    data: {
      total: leads.length,
      by_stage: leads.reduce(
        (acc, lead) => {
          acc[lead.stage] = (acc[lead.stage] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      ),
      total_value: leads.reduce((sum, lead) => sum + lead.estimated_value, 0),
      at_risk: leads.filter((l) => l.days_in_stage > 5).length,
    },
    error: null,
  };
}

/** @deprecated Use moveLeadStage */
export async function moveLeadToStage(
  leadId: string,
  userId: string,
  newStage: string
): Promise<ApiResponse<Lead>> {
  return moveLeadStage(leadId, userId, { stage: newStage as LeadStage });
}

