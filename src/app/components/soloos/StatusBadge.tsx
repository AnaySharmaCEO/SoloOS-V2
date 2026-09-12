import { cn } from '../ui/utils';

export type StatusTone = 'green' | 'ember' | 'danger' | 'slate' | 'amber' | 'ledger' | 'brick';

const TONE_CLASSES: Record<StatusTone, { bg: string; text: string; dot: string }> = {
  green: { bg: 'bg-green-tint', text: 'text-green font-semibold', dot: 'bg-green' },
  ledger: { bg: 'bg-green-tint', text: 'text-green font-semibold', dot: 'bg-green' },
  ember: { bg: 'bg-ember-tint', text: 'text-ember font-semibold', dot: 'bg-ember' },
  danger: { bg: 'bg-danger-tint', text: 'text-danger font-semibold', dot: 'bg-danger' },
  brick: { bg: 'bg-danger-tint', text: 'text-danger font-semibold', dot: 'bg-danger' },
  slate: { bg: 'bg-elevated border border-border', text: 'text-text-secondary font-medium', dot: 'bg-text-secondary' },
  amber: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400 font-semibold', dot: 'bg-amber-500' },
};

interface StatusBadgeProps {
  tone: StatusTone;
  children: React.ReactNode;
  className?: string;
}

/** Use for anything status-like: lead risk, proposal status, client
 *  health, billing status. Always pairs a dot + text label with the tint
 *  so meaning never depends on color alone. */
export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  const classes = TONE_CLASSES[tone] || TONE_CLASSES.slate;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        classes.bg,
        classes.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', classes.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}
