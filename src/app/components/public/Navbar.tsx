import { Link } from 'react-router';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import { SoloOSLogo } from '../soloos/SoloOSLogo';

export function Navbar() {
  const { user, logout } = useContext(AuthContext)!;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <SoloOSLogo variant="auto" height={28} />
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-text-secondary hover:text-text-primary font-medium transition-colors text-xs">
              Features
            </a>
            <a href="#how-it-works" className="text-text-secondary hover:text-text-primary font-medium transition-colors text-xs">
              How It Works
            </a>
            <a href="#pricing" className="text-text-secondary hover:text-text-primary font-medium transition-colors text-xs">
              Pricing
            </a>
            <a href="#faq" className="text-text-secondary hover:text-text-primary font-medium transition-colors text-xs">
              FAQ
            </a>
          </div>

          {/* Right Navigation - Auth Aware */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-text-secondary hover:text-text-primary font-medium transition-colors text-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-green hover:bg-green-hover text-white px-4 py-2 rounded-xl transition-colors font-semibold text-xs shadow-sm"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/app"
                  className="bg-green hover:bg-green-hover text-white px-4 py-2 rounded-xl transition-colors font-semibold text-xs shadow-sm"
                >
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="w-9 h-9 bg-green rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    {user.user?.email?.[0].toUpperCase()}
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface rounded-xl shadow-xl border border-border p-1 z-50">
                      <div className="p-3 border-b border-border">
                        <p className="text-xs font-semibold text-text-primary truncate">{user.user?.email}</p>
                        <p className="text-[11px] text-text-secondary">{user.profile?.role || 'Solo Operator'}</p>
                      </div>
                      <Link
                        to="/app/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="block px-3 py-2 text-xs text-text-primary hover:bg-elevated rounded-lg"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger-tint rounded-lg cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary p-1"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 mt-3 space-y-2">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg text-xs"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg text-xs"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg text-xs"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg text-xs"
            >
              FAQ
            </a>
            {!user ? (
              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-text-secondary hover:bg-elevated hover:text-text-primary rounded-lg text-xs text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-green hover:bg-green-hover text-white rounded-xl text-center font-semibold text-xs shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="pt-2">
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 bg-green hover:bg-green-hover text-white rounded-xl text-center font-semibold text-xs shadow-sm"
                >
                  Dashboard
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
