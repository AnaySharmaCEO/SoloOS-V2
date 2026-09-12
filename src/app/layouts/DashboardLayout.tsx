import { Outlet, Link, useLocation, Navigate } from 'react-router';
import {
  LayoutDashboard,
  Users,
  BellRing,
  Calculator,
  FileText,
  Briefcase,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import { useViewportGuard } from '../../hooks/useViewportGuard';
import { ViewportRestrictionModal } from '../components/ui/ViewportRestrictionModal';
import { useEntitlements } from '../../hooks/useEntitlements';
import { PlanBadge } from '../components/soloos/PlanBadge';
import { NotificationBell } from '../components/soloos/NotificationBell';
import { ThemeToggle } from '../components/soloos/ThemeToggle';
import { SoloOSLogo } from '../components/soloos/SoloOSLogo';

const allNavigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Debrief', href: '/app/debrief', icon: Sparkles, proOnly: true },
  { name: 'Leads', href: '/app/leads', icon: Users },
  { name: 'Follow-Ups', href: '/app/follow-ups', icon: BellRing },
  { name: 'Pricing', href: '/app/pricing', icon: Calculator },
  { name: 'Proposals', href: '/app/proposals', icon: FileText },
  { name: 'Clients', href: '/app/clients', icon: Briefcase },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout, loading } = useContext(AuthContext)!;
  const isViewportUnsupported = useViewportGuard();
  const { entitlements, canUse } = useEntitlements();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  if (loading) {
    return null;
  }

  if (!user || !user.profile?.onboarding_complete) {
    return <Navigate to="/onboarding" replace />;
  }

  const initial = user?.user?.email?.[0].toUpperCase() ?? '?';

  // Filter navigation: absence over padlock for Free users
  const navigation = allNavigation.filter(
    (item) => !item.proOnly || entitlements.planId === 'pro' || canUse('revenue_debrief')
  );

  const MOBILE_PRIMARY = navigation.slice(0, 4);

  const profileMenuBody = (
    <>
      <DropdownMenuLabel className="px-2.5 py-2 text-xs font-medium text-text-secondary">
        Signed in as
        <div className="text-sm font-semibold text-text-primary truncate mt-0.5">{user?.user?.email}</div>
        <div className="mt-2">
          <PlanBadge planId={entitlements.planId} />
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <div className="px-2.5 py-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold text-text-secondary">Theme</span>
        <ThemeToggle variant="buttons" />
      </div>

      <DropdownMenuSeparator />

      {entitlements.planId === 'free' && (
        <DropdownMenuItem asChild>
          <Link
            to="/app/settings/billing"
            className="flex items-center gap-2 px-2.5 py-2 text-xs text-green hover:bg-green-tint rounded-lg cursor-pointer font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Upgrade to Pro ($30/mo)</span>
          </Link>
        </DropdownMenuItem>
      )}

      <DropdownMenuItem asChild>
        <Link
          to="/app/settings"
          className="flex items-center gap-2 px-2.5 py-2 text-xs text-text-primary hover:text-green rounded-lg cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link
          to="/app/settings/billing"
          className="flex items-center gap-2 px-2.5 py-2 text-xs text-text-primary hover:text-green rounded-lg cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Usage &amp; plan</span>
        </Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        onClick={logout}
        className="flex items-center gap-2 px-2.5 py-2 text-xs text-danger hover:bg-danger-tint rounded-lg cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Log out</span>
      </DropdownMenuItem>
    </>
  );

  const profileDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full text-left focus:outline-none focus:ring-0 cursor-pointer">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="w-10 h-10 mx-auto bg-green rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-green/40 transition-all shadow-sm">
                  <span className="text-xs font-bold text-white select-none">{initial}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-surface text-text-primary border border-border text-xs px-2.5 py-1.5 font-medium">
                Account
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="border border-border/40 hover:border-border bg-surface/50 hover:bg-surface dark:bg-surface/20 dark:hover:bg-surface/60 rounded-xl p-3 cursor-pointer transition-all flex items-center gap-3">
              <div className="w-8 h-8 bg-green rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-xs font-bold text-white select-none">{initial}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.user?.email}</p>
                <p className="text-[10px] text-sidebar-foreground/60">{user?.profile?.role || 'Solo Operator'}</p>
              </div>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={isCollapsed ? 'right' : 'top'}
        align={isCollapsed ? 'end' : 'center'}
        className="w-64 p-1 rounded-xl z-[100] bg-surface border border-border text-text-primary shadow-xl"
      >
        {profileMenuBody}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-bg text-text-primary overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className={`hidden md:flex bg-sidebar text-sidebar-foreground flex-col flex-shrink-0 h-full transition-all duration-200 ease-in-out relative z-30 ${
            isCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <div
            className={`p-4 py-5 border-b border-sidebar-border flex items-center ${
              isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between'
            } transition-all`}
          >
            <div className="flex items-center min-w-0">
              {isCollapsed ? (
                <SoloOSLogo showText={false} height={28} />
              ) : (
                <SoloOSLogo variant="auto" height={28} subtitle="Sales workspace" />
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-surface dark:hover:bg-elevated transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              const linkContent = (
                <Link
                  to={item.href}
                  className={`flex items-center rounded-xl transition-all ${
                    isCollapsed ? 'justify-center w-12 h-12 p-0' : 'gap-3 px-3 py-2.5 text-xs'
                  } ${
                    isActive
                      ? 'bg-green text-white font-semibold shadow-sm'
                      : 'text-sidebar-foreground/75 hover:bg-surface dark:hover:bg-elevated hover:text-sidebar-foreground font-medium'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="bg-surface text-text-primary border border-border text-xs px-2.5 py-1.5 font-medium">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return <div key={item.name}>{linkContent}</div>;
            })}
          </nav>

          <div className={`p-3 border-t border-sidebar-border flex flex-col gap-1 ${isCollapsed ? 'items-center' : ''}`}>
            {profileDropdown}
          </div>
        </aside>

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-sidebar text-sidebar-foreground flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="flex items-center">
            <SoloOSLogo variant="auto" height={24} />
          </div>
          <div className="flex items-center gap-1.5">
            <NotificationBell variant="light" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 bg-green rounded-full flex items-center justify-center cursor-pointer">
                  <span className="text-xs font-bold text-white">{initial}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1 rounded-xl bg-surface border border-border text-text-primary shadow-xl">
                {profileMenuBody}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-bg relative z-10 pt-14 md:pt-0 pb-16 md:pb-0 flex flex-col">
          <div className="hidden md:flex items-center justify-end gap-3 h-12 px-6 border-b border-border bg-surface flex-shrink-0">
            <ThemeToggle variant="buttons" />
            <NotificationBell />
          </div>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-sidebar border-t border-sidebar-border flex items-stretch">
          {MOBILE_PRIMARY.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                  isActive ? 'text-green font-semibold' : 'text-sidebar-foreground/60'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button className="flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium text-sidebar-foreground/60 cursor-pointer">
                <Menu className="w-5 h-5" />
                More
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8 bg-surface border-border text-text-primary">
              <nav className="grid grid-cols-3 gap-2.5 pt-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border py-4 text-xs font-medium text-text-primary hover:bg-elevated"
                    >
                      <Icon className="w-5 h-5 text-green" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
      {isViewportUnsupported && <ViewportRestrictionModal />}
    </TooltipProvider>
  );
}
