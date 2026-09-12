import type { ContactChannelType, Lead, LeadStage } from '../types';

const STAGE_NEXT_ACTION: Record<LeadStage, string> = {
  'New Lead': 'Send first message',
  Contacted: 'Wait for reply or follow up',
  'Waiting Reply': 'Send follow-up',
  'Warm Lead': 'Send proposal or schedule call',
  'Proposal Sent': 'Follow up on proposal',
  Won: 'Deliver work and ask for referral',
  Lost: 'Review loss reason and archive',
};

export function getDefaultNextAction(stage: LeadStage): string {
  return STAGE_NEXT_ACTION[stage];
}

export function getSendActionLabel(stage: LeadStage): string {
  return stage === 'New Lead' ? 'Send First Message' : 'Send Follow-Up';
}

export function generateMessage(params: {
  lead: Lead;
  templateContent?: string;
}): string {
  const { lead, templateContent } = params;
  const name = lead.name.split(' ')[0];
  const company = lead.company || 'your company';

  if (templateContent) {
    return templateContent
      .replace(/\{\{name\}\}/g, name)
      .replace(/\{\{company\}\}/g, company)
      .replace(/\{\{service\}\}/g, 'your project');
  }

  if (lead.stage === 'New Lead') {
    return `Hi ${name}, I came across ${company} and wanted to reach out about how I can help. Would you be open to a quick conversation this week?`;
  }

  if (lead.stage === 'Proposal Sent') {
    return `Hi ${name}, just checking in on the proposal I sent for ${company}. Happy to clarify anything or adjust scope if needed.`;
  }

  if (lead.stage === 'Warm Lead') {
    return `Hi ${name}, following up on our conversation about ${company}. Are you ready to discuss next steps on the project?`;
  }

  return `Hi ${name}, wanted to follow up on ${company}. Let me know if you have any questions or if timing still works on your end.`;
}

export function getChannelRedirectUrl(
  channel: ContactChannelType,
  value?: string,
  message?: string
): string | null {
  const encoded = message ? encodeURIComponent(message) : '';

  switch (channel) {
    case 'Email':
      return value
        ? `mailto:${value}?subject=${encodeURIComponent('Following up')}&body=${encoded}`
        : null;
    case 'LinkedIn':
      return value?.startsWith('http') ? value : 'https://www.linkedin.com/messaging/';
    case 'Instagram':
      return value?.startsWith('http') ? value : 'https://www.instagram.com/';
    case 'X':
      return value?.startsWith('http') ? value : 'https://x.com/messages';
    case 'WhatsApp':
      return value ? `https://wa.me/${value.replace(/\D/g, '')}?text=${encoded}` : null;
    case 'Call':
      return null;
    default:
      return null;
  }
}
