// ============================================
// MESSAGING SERVICE (real send, provider-agnostic)
// ============================================
// Distinct from src/services/message.service.ts, which only *composes*
// message text and deep-links out to WhatsApp/SMS/email apps (the
// "assisted sending" pattern already in the product). This service is
// for an actual server-relayed send — SMS/WhatsApp Business API/etc —
// once a backend integration exists.
//
// TODO(integration-backend): point sendMessage() at a Supabase Edge
// Function that calls a real provider (Twilio, WhatsApp Business API,
// MSG91, etc). Keep the same call shape below so callers never change.

import type { ApiResponse } from '../../types';
import * as messagingApi from '../../api/integrations/messaging.api';

export interface SendMessageInput {
  to: string; // phone number, E.164 format
  body: string;
  /** Associates the send with a lead/client/followup for the activity
   *  timeline, once real sending exists. */
  context?: { leadId?: string; clientId?: string; followUpId?: string };
}

export interface SendMessageResult {
  status: 'sent' | 'queued' | 'failed';
  providerMessageId?: string;
}

export async function sendMessage(userId: string, input: SendMessageInput): Promise<ApiResponse<SendMessageResult>> {
  if (!input.to || !input.body) {
    return { data: null, error: { message: 'A recipient and message body are required.' } };
  }
  return messagingApi.sendMessage(userId, input);
}
