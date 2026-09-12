import { supabase } from '../lib/supabase';
import type { ApiResponse, ContactChannelType, LeadContactChannel } from '../types';

export async function getChannelsForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<LeadContactChannel[]>> {
  try {
    const { data, error } = await supabase
      .from('lead_contact_channels')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', userId);

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as LeadContactChannel[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function upsertChannels(
  userId: string,
  leadId: string,
  channels: { channel_type: ContactChannelType; channel_value?: string }[]
): Promise<ApiResponse<LeadContactChannel[]>> {
  try {
    const rows = channels.map((c) => ({
      user_id: userId,
      lead_id: leadId,
      channel_type: c.channel_type,
      channel_value: c.channel_value || null,
    }));

    const { data, error } = await supabase
      .from('lead_contact_channels')
      .upsert(rows, { onConflict: 'lead_id,channel_type' })
      .select();

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as LeadContactChannel[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
