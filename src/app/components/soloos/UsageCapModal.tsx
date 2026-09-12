import { Link } from 'react-router';
import { X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/button';

interface UsageCapModalProps {
  open: boolean;
  onClose: () => void;
  type?: 'leads' | 'clients';
  count?: number;
}

export function UsageCapModal({ open, onClose, type = 'leads', count = 5 }: UsageCapModalProps) {
  if (!open) return null;

  const title = type === 'leads' ? 'Active lead limit reached' : 'Active client limit reached';
  const description =
    type === 'leads'
      ? `You're at ${count} active leads on the Free plan. Archive one to add another, or upgrade for unlimited.`
      : `You're at ${count} active clients on the Free plan. Move one to past clients to add another, or upgrade for unlimited.`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div
        className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-md w-full animate-in zoom-in-95 duration-150 space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="usage-cap-title"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ember" />
            <h2 id="usage-cap-title" className="text-base font-bold text-foreground">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            asChild
            className="flex-1 bg-green hover:bg-green-hover text-white font-semibold text-xs h-9 shadow-xs"
          >
            <Link to="/app/settings/billing">
              <span>Upgrade to Pro</span>
              <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 text-xs font-semibold h-9"
          >
            {type === 'leads' ? 'Manage leads' : 'Manage clients'}
          </Button>
        </div>
      </div>
    </div>
  );
}
