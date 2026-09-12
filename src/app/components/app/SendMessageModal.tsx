import { useState, useEffect } from 'react';
import { X, Copy, ExternalLink, Phone, Sparkles } from 'lucide-react';
import type { ContactChannelType, Lead, LeadContactChannel } from '../../../types';
import * as messageService from '../../../services/message.service';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { toast } from 'sonner';

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead;
  channels: LeadContactChannel[];
  onMarkSent: (channel: ContactChannelType, message: string) => Promise<boolean>;
}

export function SendMessageModal({
  open,
  onClose,
  lead,
  channels,
  onMarkSent,
}: SendMessageModalProps) {
  const { entitlements, canUse } = useEntitlements();
  const isPro = canUse('ai_followup_drafts') || entitlements.planId === 'pro';

  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<ContactChannelType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && lead) {
      if (isPro) {
        // Context-calibrated follow-up draft based on lead stage and days waiting
        const name = lead.name.split(' ')[0];
        const company = lead.company || 'your team';
        let calibratedDraft = '';

        if (lead.stage === 'Proposal Sent') {
          calibratedDraft = `Hi ${name}, just following up on the proposal I sent over for ${company}. Happy to clarify any line items or timeline adjustments whenever you're ready. Would a quick 5-minute call Thursday help you make a decision?`;
        } else if (lead.stage === 'Warm Lead') {
          calibratedDraft = `Hi ${name}, hope you're having a productive week. Following up on our recent conversation about ${company} — are you ready to finalize scope so we can lock in dates on my calendar?`;
        } else if (lead.days_in_stage > 5) {
          calibratedDraft = `Hi ${name}, circling back on our conversation regarding ${company}. I know schedules get packed — let me know if this is still a priority for this quarter, or if we should reconnect down the line.`;
        } else {
          calibratedDraft = messageService.generateMessage({ lead });
        }
        setMessage(calibratedDraft);
      } else {
        setMessage(messageService.generateMessage({ lead }));
      }
      setSelectedChannel(channels[0]?.channel_type ?? null);
    }
  }, [open, lead, channels, isPro]);

  if (!open) return null;

  const label = messageService.getSendActionLabel(lead.stage);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    toast.success('Message copied to clipboard');
  };

  const handleOpen = () => {
    if (!selectedChannel) return;
    const ch = channels.find((c) => c.channel_type === selectedChannel);
    const url = messageService.getChannelRedirectUrl(
      selectedChannel,
      ch?.channel_value || lead.email || lead.phone,
      message
    );
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleMarkSent = async () => {
    if (!selectedChannel) return;
    setSaving(true);
    const ok = await onMarkSent(selectedChannel, message);
    setSaving(false);
    if (ok) {
      toast.success('Message recorded as sent');
      onClose();
    } else {
      toast.error('Failed to record sent message');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-text-primary">{label}</h2>
            {isPro ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-tint text-green">
                <Sparkles className="w-2.5 h-2.5" /> Calibrated
              </span>
            ) : (
              <span className="text-[10px] font-medium text-text-secondary px-2 py-0.5 rounded-full bg-elevated border border-border">
                Template
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-text-secondary mb-4">
          Send via configured channels for <strong className="text-text-primary">{lead.name}</strong>
        </p>

        {channels.length === 0 ? (
          <p className="text-xs text-danger mb-4 p-3 bg-danger-tint border border-danger/20 rounded-lg">
            No contact channels configured for this lead. Add email or phone on the lead record first.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 mb-4">
            {channels.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setSelectedChannel(ch.channel_type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedChannel === ch.channel_type
                    ? 'bg-green text-white shadow-sm'
                    : 'bg-elevated border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {ch.channel_type}
              </button>
            ))}
          </div>
        )}

        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 px-3.5 py-3 bg-elevated border border-border rounded-lg text-xs text-text-primary outline-none focus:border-green transition-colors resize-none leading-relaxed"
          />
          <div className="flex justify-between items-center mt-1 px-1">
            <span className="text-[11px] text-text-secondary">
              {isPro
                ? 'Calibrated to lead stage and waiting duration'
                : 'Standard template — edit freely before sending'}
            </span>
            <span className="text-[11px] font-mono text-text-secondary">{message.length} chars</span>
          </div>
        </div>

        {selectedChannel === 'Call' && (
          <div className="flex items-center gap-2 p-3 bg-elevated border border-border rounded-lg mb-4 text-xs">
            <Phone className="w-4 h-4 text-green" />
            <span className="font-mono font-medium text-text-primary">
              {channels.find((c) => c.channel_type === 'Call')?.channel_value || lead.phone || 'No number'}
            </span>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-elevated border border-border rounded-lg text-xs font-semibold text-text-primary hover:bg-surface transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          {selectedChannel !== 'Call' && (
            <button
              type="button"
              onClick={handleOpen}
              disabled={!selectedChannel}
              className="flex items-center gap-1.5 px-3 py-2 bg-elevated border border-border rounded-lg text-xs font-semibold text-text-primary hover:bg-surface disabled:opacity-50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open platform
            </button>
          )}
          <button
            type="button"
            onClick={handleMarkSent}
            disabled={!selectedChannel || saving}
            className="ml-auto px-4 py-2 bg-green hover:bg-green-hover text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shadow-sm"
          >
            {saving ? 'Saving…' : 'Mark as sent'}
          </button>
        </div>
      </div>
    </div>
  );
}
