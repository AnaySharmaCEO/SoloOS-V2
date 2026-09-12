import { Link } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

interface AuthCTAProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  className?: string;
  guestTo?: string;
}

export function AuthCTA({ variant = 'primary', children, className = '', guestTo }: AuthCTAProps) {
  const { user, loading } = useContext(AuthContext)!;

  // Remove loading block to ensure buttons are always clickable
  // even if auth state is still resolving

  if (user?.profile?.onboarding_complete) {
    return (
      <Link to="/app" className={className}>
        {children}
      </Link>
    );
  }

  if (user) {
    return (
      <Link to="/onboarding" className={className}>
        {children}
      </Link>
    );
  }

  return (
    <Link to={guestTo || (variant === 'primary' ? '/signup' : '/login')} className={className}>
      {children}
    </Link>
  );
}
