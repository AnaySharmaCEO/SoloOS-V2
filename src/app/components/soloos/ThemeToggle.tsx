import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  variant?: 'buttons' | 'dropdown' | 'icon';
  className?: string;
}

export function ThemeToggle({ variant = 'buttons', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-7 bg-elevated rounded-lg animate-pulse" />;
  }

  if (variant === 'icon') {
    const isDark = theme === 'dark';
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className={`p-1.5 rounded-lg hover:bg-elevated text-text-secondary hover:text-text-primary transition-colors cursor-pointer ${className}`}
        aria-label="Toggle theme"
        title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-text-secondary" />}
      </button>
    );
  }

  return (
    <div className={`inline-flex items-center p-0.5 bg-surface border border-border rounded-lg ${className}`}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-green text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Light theme"
      >
        <Sun className="w-3.5 h-3.5" />
        <span>Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-green text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Dark theme"
      >
        <Moon className="w-3.5 h-3.5" />
        <span>Dark</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
          theme === 'system'
            ? 'bg-green text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="System preference"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>System</span>
      </button>
    </div>
  );
}
