import { supabase } from '../lib/supabase';
import type { ApiResponse, DecisionLogEntry } from '../types';

export async function createDecision(
  userId: string,
  input: {
    lead_id?: string;
    proposal_id?: string;
    client_id?: string;
    decision_type: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<ApiResponse<DecisionLogEntry>> {
  try {
    const { data, error } = await supabase
      .from('decision_log')
      .insert({ user_id: userId, ...input })
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as DecisionLogEntry, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getDecisionsForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<DecisionLogEntry[]>> {
  try {
    const { data, error } = await supabase
      .from('decision_log')
      .select('*')
      .eq('user_id', userId)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as DecisionLogEntry[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
