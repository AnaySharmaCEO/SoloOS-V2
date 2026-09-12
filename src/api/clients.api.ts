import { supabase } from '../lib/supabase';
import type { ApiResponse, Client, UpdateClientInput } from '../types';

export async function getClients(userId: string): Promise<ApiResponse<Client[]>> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        leads!inner(email, phone)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };

    const mapped = (data || []).map((row: any) => ({
      ...row,
      client_email: row.leads?.email || '',
      client_phone: row.leads?.phone || '',
    }));

    return { data: mapped as Client[] || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getClientByLeadId(
  leadId: string,
  userId: string
): Promise<ApiResponse<Client>> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        leads!inner(email, phone)
      `)
      .eq('lead_id', leadId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) return { data: null, error: { message: error.message } };
    if (!data) return { data: null, error: null };

    const mapped = {
      ...data,
      client_email: (data as any).leads?.email || '',
      client_phone: (data as any).leads?.phone || '',
    };

    return { data: mapped as Client, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getClientById(
  clientId: string,
  userId: string
): Promise<ApiResponse<Client>> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        leads!inner(email, phone)
      `)
      .eq('id', clientId)
      .eq('user_id', userId)
      .single();

    if (error) return { data: null, error: { message: error.message } };

    const mapped = {
      ...data,
      client_email: (data as any).leads?.email || '',
      client_phone: (data as any).leads?.phone || '',
    };

    return { data: mapped as Client, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function createClient(
  userId: string,
  input: {
    lead_id: string;
    client_name: string;
    company?: string;
    total_revenue?: number;
    notes?: string;
  }
): Promise<ApiResponse<Client>> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        ...input,
        total_revenue: input.total_revenue ?? 0,
      })
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as Client, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function updateClient(
  clientId: string,
  userId: string,
  updates: UpdateClientInput
): Promise<ApiResponse<Client>> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', clientId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as Client, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function deleteClient(
  clientId: string,
  userId: string
): Promise<ApiResponse<void>> {
  try {
    await supabase.from('activities').delete().eq('client_id', clientId);
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', userId);

    if (error) return { data: null, error: { message: error.message } };
    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
