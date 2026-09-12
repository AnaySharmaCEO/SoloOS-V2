import { useState } from 'react';
import { X, DollarSign, Calendar } from 'lucide-react';
import type { Lead } from '../../../types';

interface AddProposalModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead;
  onAddProposal: (data: {
    amount: number;
    sent_date: string;
    expected_reply_date?: string;
    notes?: string;
  }) => Promise<boolean>;
}

export function AddProposalModal({ open, onClose, lead, onAddProposal }: AddProposalModalProps) {
  const [amount, setAmount] = useState('');
  const [sentDate, setSentDate] = useState(new Date().toISOString().slice(0, 10));
  const [expectedReplyDate, setExpectedReplyDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    setSaving(true);
    const ok = await onAddProposal({
      amount: parseInt(amount),
      sent_date: new Date(sentDate).toISOString(),
      expected_reply_date: expectedReplyDate ? new Date(expectedReplyDate).toISOString() : undefined,
      notes,
    });
    setSaving(false);

    if (ok) {
      setAmount('');
      setSentDate(new Date().toISOString().slice(0, 10));
      setExpectedReplyDate('');
      setNotes('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Add Proposal for {lead.name}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="5000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sent Date</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  required
                  value={sentDate}
                  onChange={(e) => setSentDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Reply</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="date"
                  value={expectedReplyDate}
                  onChange={(e) => setExpectedReplyDate(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Any context about this proposal..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !amount}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Adding...' : 'Add Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
