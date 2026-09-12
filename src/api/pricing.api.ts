// ============================================
// PRICING API
// ============================================
// All pricing-related Supabase operations

import { supabase } from '../lib/supabase';
import type { ApiResponse, PricingRecord, CreatePricingInput } from '../types';

// ============================================
// GET ALL PRICING RECORDS
// ============================================

export async function getPricingRecords(userId: string): Promise<ApiResponse<PricingRecord[]>> {
  try {
    const { data, error } = await supabase
      .from('pricing_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as PricingRecord[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET PRICING RECORD BY ID
// ============================================

export async function getPricingRecordById(
  recordId: string,
  userId: string
): Promise<ApiResponse<PricingRecord>> {
  try {
    const { data, error } = await supabase
      .from('pricing_records')
      .select('*')
      .eq('id', recordId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as PricingRecord, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET PRICING HISTORY FOR LEAD
// ============================================

export async function getPricingHistoryForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<PricingRecord[]>> {
  try {
    const { data, error } = await supabase
      .from('pricing_records')
      .select('*')
      .eq('user_id', userId)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: (data as PricingRecord[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// CREATE PRICING RECORD
// ============================================

export async function createPricingRecord(
  userId: string,
  input: CreatePricingInput
): Promise<ApiResponse<PricingRecord>> {
  try {
    const newRecord = {
      user_id: userId,
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('pricing_records')
      .insert(newRecord)
      .select()
      .single();

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: data as PricingRecord, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// DELETE PRICING RECORD
// ============================================

export async function deletePricingRecord(recordId: string, userId: string): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('pricing_records')
      .delete()
      .eq('id', recordId)
      .eq('user_id', userId);

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ============================================
// GET AVERAGE PRICING BY SERVICE TYPE
// ============================================

export async function getAveragePricingByServiceType(
  userId: string,
  serviceType: string
): Promise<ApiResponse<{ avg_min: number; avg_max: number }>> {
  try {
    const { data, error } = await supabase
      .from('pricing_records')
      .select('recommended_min, recommended_max')
      .eq('user_id', userId)
      .eq('service_type', serviceType);

    if (error) {
      return { data: null, error: { message: error.message } };
    }

    if (!data || data.length === 0) {
      return { data: { avg_min: 0, avg_max: 0 }, error: null };
    }

    const records = data as PricingRecord[];
    const avg_min = records.reduce((sum, r) => sum + r.recommended_min, 0) / records.length;
    const avg_max = records.reduce((sum, r) => sum + r.recommended_max, 0) / records.length;

    return { data: { avg_min, avg_max }, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
