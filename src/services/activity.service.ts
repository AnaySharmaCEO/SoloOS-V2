import * as activityApi from '../api/activity.api';
import type { ActivityLogEntry, ApiResponse } from '../types';

export async function logActivity(
  userId: string,
  entry: {
    lead_id?: string;
    client_id?: string;
    proposal_id?: string;
    action_type: string;
    action_label: string;
    metadata?: Record<string, unknown>;
  }
): Promise<ApiResponse<ActivityLogEntry>> {
  return activityApi.createActivity(userId, entry);
}

export async function getLeadTimeline(
  leadId: string,
  userId: string
): Promise<ApiResponse<ActivityLogEntry[]>> {
  return activityApi.getActivityForLead(leadId, userId);
}

export async function getClientTimeline(
  clientId: string,
  userId: string
): Promise<ApiResponse<ActivityLogEntry[]>> {
  return activityApi.getActivityForClient(clientId, userId);
}

export async function getRecentActivity(
  userId: string,
  limit?: number
): Promise<ApiResponse<ActivityLogEntry[]>> {
  return activityApi.getRecentActivity(userId, limit);
}
