import { useState, useEffect } from 'react';
import { FEATURE_FLAGS } from '../config/features';

/**
 * Custom hook to monitor window size and determine if the current viewport
 * meets the minimum system requirements for SoloOS Dashboard.
 *
 * Minimum Supported Resolution:
 * - Width: 780px
 * - Height: 680px
 *
 * NOTE: gated behind FEATURE_FLAGS.VIEWPORT_GUARD_ENABLED and OFF by
 * default. The mobile responsive pass replaces the old hard block with
 * real mobile layouts (sidebar -> drawer/bottom nav, stacked detail
 * views, responsive tables). The detection logic is kept intact — not
 * removed — in case a specific screen ever needs a size floor again.
 */
export function useViewportGuard(minWidth = 780, minHeight = 680): boolean {
  const [isUnsupported, setIsUnsupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < minWidth || window.innerHeight < minHeight;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsUnsupported(window.innerWidth < minWidth || window.innerHeight < minHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth, minHeight]);

  return FEATURE_FLAGS.VIEWPORT_GUARD_ENABLED && isUnsupported;
}
