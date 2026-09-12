import { supabase } from '../lib/supabase';
import type { ApiResponse, LeadNote } from '../types';

export async function getNotesForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<LeadNote[]>> {
  try {
    const { data, error } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as LeadNote[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function createNote(
  userId: string,
  leadId: string,
  content: string
): Promise<ApiResponse<LeadNote>> {
  try {
    const { data, error } = await supabase
      .from('lead_notes')
      .insert({ user_id: userId, lead_id: leadId, content })
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as LeadNote, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function deleteNote(
  noteId: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('lead_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', userId);

    if (error) return { data: null, error: { message: error.message } };
    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
