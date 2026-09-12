/**
 * Frontend feature flags. Kept intentionally simple (no remote config) —
 * flip these constants to change behavior without deleting the
 * underlying implementation.
 */
export const FEATURE_FLAGS = {
  /**
   * When true, screens below the minimum viewport show the "desktop
   * recommended" blocking modal (see useViewportGuard / ViewportRestrictionModal).
   * Off by default: the mobile responsive pass replaces the old hard
   * block with real mobile layouts. Kept as a flag (not deleted) in case
   * a specific screen ever needs to reintroduce a size floor.
   */
  VIEWPORT_GUARD_ENABLED: false,
} as const;
