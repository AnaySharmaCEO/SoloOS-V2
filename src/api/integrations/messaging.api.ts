import type { ApiResponse } from '../../types';
import type { SendMessageInput, SendMessageResult } from '../../services/integrations/messaging.service';

/**
 * TODO(integration-backend): replace this body with a call to a Supabase
 * Edge Function, e.g.:
 *
 *   const { data, error } = await supabase.functions.invoke('send-message', {
 *     body: { userId, ...input },
 *   });
 *
 * That function should hold the real provider credentials (Twilio auth
 * token, WhatsApp Business API token, etc) — never call a messaging
 * provider directly from the frontend with a secret key.
 */
export async function sendMessage(
  userId: string,
  input: SendMessageInput
): Promise<ApiResponse<SendMessageResult>> {
  console.info('[messaging] sendMessage called (stub, not actually sent)', { userId, ...input });
  return {
    data: null,
    error: { message: 'Messaging isn\u2019t connected yet \u2014 no message was sent.' },
  };
}
