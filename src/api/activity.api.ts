import { supabase } from '../lib/supabase';
import type { ActivityLogEntry, ApiResponse } from '../types';

export async function getActivityForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<ActivityLogEntry[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as ActivityLogEntry[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getActivityForClient(
  clientId: string,
  userId: string
): Promise<ApiResponse<ActivityLogEntry[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as ActivityLogEntry[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getRecentActivity(
  userId: string,
  limit = 20
): Promise<ApiResponse<ActivityLogEntry[]>> {
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as ActivityLogEntry[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function createActivity(
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
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .insert({ user_id: userId, ...entry })
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as ActivityLogEntry, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
