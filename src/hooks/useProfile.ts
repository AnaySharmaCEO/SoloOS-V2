import { useState, useCallback } from 'react';
import { useAuth } from '../app/context/AuthContext';
import * as authService from '../services/auth.service';
import type { Profile } from '../types';

export function useProfile() {
  const { user, refreshSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<boolean> => {
      if (!user) {
        setError('No active session found');
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await authService.updateProfile(user.user.id, updates);
        if (result.error) {
          setError(result.error.message);
          return false;
        }
        await refreshSession(true);
        return true;
      } catch (err: any) {
        setError(err.message || 'An error occurred while updating profile');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, refreshSession]
  );

  const completeOnboarding = useCallback(
    async (data: {
      full_name?: string;
      role?: string;
      business_stage?: string;
      blocker?: string;
      avg_project_value?: number;
    }): Promise<boolean> => {
      if (!user) {
        setError('No active session found');
        return false;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await authService.completeOnboarding(user.user.id, data);
        if (result.error) {
          setError(result.error.message);
          return false;
        }
        await refreshSession(true);
        return true;
      } catch (err: any) {
        setError(err.message || 'An error occurred during onboarding');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user, refreshSession]
  );

  return {
    loading,
    error,
    updateProfile,
    completeOnboarding,
  };
}
