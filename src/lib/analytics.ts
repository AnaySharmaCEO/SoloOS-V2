// ============================================
// ACTIVITY / FUNNEL EVENT INSTRUMENTATION
// ============================================
// Not to be confused with src/services/activity.service.ts, which logs
// CRM-facing activity (lead/client timelines). This is product-analytics
// instrumentation for the funnel events called out in the monetization
// audit \u2014 account_created, first_lead_added, upgrade_page_viewed, etc.
//
// TODO(analytics-backend): swap the body of trackEvent() for a real
// provider call (PostHog, Segment, Amplitude...). Every call site below
// stays the same when that happens.

export type ProductEvent =
  | 'account_created'
  | 'onboarding_completed'
  | 'first_lead_added'
  | 'first_followup_completed'
  | 'first_proposal_sent'
  | 'pricing_estimate_saved'
  | 'upgrade_page_viewed'
  | 'checkout_started'
  | 'checkout_completed'
  | 'coming_soon_feature_viewed'
  | 'csv_export_used';

export function trackEvent(event: ProductEvent, properties?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.info(`[analytics] ${event}`, properties || {});
  }
  // TODO(analytics-backend): forward to a real provider here.
}
