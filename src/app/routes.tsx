import { createBrowserRouter, Link } from "react-router";
import { PublicLayout } from "./layouts/PublicLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestOnlyRoute } from "./routes/GuestOnlyRoute";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";

// Protected app pages
import DashboardPage from "./pages/dashboard/DashboardPage";
import LeadsPage from "./pages/leads/LeadsPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import FollowUpsPage from "./pages/followups/FollowUpsPage";
import PricingPage from "./pages/pricing/PricingPage";
import ProposalsPage from "./pages/proposals/ProposalsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ClientsPage from "./pages/clients/ClientsPage";
import ClientDetailPage from "./pages/clients/ClientDetailPage";
import WeeklyDebriefPage from "./pages/debrief/WeeklyDebriefPage";

export const router = createBrowserRouter([
  // Public routes with PublicLayout
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/login",
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <GuestOnlyRoute>
            <SignupPage />
          </GuestOnlyRoute>
        ),
      },
    ],
  },
  // Onboarding (requires auth but not onboarding completion)
  {
    path: "/onboarding",
    element: <ProtectedRoute requireOnboarding={false}><OnboardingPage /></ProtectedRoute>,
  },
  // Protected app routes with DashboardLayout
  {
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: "/app", element: <DashboardPage /> },
      { path: "/app/debrief", element: <WeeklyDebriefPage /> },
      { path: "/app/leads", element: <LeadsPage /> },
      { path: "/app/leads/:id", element: <LeadDetailPage /> },
      { path: "/app/follow-ups", element: <FollowUpsPage /> },
      { path: "/app/pricing", element: <PricingPage /> },
      { path: "/app/proposals", element: <ProposalsPage /> },
      { path: "/app/settings", element: <SettingsPage /> },
      { path: "/app/settings/:tab", element: <SettingsPage /> },
      { path: "/app/clients", element: <ClientsPage /> },
      { path: "/app/clients/:id", element: <ClientDetailPage /> },
    ],
  },
  // 404 catch-all
  {
    path: "*",
    element: (
      <div className="flex items-center justify-center h-screen bg-bg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">404</h1>
          <p className="text-text-secondary mb-6">This page doesn't exist.</p>
          <Link
            to="/"
            className="inline-block bg-green text-white px-6 py-3 rounded-xl hover:bg-green-hover transition-colors font-medium text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    ),
  },
]);
