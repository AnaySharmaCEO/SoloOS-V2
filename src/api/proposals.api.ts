// ============================================
// PROPOSALS API
// ============================================
// All proposal-related Supabase operations

import { supabase } from '../lib/supabase';
import type {
  ApiResponse,
  Proposal,
  CreateProposalInput,
  UpdateProposalInput,
  ProposalFilters,
} from '../types';

// ============================================
// GET ALL PROPOSALS
// ============================================

export async function getProposals(userId: string, filters?: ProposalFilters): Promise<ApiResponse<Proposal[]>> {
  try {
    let query = supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(name, company, email, phone)
      `)
      .eq('user_id', userId)
      .order('sent_date', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.min_amount !== undefined) {
      query = query.gte('amount', filters.min_amount);
    }

    if (filters?.max_amount !== undefined) {
      query = query.lte('amount', filters.max_amount);
    }

    if (filters?.delayed) {
      query = query.eq('status', 'Pending').gte('days_waiting', 3);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    const mapped = (data || []).map((row: any) => ({
      ...row,
      lead_name: row.leads?.name || 'Unknown Lead',
      lead_company: row.leads?.company || 'Unknown Company',
      lead_email: row.leads?.email || '',
      lead_phone: row.leads?.phone || '',
    }));

    return { data: mapped as Proposal[] || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET PROPOSAL BY ID
// ============================================

export async function getProposalById(proposalId: string, userId: string): Promise<ApiResponse<Proposal>> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('id', proposalId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    const mapped = {
      ...data,
      lead_name: (data as any).leads?.name || 'Unknown Lead',
      lead_company: (data as any).leads?.company || 'Unknown Company',
    };

    return { data: mapped as Proposal, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET PENDING PROPOSALS
// ============================================

export async function getPendingProposals(userId: string): Promise<ApiResponse<Proposal[]>> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .eq('status', 'Pending')
      .order('sent_date', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    const mapped = (data || []).map((row: any) => ({
      ...row,
      lead_name: row.leads?.name || 'Unknown Lead',
      lead_company: row.leads?.company || 'Unknown Company',
    }));

    return { data: mapped as Proposal[] || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET DELAYED PROPOSALS
// ============================================

export async function getDelayedProposals(userId: string, daysThreshold: number = 3): Promise<ApiResponse<Proposal[]>> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        leads!inner(name, company)
      `)
      .eq('user_id', userId)
      .eq('status', 'Pending')
      .gte('days_waiting', daysThreshold)
      .order('days_waiting', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    const mapped = (data || []).map((row: any) => ({
      ...row,
      lead_name: row.leads?.name || 'Unknown Lead',
      lead_company: row.leads?.company || 'Unknown Company',
    }));

    return { data: mapped as Proposal[] || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// CREATE PROPOSAL
// ============================================

export async function createProposal(userId: string, input: CreateProposalInput): Promise<ApiResponse<Proposal>> {
  try {
    const newProposal = {
      user_id: userId,
      ...input,
      status: 'Pending',
      days_waiting: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('proposals')
      .insert(newProposal)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as Proposal, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// UPDATE PROPOSAL
// ============================================

export async function updateProposal(
  proposalId: string,
  userId: string,
  updates: UpdateProposalInput
): Promise<ApiResponse<Proposal>> {
  try {
    const { data, error } = await supabase
      .from('proposals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', proposalId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as Proposal, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// UPDATE PROPOSAL STATUS
// ============================================

export async function updateProposalStatus(
  proposalId: string,
  userId: string,
  status: 'Pending' | 'Accepted' | 'Rejected'
): Promise<ApiResponse<Proposal>> {
  const updateData: UpdateProposalInput = {
    status,
  };

  if (status !== 'Pending') {
    updateData.actual_reply_date = new Date().toISOString();
  }

  return updateProposal(proposalId, userId, updateData);
}

// ============================================
// DELETE PROPOSAL
// ============================================

export async function deleteProposal(proposalId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', proposalId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
