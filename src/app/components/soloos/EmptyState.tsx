import type { ReactNode } from 'react';
import { cn } from '../ui/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-md border border-dashed border-line-strong p-6 md:p-8 text-left max-w-md',
        className
      )}
    >
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      <p className="text-[13px] text-ink-faint mb-4 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
