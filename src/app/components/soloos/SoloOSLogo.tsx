import { useId } from 'react';

interface SoloOSLogoProps {
  className?: string;
  showText?: boolean;
  variant?: 'auto' | 'dark' | 'light';
  height?: number | string;
  subtitle?: string;
}

export function SoloOSLogo({
  className = '',
  showText = true,
  variant = 'auto',
  height = 32,
  subtitle,
}: SoloOSLogoProps) {
  const id = useId().replace(/:/g, '');
  const leadGradId = `leadGradient-${id}`;
  const railGradId = `railGradient-${id}`;

  const soloColor =
    variant === 'dark'
      ? '#F2F4F8'
      : variant === 'light'
      ? '#12172A'
      : undefined;

  if (!showText) {
    return (
      <svg
        viewBox="0 0 28 32"
        height={height}
        width={typeof height === 'number' ? height * (28 / 32) : undefined}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="SoloOS"
      >
        <defs>
          <linearGradient id={leadGradId} x1="10" y1="11.5" x2="18" y2="20.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id={railGradId} x1="2" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D6A4D" />
            <stop offset="100%" stopColor="#0A523B" />
          </linearGradient>
        </defs>
        <g id="Pipeline-Icon-Refined">
          <rect x="2" y="7" width="20" height="3.5" rx="1.75" fill={`url(#${railGradId})`} />
          <circle cx="15" cy="16" r="5" fill={`url(#${leadGradId})`} />
          <rect x="5" y="21.5" width="21" height="3.5" rx="1.75" fill={`url(#${railGradId})`} />
        </g>
      </svg>
    );
  }

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <svg
        viewBox="0 0 130 32"
        height={height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto h-auto max-h-8"
        aria-label="SoloOS"
      >
        <defs>
          <linearGradient id={leadGradId} x1="10" y1="11.5" x2="18" y2="20.5" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id={railGradId} x1="2" y1="16" x2="26" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D6A4D" />
            <stop offset="100%" stopColor="#0A523B" />
          </linearGradient>
        </defs>

        <g id="Pipeline-Icon-Refined">
          <rect x="2" y="7" width="20" height="3.5" rx="1.75" fill={`url(#${railGradId})`} />
          <circle cx="15" cy="16" r="5" fill={`url(#${leadGradId})`} />
          <rect x="5" y="21.5" width="21" height="3.5" rx="1.75" fill={`url(#${railGradId})`} />
        </g>

        <g id="Brand-Text">
          <text
            x="38"
            y="22"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="16"
            fontWeight="800"
            letterSpacing="-0.03em"
            fill={soloColor}
            className={variant === 'auto' ? 'fill-[#12172A] dark:fill-[#F2F4F8]' : undefined}
          >
            Solo
          </text>
          <text
            x="74"
            y="22"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="16"
            fontWeight="600"
            letterSpacing="-0.01em"
            fill="#0D6A4D"
          >
            OS
          </text>
        </g>
      </svg>
      {subtitle && (
        <span className="text-[10.5px] text-text-secondary font-medium pl-[38px] -mt-1 select-none">
          {subtitle}
        </span>
      )}
    </div>
  );
}
