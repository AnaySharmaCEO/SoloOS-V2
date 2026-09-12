import { useState } from 'react';
import { X } from 'lucide-react';
import { LEAD_STAGES, LOST_REASONS, type LeadStage } from '../../../types';

interface MoveStageModalProps {
  open: boolean;
  onClose: () => void;
  currentStage: LeadStage;
  onConfirm: (stage: LeadStage, lostReason?: string, winReason?: string) => Promise<boolean>;
}

export function MoveStageModal({ open, onClose, currentStage, onConfirm }: MoveStageModalProps) {
  const [stage, setStage] = useState<LeadStage>(currentStage);
  const [lostReason, setLostReason] = useState('');
  const [winReason, setWinReason] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (stage === 'Lost' && !lostReason.trim()) {
      alert('Please select or enter why this deal was lost.');
      return;
    }
    setSaving(true);
    const ok = await onConfirm(
      stage,
      stage === 'Lost' ? lostReason : undefined,
      stage === 'Won' ? winReason || undefined : undefined
    );
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Move Stage</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          {LEAD_STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={`w-full text-left px-4 py-2 rounded-lg border ${
                stage === s ? 'border-blue-600 bg-blue-50 font-semibold' : 'border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {stage === 'Lost' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Why was this lost? (required)
            </label>
            <select
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
            >
              <option value="">Select reason…</option>
              {LOST_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        )}

        {stage === 'Won' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Win note (optional)</label>
            <input
              type="text"
              value={winReason}
              onChange={(e) => setWinReason(e.target.value)}
              placeholder="e.g. Signed after proposal call"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">A client record will be created automatically.</p>
          </div>
        )}

        {stage === 'Proposal Sent' && (
          <p className="text-sm text-gray-600 mb-4">
            Tip: create a proposal from the lead detail page to track decision timing.
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Updating…' : 'Confirm Stage Change'}
        </button>
      </div>
    </div>
  );
}
