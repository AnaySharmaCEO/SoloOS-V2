// ============================================
// MAIL SERVICE (real send, provider-agnostic)
// ============================================
// TODO(integration-backend): point sendMail() at a Supabase Edge Function
// that calls a real provider (Resend, Postmark, SES, etc). Keep this
// call shape so callers (weekly digest, proposal reminders, follow-up
// nudges) never need to change when the backend lands.

import type { ApiResponse } from '../../types';
import * as mailApi from '../../api/integrations/mail.api';

export interface SendMailInput {
  to: string;
  subject: string;
  /** Plain text or simple HTML body \u2014 templating happens in the Edge
   *  Function once it exists, not client-side. */
  body: string;
  context?: { leadId?: string; clientId?: string; proposalId?: string };
}

export interface SendMailResult {
  status: 'sent' | 'queued' | 'failed';
  providerMessageId?: string;
}

export async function sendMail(userId: string, input: SendMailInput): Promise<ApiResponse<SendMailResult>> {
  if (!input.to || !input.subject || !input.body) {
    return { data: null, error: { message: 'A recipient, subject, and body are required.' } };
  }
  return mailApi.sendMail(userId, input);
}
