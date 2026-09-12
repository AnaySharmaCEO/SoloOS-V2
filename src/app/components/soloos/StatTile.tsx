import { cn } from '../ui/utils';

interface StatTileProps {
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down' | 'flat'; label: string };
  className?: string;
}

export function StatTile({ label, value, trend, className }: StatTileProps) {
  return (
    <div className={cn('rounded-md border border-line bg-paper p-4', className)}>
      <div className="text-xs font-medium text-ink-faint mb-2">{label}</div>
      <div className="font-mono text-[22px] font-semibold tracking-tight text-ink">{value}</div>
      {trend && (
        <div
          className={cn(
            'mt-1 text-[11.5px] flex items-center gap-1',
            trend.direction === 'up' && 'text-ledger-dark',
            trend.direction === 'flat' && 'text-ink-faint',
            trend.direction === 'down' && 'text-brick'
          )}
        >
          {trend.label}
        </div>
      )}
    </div>
  );
}
