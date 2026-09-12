// ============================================
// LEADS API
// ============================================
// All lead-related Supabase operations

import { supabase } from '../lib/supabase';
import type { ApiResponse, Lead, CreateLeadInput, UpdateLeadInput, LeadFilters } from '../types';

// ============================================
// GET ALL LEADS
// ============================================

export async function getLeads(userId: string, filters?: LeadFilters): Promise<ApiResponse<Lead[]>> {
  try {
    let query = supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }

    if (filters?.source) {
      query = query.eq('source', filters.source);
    }

    if (filters?.min_value !== undefined) {
      query = query.gte('estimated_value', filters.min_value);
    }

    if (filters?.max_value !== undefined) {
      query = query.lte('estimated_value', filters.max_value);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,company.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as Lead[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET LEAD BY ID
// ============================================

export async function getLeadById(leadId: string, userId: string): Promise<ApiResponse<Lead>> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as Lead, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// CREATE LEAD
// ============================================

export async function createLead(userId: string, input: CreateLeadInput): Promise<ApiResponse<Lead>> {
  try {
    const { channels, ...leadFields } = input;
    const newLead = {
      user_id: userId,
      ...leadFields,
      days_in_stage: 0,
      priority: input.priority || 'medium',
      next_action: input.next_action,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('leads')
      .insert(newLead)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as Lead, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// UPDATE LEAD
// ============================================

export async function updateLead(
  leadId: string,
  userId: string,
  updates: UpdateLeadInput
): Promise<ApiResponse<Lead>> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', leadId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as Lead, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET LEADS BY STAGE
// ============================================

export async function getLeadsByStage(userId: string): Promise<ApiResponse<Record<string, Lead[]>>> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .is('archived_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    const leads = data as Lead[];
    const groupedByStage = leads.reduce((acc, lead) => {
      if (!acc[lead.stage]) {
        acc[lead.stage] = [];
      }
      acc[lead.stage].push(lead);
      return acc;
    }, {} as Record<string, Lead[]>);

    return { data: groupedByStage, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET WARM LEADS
// ============================================

export async function getWarmLeads(userId: string): Promise<ApiResponse<Lead[]>> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .eq('stage', 'Warm Lead')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as Lead[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET AT-RISK LEADS
// ============================================

export async function getAtRiskLeads(userId: string, daysThreshold: number = 5): Promise<ApiResponse<Lead[]>> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .gte('days_in_stage', daysThreshold)
      .not('stage', 'in', '(Won,Lost)')
      .order('days_in_stage', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as Lead[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// DELETE LEAD
// ============================================

export async function deleteLead(leadId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    // Delete dependent records first to satisfy potential foreign key constraints
    await supabase.from('followups').delete().eq('lead_id', leadId);
    await supabase.from('notes').delete().eq('lead_id', leadId);
    await supabase.from('lead_channels').delete().eq('lead_id', leadId);
    await supabase.from('proposals').delete().eq('lead_id', leadId);
    await supabase.from('activities').delete().eq('lead_id', leadId);

    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

