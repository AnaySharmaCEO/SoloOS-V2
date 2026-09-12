import { ReactNode, useContext } from 'react';
import { Navigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';

export function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { user, initializing, profileLoading } = useContext(AuthContext)!;

  if (initializing || (profileLoading && user && !user.profile)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    if (user.profile?.onboarding_complete) {
      return <Navigate to="/app" replace />;
    }
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
