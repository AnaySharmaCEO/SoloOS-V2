import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SendMessageModal } from './SendMessageModal';
import * as leadService from '../../../services/lead.service';
import * as channelsApi from '../../../api/channels.api';
import type { Lead, LeadContactChannel, ContactChannelType } from '../../../types';

interface FollowUpSenderModalProps {
  leadId: string | null;
  onClose: () => void;
  onMarkSent: () => void;
}

export function FollowUpSenderModal({ leadId, onClose, onMarkSent }: FollowUpSenderModalProps) {
  const { user } = useAuth();
  const userId = user?.user?.id;
  const [lead, setLead] = useState<Lead | null>(null);
  const [channels, setChannels] = useState<LeadContactChannel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (leadId && userId) {
      setLoading(true);
      Promise.all([
        leadService.getLeadById(leadId, userId),
        channelsApi.getChannelsForLead(leadId, userId),
      ]).then(([lRes, cRes]) => {
        if (lRes.data) setLead(lRes.data);
        if (cRes.data) setChannels(cRes.data);
        setLoading(false);
      });
    } else {
      setLead(null);
      setChannels([]);
    }
  }, [leadId, userId]);

  if (!leadId) return null;

  if (loading || !lead) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-surface border border-border rounded-xl p-6 shadow-2xl text-text-secondary text-xs">
          Loading opportunity context...
        </div>
      </div>
    );
  }

  const handleMarkSent = async (channel: ContactChannelType, message: string) => {
    if (!userId) return false;
    const ok = await leadService.recordMessageSent(userId, lead.id, channel, message);
    if (!ok.error) {
      onMarkSent();
      return true;
    }
    return false;
  };

  return (
    <SendMessageModal
      open={!!leadId}
      onClose={onClose}
      lead={lead}
      channels={channels}
      onMarkSent={handleMarkSent}
    />
  );
}
