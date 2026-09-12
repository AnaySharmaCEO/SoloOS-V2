import type { ApiResponse } from '../../types';
import type { SendMailInput, SendMailResult } from '../../services/integrations/mail.service';

/**
 * TODO(integration-backend): replace this body with a call to a Supabase
 * Edge Function, e.g.:
 *
 *   const { data, error } = await supabase.functions.invoke('send-mail', {
 *     body: { userId, ...input },
 *   });
 *
 * That function should hold the real provider API key (Resend/Postmark/
 * SES) \u2014 never send mail directly from the frontend with a secret key.
 */
export async function sendMail(userId: string, input: SendMailInput): Promise<ApiResponse<SendMailResult>> {
  console.info('[mail] sendMail called (stub, not actually sent)', { userId, ...input });
  return {
    data: null,
    error: { message: 'Email sending isn\u2019t connected yet \u2014 no email was sent.' },
  };
}
