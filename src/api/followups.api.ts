// ============================================
// FOLLOW-UPS API
// ============================================
// All follow-up-related Supabase operations

import { supabase } from '../lib/supabase';
import type {
  ApiResponse,
  FollowUp,
  CreateFollowUpInput,
  UpdateFollowUpInput,
  FollowUpFilters,
} from '../types';

// ============================================
// GET ALL FOLLOW-UPS
// ============================================

export async function getFollowUps(userId: string, filters?: FollowUpFilters): Promise<ApiResponse<FollowUp[]>> {
  try {
    let query = supabase
      .from('followups')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .order('due_date', { ascending: true });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    if (filters?.overdue) {
      const today = new Date().toISOString();
      query = query.lt('due_date', today).eq('status', 'pending');
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as FollowUp[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET PENDING FOLLOW-UPS
// ============================================

export async function getPendingFollowUps(userId: string): Promise<ApiResponse<FollowUp[]>> {
  try {
    const { data, error } = await supabase
      .from('followups')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('due_date', { ascending: true });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as FollowUp[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET URGENT TODAY
// ============================================

export async function getUrgentToday(userId: string): Promise<ApiResponse<FollowUp[]>> {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
      .from('followups')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .eq('status', 'pending')
      .in('urgency', ['urgent', 'high'])
      .lte('due_date', today.toISOString())
      .order('urgency', { ascending: true });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as FollowUp[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// CREATE FOLLOW-UP
// ============================================

export async function createFollowUp(userId: string, input: CreateFollowUpInput): Promise<ApiResponse<FollowUp>> {
  try {
    const newFollowUp = {
      user_id: userId,
      ...input,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('followups')
      .insert(newFollowUp)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as FollowUp, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// UPDATE FOLLOW-UP
// ============================================

export async function updateFollowUp(
  followUpId: string,
  userId: string,
  updates: UpdateFollowUpInput
): Promise<ApiResponse<FollowUp>> {
  try {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.status === 'completed' && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('followups')
      .update(updateData)
      .eq('id', followUpId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as FollowUp, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// COMPLETE FOLLOW-UP
// ============================================

export async function completeFollowUp(followUpId: string, userId: string): Promise<ApiResponse<FollowUp>> {
  return updateFollowUp(followUpId, userId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
  });
}

// ============================================
// SNOOZE FOLLOW-UP
// ============================================

export async function snoozeFollowUp(
  followUpId: string,
  userId: string,
  snoozeUntil: string
): Promise<ApiResponse<FollowUp>> {
  return updateFollowUp(followUpId, userId, {
    status: 'snoozed',
    snoozed_until: snoozeUntil,
  });
}

// ============================================
// DELETE FOLLOW-UP
// ============================================

export async function deleteFollowUp(followUpId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('followups')
      .delete()
      .eq('id', followUpId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
