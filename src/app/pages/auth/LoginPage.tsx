import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import * as authService from '../../../services/auth.service';
import { Mail, ArrowLeft, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { SoloOSLogo } from '../../components/soloos/SoloOSLogo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verificationPending, setVerificationPending] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { login, loading, user, loginWithGoogle, resendVerification, error: authError } = useContext(AuthContext)!;
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      if (user.profile?.onboarding_complete) {
        navigate('/app', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResendStatus(null);

    const success = await login(email, password);
    if (success) {
      const session = await authService.getCurrentUser();
      if (session.data?.profile?.onboarding_complete) {
        navigate('/app');
      } else {
        navigate('/onboarding');
      }
    } else {
      if (authError?.toLowerCase().includes('confirm') || authError?.toLowerCase().includes('verify')) {
        setVerificationPending(true);
      } else {
        setError(authError || 'Invalid email or password');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;
    setResendLoading(true);
    setResendStatus(null);
    try {
      const success = await resendVerification(email);
      if (success) {
        setResendStatus({
          type: 'success',
          message: 'A fresh verification link has been sent to your email.',
        });
      } else {
        setResendStatus({
          type: 'error',
          message: "We couldn't send the verification email right now. Email delivery is temporarily unavailable. Please try again later, or continue using Google Sign-In instead.",
        });
      }
    } catch (err: any) {
      setResendStatus({
        type: 'error',
        message: err.message || 'Failed to resend verification email.',
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="bg-card rounded-md shadow-2xs p-8 w-full max-w-md border border-border">
          <div className="text-center mb-6 space-y-2">
            <div className="w-12 h-12 bg-ledger-tint text-ledger rounded-full flex items-center justify-center mx-auto mb-3 border border-ledger/30">
              <Mail className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Verify your email</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Verification email sent to <span className="font-semibold text-foreground">{email}</span>. Click the link to confirm your account.
            </p>
          </div>

          {resendStatus && (
            <div className={`p-3.5 rounded-md mb-5 text-xs flex gap-2.5 ${
              resendStatus.type === 'success'
                ? 'bg-ledger-tint border border-ledger/40 text-ledger-dark dark:text-ledger'
                : 'bg-amber-tint border border-amber/40 text-amber-ink'
            }`}>
              {resendStatus.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-medium leading-relaxed">{resendStatus.message}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendEmail}
              disabled={resendLoading}
              className="w-full h-10 text-xs font-semibold"
            >
              {resendLoading && <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
              Resend verification email
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full h-10 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.828-6.357-6.314 0-3.486 2.847-6.315 6.357-6.315 1.516 0 2.9.529 3.987 1.402l3.14-3.14C18.966 2.127 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.238 11.226-9.845H12.24v-3.35z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setVerificationPending(false)}
            className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="bg-card rounded-md shadow-2xs p-8 w-full max-w-md border border-border">
        <div className="text-center mb-6 space-y-2">
          <div className="flex justify-center mb-2">
            <SoloOSLogo variant="auto" height={36} />
          </div>
          <p className="text-xs text-text-secondary">Sign in to your sales workspace</p>
        </div>

        {error && (
          <div className="bg-brick-tint border border-brick/40 text-brick-ink px-3.5 py-2.5 rounded-md mb-5 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 bg-input-background border border-border rounded-md text-foreground outline-none focus:ring-1 focus:ring-ledger text-sm font-medium"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 bg-input-background border border-border rounded-md text-foreground outline-none focus:ring-1 focus:ring-ledger text-sm font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 text-xs font-semibold bg-ledger hover:bg-ledger-dark text-white"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
            <span className="bg-card px-2.5 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full h-10 text-xs font-semibold flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.357-2.828-6.357-6.314 0-3.486 2.847-6.315 6.357-6.315 1.516 0 2.9.529 3.987 1.402l3.14-3.14C18.966 2.127 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.238 11.226-9.845H12.24v-3.35z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-ledger-dark dark:text-ledger font-semibold hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
