import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import * as authService from '../services/auth.service';
import type { AuthSession, Profile } from '../types';

interface UseAuthReturn {
  user: AuthSession | null;
  loading: boolean;
  initializing: boolean;
  profileLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
  completeOnboarding: (data: {
    full_name?: string;
    role?: string;
    business_stage?: string;
    blocker?: string;
    avg_project_value?: number;
  }) => Promise<boolean>;
  refreshSession: (forceProfileHydrate?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
}

const getPersistedSubdomain = (): string => {
  const url = import.meta.env.VITE_SUPABASE_URL || '';
  const match = url.match(/https:\/\/([^.]+)\.supabase/);
  return match ? match[1] : '';
};

const getCachedSessionAndProfile = (): { session: AuthSession | null; profile: Profile | null } => {
  try {
    const subdomain = getPersistedSubdomain();
    if (!subdomain) return { session: null, profile: null };

    const tokenStr = localStorage.getItem(`sb-${subdomain}-auth-token`);
    if (!tokenStr) return { session: null, profile: null };

    const sessionData = JSON.parse(tokenStr);
    if (!sessionData || !sessionData.user) return { session: null, profile: null };

    // Retrieve cached profile
    const profileStr = localStorage.getItem(`soloos-profile-cache-${sessionData.user.id}`);
    const cachedProfile = profileStr ? JSON.parse(profileStr) : null;

    return {
      session: {
        user: sessionData.user,
        profile: cachedProfile,
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      },
      profile: cachedProfile,
    };
  } catch (e) {
    console.error("Failed to parse cached session:", e);
    return { session: null, profile: null };
  }
};

export function useAuth(): UseAuthReturn {
  // Sync load cache to prevent loading flashes
  const cached = getCachedSessionAndProfile();

  const [user, setUser] = useState<AuthSession | null>(cached.session);
  const [loading, setLoading] = useState(cached.session ? false : true);
  const [initializing, setInitializing] = useState(cached.session ? false : true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userIdRef = useRef<string | null>(cached.session?.user?.id || null);

  const hydrateProfile = useCallback(async (userId: string) => {
    // ===== DEBUG BLOCK START: PROFILE HYDRATION FLOW =====
    // console.log("[PROFILE] Fetching profile started for user:", userId);
    // ===== DEBUG BLOCK END: PROFILE HYDRATION FLOW =====
    setProfileLoading(true);
    try {
      const profileResult = await authService.getProfile(userId);
      // ===== DEBUG BLOCK START: SUPABASE RESPONSE VALIDATION =====
      // console.log("[SUPABASE] getProfile result data:", profileResult.data, "error:", profileResult.error);
      // ===== DEBUG BLOCK END: SUPABASE RESPONSE VALIDATION =====
      if (profileResult.data) {
        // ===== DEBUG BLOCK START: PROFILE HYDRATION SUCCESS =====
        // console.log("[PROFILE] Hydration success for user:", userId, profileResult.data);
        // ===== DEBUG BLOCK END: PROFILE HYDRATION SUCCESS =====
        try {
          localStorage.setItem(`soloos-profile-cache-${userId}`, JSON.stringify(profileResult.data));
        } catch (e) {
          console.error("Failed to write to profile cache:", e);
        }
        setUser((prev) => {
          if (!prev || prev.user.id !== userId) return prev;
          return {
            ...prev,
            profile: profileResult.data!,
          };
        });
      } else {
        // ===== DEBUG BLOCK START: PROFILE HYDRATION FAILURE =====
        // console.warn("[PROFILE] Profile fetch returned no data or failed, using fallback profile");
        // ===== DEBUG BLOCK END: PROFILE HYDRATION FAILURE =====
        setUser((prev) => {
          if (!prev || prev.user.id !== userId) return prev;
          return {
            ...prev,
            profile: prev.profile || ({
              id: userId,
              user_id: userId,
              onboarding_complete: false,
            } as any),
          };
        });
      }
    } catch (err) {
      // ===== DEBUG BLOCK START: PROFILE HYDRATION ERROR =====
      // console.error("[PROFILE] Hydration caught error:", err);
      // ===== DEBUG BLOCK END: PROFILE HYDRATION ERROR =====
    } finally {
      setProfileLoading(false);
      // ===== DEBUG BLOCK START: PROFILE HYDRATION COMPLETE =====
      // console.log("[PROFILE] Hydration finished, profileLoading is now false");
      // ===== DEBUG BLOCK END: PROFILE HYDRATION COMPLETE =====
    }
  }, []);

  const refreshSession = useCallback(async (forceProfileHydrate = false) => {
    // ===== DEBUG BLOCK START: AUTH INITIALIZATION =====
    // console.log(`[AUTH] getSession() called, forceProfileHydrate: ${forceProfileHydrate}`);
    // ===== DEBUG BLOCK END: AUTH INITIALIZATION =====
    try {
      // 1. Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      // ===== DEBUG BLOCK START: SUPABASE RESPONSE VALIDATION =====
      // console.log("[SUPABASE] getSession result session:", !!session, "error:", sessionError);
      // ===== DEBUG BLOCK END: SUPABASE RESPONSE VALIDATION =====

      if (sessionError || !session) {
        // ===== DEBUG BLOCK START: AUTH SESSION FAILURE =====
        // console.log("[AUTH] getSession result: No active session found or error occurred.");
        // ===== DEBUG BLOCK END: AUTH SESSION FAILURE =====
        if (userIdRef.current) {
          localStorage.removeItem(`soloos-profile-cache-${userIdRef.current}`);
        }
        userIdRef.current = null;
        setUser(null);
        setLoading(false);
        setProfileLoading(false);
        return;
      }

      // 2. We have a session! Resolve auth state immediately.
      // ===== DEBUG BLOCK START: AUTH SESSION SUCCESS =====
      // console.log("[AUTH] Active session found. User ID resolved:", session.user.id);
      // ===== DEBUG BLOCK END: AUTH SESSION SUCCESS =====
      const prevUserId = userIdRef.current;
      userIdRef.current = session.user.id;
      
      setUser((prev) => {
        if (prev && prev.user.id === session.user.id) {
          return {
            user: session.user,
            profile: prev.profile,
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          };
        }
        return {
          user: session.user,
          profile: null, // Hydrates next
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        };
      });
      
      setLoading(false);
      // ===== DEBUG BLOCK START: AUTH RESOLUTION SUCCESS =====
      // console.log("[AUTH] Auth loading set to false. Session is authenticated immediately.");
      // ===== DEBUG BLOCK END: AUTH RESOLUTION SUCCESS =====

      // 3. Hydrate profile separately/asynchronously in background
      const shouldHydrate = !prevUserId || prevUserId !== session.user.id || forceProfileHydrate;
      if (shouldHydrate) {
        await hydrateProfile(session.user.id);
      } else {
        // ===== DEBUG BLOCK START: PROFILE HYDRATION SILENT =====
        // console.log("[PROFILE] Skipping background hydration (profile is already loaded and stable).");
        // ===== DEBUG BLOCK END: PROFILE HYDRATION SILENT =====
      }
    } catch (err) {
      // ===== DEBUG BLOCK START: AUTH SESSION ERROR =====
      // console.error("[AUTH] refreshSession caught exception error:", err);
      // ===== DEBUG BLOCK END: AUTH SESSION ERROR =====
      if (userIdRef.current) {
        localStorage.removeItem(`soloos-profile-cache-${userIdRef.current}`);
      }
      userIdRef.current = null;
      setUser(null);
      setLoading(false);
      setProfileLoading(false);
    }
  }, [hydrateProfile]);

  const refreshSessionRef = useRef(refreshSession);
  const hydrateProfileRef = useRef(hydrateProfile);

  useEffect(() => {
    refreshSessionRef.current = refreshSession;
    hydrateProfileRef.current = hydrateProfile;
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // ===== DEBUG BLOCK START: AUTH INITIAL LOAD =====
      // console.log("[AUTH] App Initializing starting...");
      // ===== DEBUG BLOCK END: AUTH INITIAL LOAD =====
      if (!mounted) return;
      try {
        await refreshSessionRef.current();
      } catch (err) {
        console.error('Initialization failed:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    };

    // Initial load
    init();

    // Step 4 — Handle auth state changes correctly
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      // ===== DEBUG BLOCK START: AUTH STATE CHANGE TRACE =====
      // console.log(`[AUTH] onAuthStateChange event: ${event}, session exists: ${!!session}`);
      if (event === 'TOKEN_REFRESHED') {
        // console.log("[AUTH] TOKEN_REFRESHED handled silently. Silently updating tokens...");
      }
      // ===== DEBUG BLOCK END: AUTH STATE CHANGE TRACE =====

      if (event === 'SIGNED_OUT' || !session) {
        if (userIdRef.current) {
          localStorage.removeItem(`soloos-profile-cache-${userIdRef.current}`);
        }
        userIdRef.current = null;
        setUser(null);
        setLoading(false);
        setProfileLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const currentUserChanged = !userIdRef.current || userIdRef.current !== session.user.id;
        
        // ===== DEBUG BLOCK START: AUTH STATE RESOLUTION =====
        // console.log(`[AUTH] onAuthStateChange resolution. event: ${event}, userId: ${session.user.id}, currentUserChanged: ${currentUserChanged}`);
        // ===== DEBUG BLOCK END: AUTH STATE RESOLUTION =====

        if (currentUserChanged) {
          userIdRef.current = session.user.id;
          await refreshSessionRef.current();
        } else {
          // Silently update the session parameters (tokens) without full reboot
          setUser((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              user: session.user,
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            };
          });
        }
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      if (result.data) {
        userIdRef.current = result.data.user.id;
        setUser(result.data);
        // Hydrate profile in background
        await hydrateProfile(result.data.user.id);
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  const register = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.register(email, password);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      if (result.data) {
        if (result.data.access_token) {
          userIdRef.current = result.data.user.id;
          setUser(result.data);
          // Hydrate profile in background
          await hydrateProfile(result.data.user.id);
        } else {
          // Email verification is pending; do not log in or hydrate profile
          userIdRef.current = null;
          setUser(null);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, [hydrateProfile]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      if (userIdRef.current) {
        localStorage.removeItem(`soloos-profile-cache-${userIdRef.current}`);
      }
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      userIdRef.current = null;
      setUser(null);
      setLoading(false);
      setProfileLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (updates: Partial<Profile>): Promise<boolean> => {
      if (!user) return false;
      setLoading(true);
      const result = await authService.updateProfile(user.user.id, updates);
      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return false;
      }
      if (result.data) {
        try {
          localStorage.setItem(`soloos-profile-cache-${user.user.id}`, JSON.stringify(result.data));
        } catch (e) {
          console.error("Failed to write to profile cache:", e);
        }
        setUser({ ...user, profile: result.data });
      }
      setLoading(false);
      return true;
    },
    [user]
  );

  const completeOnboarding = useCallback(
    async (data: {
      full_name?: string;
      role?: string;
      business_stage?: string;
      blocker?: string;
      avg_project_value?: number;
    }): Promise<boolean> => {
      if (!user) return false;
      setLoading(true);
      const result = await authService.completeOnboarding(user.user.id, data);
      if (result.error) {
        setError(result.error.message);
        setLoading(false);
        return false;
      }
      if (result.data) {
        try {
          localStorage.setItem(`soloos-profile-cache-${user.user.id}`, JSON.stringify(result.data));
        } catch (e) {
          console.error("Failed to write to profile cache:", e);
        }
        setUser({ ...user, profile: result.data });
      }
      setLoading(false);
      return true;
    },
    [user]
  );

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.signInWithGoogle();
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Google login failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const resendVerification = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.resendVerificationEmail(email);
      if (result.error) {
        setError(result.error.message);
        return false;
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Resend verification email failed');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    initializing,
    profileLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    completeOnboarding,
    refreshSession,
    loginWithGoogle,
    resendVerification,
  };
}
