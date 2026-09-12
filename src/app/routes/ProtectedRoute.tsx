import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { user, initializing, profileLoading } = useContext(AuthContext)!;

  // ===== DEBUG BLOCK START: PROTECTED ROUTE TRACE =====
  // console.log("[ROUTE] user exists:", !!user, "auth initializing:", initializing, "profile loading:", profileLoading, "onboarding complete:", user?.profile?.onboarding_complete);
  // ===== DEBUG BLOCK END: PROTECTED ROUTE TRACE =====

  if (initializing || (profileLoading && !user?.profile)) {
    // ===== DEBUG BLOCK START: PROTECTED ROUTE LOADING =====
    // console.log("[ROUTE] ProtectedRoute waiting on initializing state...");
    // ===== DEBUG BLOCK END: PROTECTED ROUTE LOADING =====
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    // ===== DEBUG BLOCK START: PROTECTED ROUTE REDIRECT =====
    // console.log("[ROUTE] redirect target: /login");
    // ===== DEBUG BLOCK END: PROTECTED ROUTE REDIRECT =====
    return <Navigate to="/login" replace />;
  }

  if (requireOnboarding && !user.profile?.onboarding_complete) {
    // ===== DEBUG BLOCK START: PROTECTED ROUTE REDIRECT =====
    // console.log("[ROUTE] redirect target: /onboarding");
    // ===== DEBUG BLOCK END: PROTECTED ROUTE REDIRECT =====
    return <Navigate to="/onboarding" replace />;
  }

  // ===== DEBUG BLOCK START: PROTECTED ROUTE RENDER =====
  // console.log("[ROUTE] rendering protected children");
  // ===== DEBUG BLOCK END: PROTECTED ROUTE RENDER =====
  return <>{children}</>;
}
