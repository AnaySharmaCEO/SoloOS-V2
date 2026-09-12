import { Link } from 'react-router';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { cn } from '../ui/utils';

export function NotificationBell({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { user } = useAuth();
  const { notifications, count } = useNotifications(user?.user?.id);

  const iconClass =
    variant === 'dark'
      ? 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-surface dark:hover:bg-elevated'
      : 'text-text-secondary hover:text-text-primary hover:bg-elevated';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`relative p-2 rounded-lg cursor-pointer transition-colors ${iconClass}`} aria-label="Notifications">
          <Bell className="w-5 h-5" />
          {count > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ember" aria-hidden="true" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-surface border-border text-text-primary shadow-xl rounded-xl">
        <div className="px-4 py-3 border-b border-border">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">Needs attention</h4>
        </div>
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-text-secondary">
            You're caught up. Nothing urgent right now.
          </div>
        ) : (
          <ul className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link to={n.href} className="flex items-start gap-3 px-4 py-3 hover:bg-elevated transition-colors">
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 rounded-full shrink-0',
                      n.tone === 'amber' ? 'bg-amber-500' : 'bg-ember'
                    )}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{n.title}</p>
                    <p className="text-[11px] text-text-secondary truncate mt-0.5">{n.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
