// ============================================
// TRUSTED EMAIL DOMAIN VALIDATOR
// ============================================
// Single source of truth for email domain validation.
// Must stay in sync with the Supabase trigger: restrict_to_trusted_providers()

/**
 * Set of all trusted email provider domains (lowercase).
 * This list mirrors the backend Supabase trigger exactly.
 */
export const TRUSTED_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  // Google
  'gmail.com',
  'googlemail.com',

  // Microsoft
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',

  // Yahoo
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // AOL
  'aol.com',
  'aim.com',

  // Proton
  'proton.me',
  'protonmail.com',
  'protonmail.ch',

  // Zoho
  'zoho.com',
  'zoho.in',

  // GMX
  'gmx.com',
  'gmx.net',
  'gmx.de',

  // Mail.com
  'mail.com',

  // Fastmail
  'fastmail.com',
  'fastmail.fm',

  // Tuta / Tutanota
  'tutanota.com',
  'tuta.io',
  'tuta.com',
]);

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Returns `true` if the email belongs to a trusted provider domain.
 * Returns `false` for empty strings, malformed emails, or untrusted domains.
 *
 * This is the client-side gate — it prevents unnecessary Supabase auth requests.
 * The backend trigger remains the security authority.
 */
export function validateTrustedEmailDomain(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1]?.toLowerCase().trim();
  if (!domain) return false;
  return TRUSTED_EMAIL_DOMAINS.has(domain);
}

/**
 * User-friendly error message for untrusted domain rejection.
 * Used by both the inline validator and the backend error mapper.
 */
export const UNTRUSTED_DOMAIN_MESSAGE =
  'Cannot create account with this email domain. Please use a trusted email provider such as Gmail, Outlook, Yahoo, or iCloud.';

/**
 * Checks if a Supabase error message indicates a backend domain rejection.
 * Maps the raw Postgres trigger exception to a clean UI message.
 */
export function isBackendDomainRejection(errorMessage: string | undefined | null): boolean {
  if (!errorMessage) return false;
  return errorMessage.toLowerCase().includes('signup denied');
}