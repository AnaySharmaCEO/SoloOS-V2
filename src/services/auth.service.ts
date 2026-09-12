// ============================================
// AUTHENTICATION SERVICE
// ============================================
// Business logic for authentication flows

import * as authApi from '../api/auth.api';
import { validateTrustedEmailDomain, UNTRUSTED_DOMAIN_MESSAGE } from '../lib/emailValidator';
import type { ApiResponse, AuthSession, Profile } from '../types';

// ============================================
// AUTHENTICATION METHODS
// ============================================

export async function register(email: string, password: string): Promise<ApiResponse<AuthSession>> {
  // Validate inputs
  if (!email || !password) {
    return { data: null, error: { message: 'Email and password are required' } };
  }

  if (password.length < 6) {
    return { data: null, error: { message: 'Password must be at least 6 characters' } };
  }

  // Client-side email domain validation — prevents unnecessary Supabase request
  if (!validateTrustedEmailDomain(email)) {
    return { data: null, error: { message: UNTRUSTED_DOMAIN_MESSAGE } };
  }

  return authApi.signUp(email, password);
}

export async function login(email: string, password: string): Promise<ApiResponse<AuthSession>> {
  // Validate inputs
  if (!email || !password) {
    return { data: null, error: { message: 'Email and password are required' } };
  }

  return authApi.signIn(email, password);
}

export async function logout(): Promise<ApiResponse<void>> {
  return authApi.signOut();
}

export async function getCurrentUser(): Promise<ApiResponse<AuthSession>> {
  return authApi.getCurrentSession();
}

export async function signInWithGoogle(): Promise<ApiResponse<void>> {
  return authApi.signInWithGoogle();
}

export async function resendVerificationEmail(email: string): Promise<ApiResponse<void>> {
  if (!email) {
    return { data: null, error: { message: 'Email address is required' } };
  }
  return authApi.resendVerificationEmail(email);
}

// ============================================
// PROFILE METHODS
// ============================================

export async function getProfile(userId: string): Promise<ApiResponse<Profile>> {
  return authApi.getProfile(userId);
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<ApiResponse<Profile>> {
  return authApi.updateProfile(userId, updates);
}

export async function completeOnboarding(
  userId: string,
  data: {
    full_name?: string;
    role?: string;
    business_stage?: string;
    blocker?: string;
    avg_project_value?: number;
  }
): Promise<ApiResponse<Profile>> {
  // Validate onboarding data
  if (!data.full_name || !data.role || !data.business_stage || !data.blocker) {
    return {
      data: null,
      error: { message: 'Please complete all onboarding steps' },
    };
  }

  return authApi.completeOnboarding(userId, data);
}

// ============================================
// CHANGE PASSWORD
// ============================================

export async function changePassword(newPassword: string): Promise<ApiResponse<void>> {
  if (!newPassword || newPassword.length < 6) {
    return { data: null, error: { message: 'Password must be at least 6 characters' } };
  }
  return authApi.changePassword(newPassword);
}

export async function verifyCurrentPassword(email: string, currentPassword: string): Promise<ApiResponse<boolean>> {
  if (!currentPassword) {
    return { data: false, error: { message: 'Current password is required.' } };
  }
  return authApi.verifyCurrentPassword(email, currentPassword);
}

export async function sendPasswordResetEmail(email: string): Promise<ApiResponse<void>> {
  if (!email) {
    return { data: null, error: { message: 'Email is required.' } };
  }
  return authApi.sendPasswordResetEmail(email);
}

// ============================================
// ACCOUNT DELETION
// ============================================
// TODO(backend): wire to a Supabase Edge Function that cascades the
// delete across leads/clients/proposals/follow-ups, cancels any active
// subscription with the billing provider first, then deletes the auth
// user. Deleting from the frontend directly is unsafe (RLS aside, a
// partial failure would leave orphaned billing records).

export async function requestAccountDeletion(_userId: string): Promise<ApiResponse<void>> {
  return {
    data: null,
    error: { message: 'Account deletion isn\u2019t wired up yet. Email us and we\u2019ll take care of it by hand for now.' },
  };
}

// Removed SESSION HELPERS
