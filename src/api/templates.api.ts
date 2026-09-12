import { supabase } from '../lib/supabase';
import type { ApiResponse, MessageTemplate } from '../types';

export async function getTemplates(userId: string): Promise<ApiResponse<MessageTemplate[]>> {
  try {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error: { message: error.message } };
    return { data: (data as MessageTemplate[]) || [], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function getTemplateByType(
  userId: string,
  templateType: string
): Promise<ApiResponse<MessageTemplate>> {
  try {
    const { data, error } = await supabase
      .from('message_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('template_type', templateType)
      .maybeSingle();

    if (error) return { data: null, error: { message: error.message } };
    return { data: data as MessageTemplate | null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

export async function seedDefaultTemplates(userId: string): Promise<ApiResponse<void>> {
  const defaults = [
    {
      template_type: 'first_outreach',
      title: 'First outreach',
      content:
        'Hi {{name}}, I came across {{company}} and thought I could help with {{service}}. Would you be open to a quick chat this week?',
    },
    {
      template_type: 'follow_up',
      title: 'Follow-up',
      content:
        'Hi {{name}}, just checking in on our last conversation. Happy to answer any questions about next steps.',
    },
    {
      template_type: 'proposal_reminder',
      title: 'Proposal reminder',
      content:
        'Hi {{name}}, wanted to follow up on the proposal I sent. Let me know if you need any clarifications.',
    },
  ];

  try {
    const { error } = await supabase.from('message_templates').insert(
      defaults.map((t) => ({ user_id: userId, ...t }))
    );
    if (error && !error.message.includes('duplicate')) {
      return { data: null, error: { message: error.message } };
    }
    return { data: null, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}
