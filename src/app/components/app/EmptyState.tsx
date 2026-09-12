import React from 'react';
import { Link } from 'react-router';
import { Plus, Settings, Calculator } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddLead?: () => void;
}

export function EmptyState({
  title = 'Get started with SoloOS',
  description = 'Follow these three steps to structure your sales workspace.',
  onAddLead,
}: EmptyStateProps) {
  const handleAddLeadClick = (e: React.MouseEvent) => {
    if (onAddLead) {
      e.preventDefault();
      onAddLead();
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-6">
      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground mb-8">{description}</p>
      <div className="grid gap-3 text-left">
        <Link
          to="/app/leads?add=true"
          onClick={handleAddLeadClick}
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-md hover:border-line-strong transition-all duration-150"
        >
          <div className="w-10 h-10 bg-ledger-tint dark:bg-ledger/20 rounded-md flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-ledger dark:text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Step 1 — Add an active lead</p>
            <p className="text-xs text-muted-foreground mt-0.5">Start tracking an active client opportunity or inquiry.</p>
          </div>
        </Link>

        <Link
          to="/app/settings"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-md hover:border-line-strong transition-all duration-150"
        >
          <div className="w-10 h-10 bg-amber-tint dark:bg-amber/20 rounded-md flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-amber-ink dark:text-amber" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Step 2 — Set up your workspace</p>
            <p className="text-xs text-muted-foreground mt-0.5">Configure your profile, billing preferences, and notifications.</p>
          </div>
        </Link>

        <Link
          to="/app/pricing"
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-md hover:border-line-strong transition-all duration-150"
        >
          <div className="w-10 h-10 bg-slate-tint dark:bg-slate/20 rounded-md flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5 text-slate dark:text-foreground" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Step 3 — Calculate a project quote</p>
            <p className="text-xs text-muted-foreground mt-0.5">Use the pricing advisor to estimate a target quote for your service.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
