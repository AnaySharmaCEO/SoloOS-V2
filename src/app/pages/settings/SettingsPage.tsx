import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../../hooks/useProfile';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { useLeads } from '../../../hooks/useLeads';
import { useClients } from '../../../hooks/useClients';
import * as authService from '../../../services/auth.service';
import * as leadService from '../../../services/lead.service';
import * as clientService from '../../../services/client.service';
import * as proposalService from '../../../services/proposal.service';
import { downloadCsv } from '../../../lib/csvExport';
import { getProvider, getDefaultProvider } from '../../../services/billing/billing.service';
import { PLANS } from '../../../config/plans';
import { PlanCards } from '../../components/soloos/PlanCards';
import { PlanBadge } from '../../components/soloos/PlanBadge';
import { LegalModal, type LegalDocType } from '../../components/soloos/LegalModal';
import { supabase } from '../../../lib/supabase';
import {
  User as UserIcon,
  Bell,
  DollarSign,
  CreditCard,
  ShieldCheck,
  Download,
  AlertTriangle,
  BarChart2,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ExternalLink,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';
import { toast } from 'sonner';

const TABS = ['profile', 'notifications', 'billing', 'security', 'export', 'danger'] as const;
type TabId = (typeof TABS)[number];

export default function SettingsPage() {
  const { user } = useAuth();
  const userId = user?.user?.id;
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const activeTab: TabId = TABS.includes(tab as TabId) ? (tab as TabId) : 'profile';

  const { updateProfile, loading, error: profileError } = useProfile();
  const { entitlements } = useEntitlements();
  const { leads } = useLeads(userId);
  const { clients } = useClients(userId);

  const isFree = entitlements.planId === 'free';
  const activeLeadsCount = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').length;
  const activeClientsCount = clients.filter((c) => c.client_status === 'active').length;

  const [profile, setProfile] = useState({
    name: user?.profile?.full_name || '',
    email: user?.user?.email || '',
    role: user?.profile?.role || 'Copywriter',
    avgProjectValue: user?.profile?.avg_project_value || 2500,
  });

  const [notifications, setNotifications] = useState({
    followUpReminders: user?.profile?.notify_followup_reminders ?? true,
    proposalUpdates: user?.profile?.notify_proposal_updates ?? true,
    leadActivity: user?.profile?.notify_lead_activity ?? true,
    weeklyDigest: user?.profile?.notify_weekly_digest ?? false,
  });

  const [businessSettings, setBusinessSettings] = useState({
    followUpInterval: user?.profile?.default_followup_interval_days ?? 3,
    riskThreshold: user?.profile?.risk_alert_threshold_days ?? 5,
  });

  const [authProvider, setAuthProvider] = useState<'email' | 'google' | 'unknown'>('email');
  const [passwordStep, setPasswordStep] = useState<'idle' | 'enter_current' | 'enter_new' | 'reset_sent'>('idle');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordForm, setPasswordForm] = useState({ next: '', confirm: '' });
  const [verifyingCurrent, setVerifyingCurrent] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);

  useEffect(() => {
    async function checkProvider() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const appMeta = data.user.app_metadata;
          const identities = data.user.identities || [];
          const providers = appMeta?.providers || (appMeta?.provider ? [appMeta.provider] : []);
          const hasGoogle = providers.includes('google') || identities.some((i: any) => i.provider === 'google');
          const hasEmail = providers.includes('email') || identities.some((i: any) => i.provider === 'email');
          if (hasGoogle && !hasEmail) {
            setAuthProvider('google');
          } else {
            setAuthProvider('email');
          }
        }
      } catch (err) {
        console.warn('Could not determine auth provider:', err);
      }
    }
    checkProvider();
  }, [user]);

  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.profile?.full_name || '',
        email: user.user?.email || '',
        role: user.profile?.role || prev.role,
        avgProjectValue: user.profile?.avg_project_value || prev.avgProjectValue,
      }));
      setNotifications({
        followUpReminders: user.profile?.notify_followup_reminders ?? true,
        proposalUpdates: user.profile?.notify_proposal_updates ?? true,
        leadActivity: user.profile?.notify_lead_activity ?? true,
        weeklyDigest: user.profile?.notify_weekly_digest ?? false,
      });
      setBusinessSettings({
        followUpInterval: user.profile?.default_followup_interval_days ?? 3,
        riskThreshold: user.profile?.risk_alert_threshold_days ?? 5,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) {
      toast.error('Name is required');
      return;
    }
    const success = await updateProfile({
      full_name: profile.name.trim(),
      role: profile.role,
      avg_project_value: profile.avgProjectValue,
    });
    toast[success ? 'success' : 'error'](success ? 'Profile updated.' : profileError || 'Could not update profile.');
  };

  const handleSaveNotifications = async () => {
    const success = await updateProfile({
      notify_followup_reminders: notifications.followUpReminders,
      notify_proposal_updates: notifications.proposalUpdates,
      notify_lead_activity: notifications.leadActivity,
      notify_weekly_digest: notifications.weeklyDigest,
    });
    toast[success ? 'success' : 'error'](
      success ? 'Notification preferences saved.' : profileError || 'Could not save notifications.'
    );
  };

  const handleSaveBusinessSettings = async () => {
    const success = await updateProfile({
      default_followup_interval_days: businessSettings.followUpInterval,
      risk_alert_threshold_days: businessSettings.riskThreshold,
    });
    toast[success ? 'success' : 'error'](
      success ? 'Pipeline settings saved.' : profileError || 'Could not save settings.'
    );
  };

  const handleStartPasswordUpdate = () => {
    setPasswordStep('enter_current');
    setCurrentPassword('');
    setPasswordForm({ next: '', confirm: '' });
  };

  const handleVerifyCurrentPassword = async () => {
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (!user?.user?.email) return;
    setVerifyingCurrent(true);
    const res = await authService.verifyCurrentPassword(user.user.email, currentPassword);
    setVerifyingCurrent(false);
    if (res.error) {
      toast.error(res.error.message || 'Incorrect current password.');
    } else {
      setPasswordStep('enter_new');
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.user?.email) return;
    setSendingReset(true);
    const res = await authService.sendPasswordResetEmail(user.user.email);
    setSendingReset(false);
    if (res.error) {
      toast.error(res.error.message || 'Failed to send password reset email.');
    } else {
      setPasswordStep('reset_sent');
      toast.success('Password reset link sent to your email.');
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.next || passwordForm.next.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setChangingPassword(true);
    const result = await authService.changePassword(passwordForm.next);
    setChangingPassword(false);
    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success('Password updated successfully.');
      setPasswordForm({ next: '', confirm: '' });
      setCurrentPassword('');
      setPasswordStep('idle');
    }
  };

  const handleExport = async (kind: 'leads' | 'clients' | 'proposals') => {
    if (!user) return;
    setExporting(kind);
    try {
      const result =
        kind === 'leads'
          ? await leadService.getAllLeads(user.user.id, {})
          : kind === 'clients'
          ? await clientService.getAllClients(user.user.id)
          : await proposalService.getAllProposals(user.user.id);

      if (result.error || !result.data) {
        toast.error(result.error?.message || `Couldn’t export ${kind}.`);
        return;
      }
      if (result.data.length === 0) {
        toast.info(`No ${kind} to export yet.`);
        return;
      }
      downloadCsv(`soloos-${kind}-${new Date().toISOString().slice(0, 10)}.csv`, result.data as any[]);
      toast.success(`${kind[0].toUpperCase()}${kind.slice(1)} exported.`);
    } finally {
      setExporting(null);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const result = await authService.requestAccountDeletion(user.user.id);
    toast.info(result.error?.message || 'Request received.');
  };

  const handleManageBilling = async () => {
    if (!user) return;
    const provider = getDefaultProvider();
    const result = await getProvider(provider).openBillingPortal(user.user.id);
    if (result.error) toast.info(result.error);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto bg-bg text-text-primary min-h-[calc(100vh-3.5rem)] pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Manage your account, notifications, and workspace capacity.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => navigate(`/app/settings/${v}`)}>
        <TabsList className="mb-6 flex-wrap h-auto bg-surface border border-border p-1 rounded-xl">
          <TabsTrigger value="profile" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-elevated data-[state=active]:text-text-primary">
            <UserIcon className="w-3.5 h-3.5" />Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-elevated data-[state=active]:text-text-primary">
            <Bell className="w-3.5 h-3.5" />Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-elevated data-[state=active]:text-text-primary">
            <CreditCard className="w-3.5 h-3.5" />Usage &amp; plan
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-elevated data-[state=active]:text-text-primary">
            <ShieldCheck className="w-3.5 h-3.5" />Security
          </TabsTrigger>
          <TabsTrigger value="export" className="gap-1.5 text-xs font-semibold data-[state=active]:bg-elevated data-[state=active]:text-text-primary">
            <Download className="w-3.5 h-3.5" />Data export
          </TabsTrigger>
          <TabsTrigger value="danger" className="gap-1.5 text-xs font-semibold text-danger data-[state=active]:bg-danger-tint">
            <AlertTriangle className="w-3.5 h-3.5" />Danger zone
          </TabsTrigger>
        </TabsList>

        {/* PROFILE */}
        <TabsContent value="profile" className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <UserIcon className="w-5 h-5 text-green" />
              <h2 className="text-base font-semibold text-text-primary">Your profile</h2>
            </div>
            <div className="grid gap-4 max-w-md">
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Full name</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1.5 bg-elevated border-border text-text-primary text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Email</Label>
                <Input value={profile.email} disabled className="mt-1.5 bg-elevated border-border text-text-secondary opacity-60 text-xs" />
              </div>
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Role</Label>
                <Input
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="mt-1.5 bg-elevated border-border text-text-primary text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Typical project value ($)</Label>
                <Input
                  type="number"
                  value={profile.avgProjectValue}
                  onChange={(e) => setProfile({ ...profile, avgProjectValue: parseInt(e.target.value) || 0 })}
                  className="mt-1.5 font-mono bg-elevated border-border text-text-primary text-xs"
                />
                <p className="text-[11px] text-text-secondary mt-1">Used to calibrate pricing suggestions.</p>
              </div>
              <Button
                onClick={handleSaveProfile}
                disabled={loading}
                className="w-fit mt-2 bg-green hover:bg-green-hover text-white text-xs font-semibold h-9 px-4 transition-colors"
              >
                {loading ? 'Saving…' : 'Save profile'}
              </Button>
            </div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="w-5 h-5 text-green" />
              <h2 className="text-base font-semibold text-text-primary">Pipeline calibration</h2>
            </div>
            <div className="grid gap-4 max-w-md">
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Default follow-up interval (days)</Label>
                <Input
                  type="number"
                  value={businessSettings.followUpInterval}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, followUpInterval: parseInt(e.target.value) || 0 })}
                  className="mt-1.5 font-mono bg-elevated border-border text-text-primary text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-text-secondary">Risk alert threshold (days)</Label>
                <Input
                  type="number"
                  value={businessSettings.riskThreshold}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, riskThreshold: parseInt(e.target.value) || 0 })}
                  className="mt-1.5 font-mono bg-elevated border-border text-text-primary text-xs"
                />
                <p className="text-[11px] text-text-secondary mt-1">
                  Leads with no update past this window get flagged at-risk in your pipeline.
                </p>
              </div>
              <Button
                onClick={handleSaveBusinessSettings}
                disabled={loading}
                className="w-fit mt-2 bg-green hover:bg-green-hover text-white text-xs font-semibold h-9 px-4 transition-colors"
              >
                {loading ? 'Saving…' : 'Save calibration'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications">
          <div className="bg-surface p-6 rounded-xl border border-border max-w-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-green" />
              <h2 className="text-base font-semibold text-text-primary">Notification preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'followUpReminders' as const, label: 'Follow-up reminders', desc: 'When a follow-up is due today.' },
                { key: 'proposalUpdates' as const, label: 'Proposal updates', desc: 'When a proposal is accepted, rejected, or overdue.' },
                { key: 'leadActivity' as const, label: 'Lead activity', desc: 'When a lead moves stage or goes cold.' },
                { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'A Monday-morning summary of your pipeline.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-xs font-medium text-text-primary">{item.label}</p>
                    <p className="text-[11px] text-text-secondary">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, [item.key]: checked })}
                  />
                </div>
              ))}
              <Button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="w-fit mt-2 bg-green hover:bg-green-hover text-white text-xs font-semibold h-9 px-4 transition-colors"
              >
                {loading ? 'Saving…' : 'Save preferences'}
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* BILLING & USAGE */}
        <TabsContent value="billing" className="space-y-6">
          {/* Current plan banner */}
          <div className="bg-surface p-6 rounded-xl border border-border flex items-center justify-between flex-wrap gap-4 shadow-sm">
            <div>
              <p className="text-xs text-text-secondary mb-1">Current plan</p>
              <div className="flex items-center gap-2">
                <PlanBadge planId={entitlements.planId} />
                {entitlements.renewsAt && (
                  <span className="text-xs text-text-secondary font-mono">
                    renews {new Date(entitlements.renewsAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            {entitlements.planId !== 'free' && (
              <Button
                variant="outline"
                onClick={handleManageBilling}
                className="bg-surface border-border text-text-primary hover:bg-elevated text-xs font-semibold h-9"
              >
                Manage billing
              </Button>
            )}
          </div>

          {/* Usage & Capacity Card */}
          <div className="bg-surface p-6 rounded-xl border border-border shadow-sm space-y-5">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-green" />
              <h2 className="text-sm font-bold text-text-primary">Workspace Capacity &amp; Usage</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Active Leads bar */}
              <div className="p-4 bg-elevated rounded-xl border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-text-primary">Active Leads</span>
                  <span className="font-mono text-text-secondary">
                    {isFree ? `${activeLeadsCount} / 5` : `${activeLeadsCount} (Unlimited)`}
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFree && activeLeadsCount >= 5 ? 'bg-ember' : 'bg-green'
                    }`}
                    style={{ width: isFree ? `${Math.min(100, (activeLeadsCount / 5) * 100)}%` : '15%' }}
                  />
                </div>
                <p className="text-[10.5px] text-text-secondary">
                  Won and Lost opportunities don't count toward active cap.
                </p>
              </div>

              {/* Active Clients bar */}
              <div className="p-4 bg-elevated rounded-xl border border-border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-text-primary">Active Clients</span>
                  <span className="font-mono text-text-secondary">
                    {isFree ? `${activeClientsCount} / 2` : `${activeClientsCount} (Unlimited)`}
                  </span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isFree && activeClientsCount >= 2 ? 'bg-ember' : 'bg-green'
                    }`}
                    style={{ width: isFree ? `${Math.min(100, (activeClientsCount / 2) * 100)}%` : '15%' }}
                  />
                </div>
                <p className="text-[10.5px] text-text-secondary">
                  Paused and churned clients do not count toward active cap.
                </p>
              </div>
            </div>
          </div>

          <PlanCards
            currentPlanId={entitlements.planId}
            userId={user?.user?.id}
            userEmail={user?.user?.email}
            context="settings"
          />
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-6">
          {authProvider === 'google' ? (
            <div className="bg-surface p-6 rounded-xl border border-border shadow-sm max-w-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-green" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Google Sign-In Account</h3>
                  <p className="text-xs text-text-secondary">Signed in as {user?.user?.email}</p>
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Your account was authenticated using Google Sign-In. Passwords, two-step verification, and login security credentials are managed directly in your Google Account.
              </p>
              <Button
                type="button"
                variant="outline"
                className="text-xs font-semibold h-8 gap-2 bg-elevated border-border text-text-primary hover:bg-surface"
                onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
              >
                <span>Manage Google Account Security</span>
                <ExternalLink className="w-3.5 h-3.5 text-text-secondary" />
              </Button>
            </div>
          ) : (
            <div className="bg-surface p-6 rounded-xl border border-border max-w-xl shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-tint text-green flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-text-primary">Account Password</h2>
                  <p className="text-xs text-text-secondary">Signed in as {user?.user?.email}</p>
                </div>
              </div>

              {passwordStep === 'idle' && (
                <div className="space-y-4 pt-1">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Protect your pipeline and client records with a secure password. We recommend at least 8 characters with letters, numbers, and symbols.
                  </p>
                  <Button
                    onClick={handleStartPasswordUpdate}
                    className="bg-green hover:bg-green-hover text-white text-xs font-semibold h-8 px-4 transition-colors"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Update password</span>
                  </Button>
                </div>
              )}

              {passwordStep === 'enter_current' && (
                <div className="space-y-4 pt-1">
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Please confirm your current password to continue.
                  </p>
                  <div>
                    <Label className="text-xs font-semibold text-text-secondary">Current password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="bg-elevated border-border text-text-primary text-xs pr-9"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={sendingReset}
                      className="text-xs text-green hover:underline cursor-pointer font-medium disabled:opacity-50"
                    >
                      {sendingReset ? 'Sending reset link…' : 'Forgot password?'}
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPasswordStep('idle');
                        setCurrentPassword('');
                      }}
                      className="text-xs font-semibold h-8 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleVerifyCurrentPassword}
                      disabled={verifyingCurrent || !currentPassword}
                      className="bg-green hover:bg-green-hover text-white text-xs font-semibold h-8 px-4 transition-colors"
                    >
                      {verifyingCurrent ? 'Verifying…' : 'Verify & continue'}
                    </Button>
                  </div>
                </div>
              )}

              {passwordStep === 'enter_new' && (
                <div className="space-y-4 pt-1">
                  <div className="p-3 bg-green-tint/60 border border-green/30 rounded-lg text-xs text-green flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Identity confirmed. Enter your new password below.</span>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-text-secondary">New password (min 8 characters)</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.next}
                        onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                        placeholder="New password"
                        className="bg-elevated border-border text-text-primary text-xs pr-9"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-text-secondary">Confirm new password</Label>
                    <div className="relative mt-1.5">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        placeholder="Confirm new password"
                        className="bg-elevated border-border text-text-primary text-xs pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPasswordStep('idle');
                        setPasswordForm({ next: '', confirm: '' });
                        setCurrentPassword('');
                      }}
                      className="text-xs font-semibold h-8 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleChangePassword}
                      disabled={changingPassword || !passwordForm.next || !passwordForm.confirm}
                      className="bg-green hover:bg-green-hover text-white text-xs font-semibold h-8 px-4 transition-colors"
                    >
                      {changingPassword ? 'Updating…' : 'Save new password'}
                    </Button>
                  </div>
                </div>
              )}

              {passwordStep === 'reset_sent' && (
                <div className="space-y-3 pt-1">
                  <div className="p-4 bg-elevated border border-border rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-green font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Password reset email dispatched</span>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      We sent a secure password reset link to <strong className="text-text-primary">{user?.user?.email}</strong>. Please check your inbox and spam folder.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPasswordStep('idle')}
                      className="text-xs font-semibold h-8 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                    >
                      Back to security
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleForgotPassword}
                      disabled={sendingReset}
                      className="text-xs font-semibold h-8 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                    >
                      {sendingReset ? 'Resending…' : 'Resend link'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Legal & Policies */}
          <div className="bg-surface p-6 rounded-xl border border-border max-w-xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-elevated border border-border flex items-center justify-center text-text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary">Legal &amp; Compliance</h2>
                <p className="text-xs text-text-secondary">Workspace policies and terms of service</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-4 bg-elevated border border-border rounded-xl flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Privacy Policy</h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    How SoloOS collects, stores, and safeguards your confidential pipeline and client records.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLegalModalType('privacy')}
                  className="w-fit text-xs font-semibold h-7 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                >
                  View Privacy Policy
                </Button>
              </div>

              <div className="p-4 bg-elevated border border-border rounded-xl flex flex-col justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Terms &amp; Conditions</h4>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    Workspace agreements, subscription terms, warranties, and platform acceptable use rules.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLegalModalType('terms')}
                  className="w-fit text-xs font-semibold h-7 px-3 bg-surface border-border text-text-primary hover:bg-elevated"
                >
                  View Terms &amp; Conditions
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* DATA EXPORT */}
        <TabsContent value="export">
          <div className="bg-surface p-6 rounded-xl border border-border max-w-md shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-5 h-5 text-green" />
              <h2 className="text-base font-semibold text-text-primary">Export your data</h2>
            </div>
            <p className="text-xs text-text-secondary mb-5 leading-relaxed">
              Download a CSV of any part of your workspace. Your data is yours — no plan requirement, no export fee.
            </p>
            <div className="space-y-2">
              {(['leads', 'clients', 'proposals'] as const).map((kind) => (
                <div key={kind} className="flex items-center justify-between p-3.5 bg-elevated border border-border rounded-xl">
                  <span className="text-xs font-semibold text-text-primary capitalize">{kind}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExport(kind)}
                    disabled={exporting === kind}
                    className="h-8 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated"
                  >
                    {exporting === kind ? 'Exporting…' : 'Export CSV'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* DANGER ZONE */}
        <TabsContent value="danger">
          <div className="bg-surface p-6 rounded-xl border border-danger/30 max-w-md shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h2 className="text-base font-semibold text-text-primary">Delete account</h2>
            </div>
            <p className="text-xs text-text-secondary mb-5 leading-relaxed">
              Permanently deletes your account and all pipeline data. This can’t be undone — export anything you want to keep first.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-danger hover:bg-danger/90 text-white text-xs font-semibold h-9 px-4">
                  Delete my account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-surface border border-border rounded-xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-text-primary">Delete your account?</AlertDialogTitle>
                  <AlertDialogDescription className="text-text-secondary text-xs">
                    This permanently removes your leads, clients, proposals, and follow-ups. This action can’t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-surface border-border text-text-primary hover:bg-elevated text-xs">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-danger hover:bg-danger/90 text-white text-xs font-semibold"
                  >
                    Delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </TabsContent>
      </Tabs>

      <LegalModal
        type={legalModalType}
        open={!!legalModalType}
        onOpenChange={(open) => !open && setLegalModalType(null)}
      />
    </div>
  );
}
