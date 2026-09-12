import * as notesApi from '../api/notes.api';
import * as activityService from './activity.service';
import type { ApiResponse, LeadNote } from '../types';

export async function getNotesForLead(
  leadId: string,
  userId: string
): Promise<ApiResponse<LeadNote[]>> {
  return notesApi.getNotesForLead(leadId, userId);
}

export async function addNote(
  userId: string,
  leadId: string,
  content: string
): Promise<ApiResponse<LeadNote>> {
  if (!content.trim()) {
    return { data: null, error: { message: 'Note cannot be empty' } };
  }

  const result = await notesApi.createNote(userId, leadId, content.trim());
  if (result.data) {
    await activityService.logActivity(userId, {
      lead_id: leadId,
      action_type: 'note_added',
      action_label: 'Note added',
      metadata: { preview: content.slice(0, 80) },
    });
  }
  return result;
}
