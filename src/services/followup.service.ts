// ============================================
// FOLLOW-UP SERVICE
// ============================================
// Business logic for follow-up management

import * as followupsApi from '../api/followups.api';
import * as activityService from './activity.service';
import * as leadService from './lead.service';
import type { ApiResponse, FollowUp, CreateFollowUpInput, UpdateFollowUpInput, FollowUpFilters } from '../types';

// ============================================
// FOLLOW-UP CRUD
// ============================================

export async function getAllFollowUps(userId: string, filters?: FollowUpFilters): Promise<ApiResponse<FollowUp[]>> {
  return followupsApi.getFollowUps(userId, filters);
}

export async function getPendingFollowUps(userId: string): Promise<ApiResponse<FollowUp[]>> {
  return followupsApi.getPendingFollowUps(userId);
}

export async function getUrgentToday(userId: string): Promise<ApiResponse<FollowUp[]>> {
  return followupsApi.getUrgentToday(userId);
}

export async function createFollowUp(userId: string, input: CreateFollowUpInput): Promise<ApiResponse<FollowUp>> {
  // Validate input
  if (!input.lead_id || !input.reason || !input.due_date) {
    return { data: null, error: { message: 'Lead, reason, and due date are required' } };
  }

  const result = await followupsApi.createFollowUp(userId, input);
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: input.lead_id,
      action_type: 'followup_created',
      action_label: input.reason,
    });
  }
  return result;
}

export async function scheduleCall(
  userId: string,
  leadId: string,
  leadName: string
): Promise<ApiResponse<FollowUp>> {
  const due = new Date();
  due.setDate(due.getDate() + 1);
  due.setHours(10, 0, 0, 0);

  return createFollowUp(userId, {
    lead_id: leadId,
    urgency: 'high',
    reason: `Call scheduled with ${leadName}`,
    suggested_message: `Hi ${leadName}, I'd like to schedule a quick call to discuss next steps. What time works for you?`,
    due_date: due.toISOString(),
  });
}

export async function updateFollowUp(
  followUpId: string,
  userId: string,
  updates: UpdateFollowUpInput
): Promise<ApiResponse<FollowUp>> {
  return followupsApi.updateFollowUp(followUpId, userId, updates);
}

export async function completeFollowUp(followUpId: string, userId: string): Promise<ApiResponse<FollowUp>> {
  const result = await followupsApi.completeFollowUp(followUpId, userId);
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: result.data.lead_id,
      action_type: 'followup_completed',
      action_label: 'Follow-up completed',
    });
  }
  return result;
}

export async function markFollowUpSent(
  followUpId: string,
  userId: string,
  payload: { channel_used: string; message_sent: string; copied_message?: string }
): Promise<ApiResponse<FollowUp>> {
  const result = await followupsApi.updateFollowUp(followUpId, userId, {
    status: 'completed',
    channel_used: payload.channel_used,
    message_sent: payload.message_sent,
    copied_message: payload.copied_message,
    sent_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  });

  if (result.data) {
    await leadService.logLeadContact(result.data.lead_id, userId);
    await activityService.logActivity(userId, {
      lead_id: result.data.lead_id,
      action_type: 'message_sent',
      action_label: `Message sent via ${payload.channel_used}`,
      metadata: { channel: payload.channel_used },
    });
  }
  return result;
}

export async function snoozeFollowUp(
  followUpId: string,
  userId: string,
  snoozeDays: number
): Promise<ApiResponse<FollowUp>> {
  const snoozeUntil = new Date();
  snoozeUntil.setDate(snoozeUntil.getDate() + snoozeDays);

  return followupsApi.snoozeFollowUp(followUpId, userId, snoozeUntil.toISOString());
}

export async function deleteFollowUp(followUpId: string, userId: string): Promise<ApiResponse<void>> {
  return followupsApi.deleteFollowUp(followUpId, userId);
}

// ============================================
// FOLLOW-UP ANALYTICS
// ============================================

export async function getFollowUpStats(userId: string): Promise<ApiResponse<any>> {
  const result = await followupsApi.getFollowUps(userId);

  if (result.error) {
    return result;
  }

  const followups = result.data || [];

  const stats = {
    total: followups.length,
    pending: followups.filter((f) => f.status === 'pending').length,
    completed: followups.filter((f) => f.status === 'completed').length,
    overdue: followups.filter((f) => f.status === 'pending' && new Date(f.due_date) < new Date()).length,
    by_urgency: followups.reduce((acc, f) => {
      acc[f.urgency] = (acc[f.urgency] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return { data: stats, error: null };
}

// ============================================
// FOLLOW-UP HELPERS
// ============================================

export function calculateUrgency(daysOverdue: number): 'urgent' | 'high' | 'medium' | 'low' {
  if (daysOverdue >= 3) return 'urgent';
  if (daysOverdue >= 1) return 'high';
  if (daysOverdue >= 0) return 'medium';
  return 'low';
}

export function generateFollowUpMessage(leadName: string, context: string): string {
  const templates = [
    `Hi ${leadName}, just checking in on ${context}. Do you have any questions I can help clarify?`,
    `Hi ${leadName}, wanted to follow up on our conversation about ${context}. Are you still interested in moving forward?`,
    `Hi ${leadName}, following up on ${context}. Let me know if you need any additional information.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}
