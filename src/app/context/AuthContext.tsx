// ============================================
// AUTH CONTEXT - Production-ready version
// ============================================

import { createContext, ReactNode, useContext } from 'react';
import { useAuth as useAuthHook } from '../../hooks/useAuth';
import type { AuthSession, Profile } from '../../types';

interface AuthContextType {
  user: AuthSession | null;
  loading: boolean;
  initializing: boolean;
  profileLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  completeOnboarding: (data: any) => Promise<boolean>;
  refreshSession: (forceProfileHydrate?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
}

// ===== DEBUG BLOCK START: AUTH PROVIDER IMPORTS =====
import { useEffect, useRef } from 'react';
// ===== DEBUG BLOCK END: AUTH PROVIDER IMPORTS =====

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthHook();

  // ===== DEBUG BLOCK START: AUTH PROVIDER TRACE =====
  const renderCount = useRef(0);
  renderCount.current += 1;
  // console.log(`[AUTH PROVIDER] rerender count: ${renderCount.current}, auth state user id:`, auth?.user?.user?.id || 'none');
  useEffect(() => {
    // console.log("[AUTH PROVIDER] mounted");
    return () => {
      // console.log("[AUTH PROVIDER] unmounted");
    };
  }, []);
  // ===== DEBUG BLOCK END: AUTH PROVIDER TRACE =====

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Convenience hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
