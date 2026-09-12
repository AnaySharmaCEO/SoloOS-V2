import { Link } from 'react-router';

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLegal = (page: string) => {
    alert(`${page} page is coming soon. Contact ascendancyhq.co@proton.me for questions.`);
  };

  return (
    <footer className="bg-sidebar text-sidebar-foreground/80 border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sidebar-foreground text-xl font-bold mb-4">SoloOS</h3>
            <p className="text-sm text-sidebar-foreground/60">
              The revenue operating system built for solo freelancers who want to get paid faster.
            </p>
          </div>

          <div>
            <h4 className="text-sidebar-foreground font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
                >
                  Features
                </button>
              </li>
              <li>
                <Link to="/login" className="hover:text-sidebar-foreground transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sidebar-foreground font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <a
                  href="mailto:ascendancyhq.co@proton.me"
                  className="hover:text-sidebar-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="mailto:ascendancyhq.co@proton.me"
                  className="hover:text-sidebar-foreground transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sidebar-foreground font-semibold mb-4 text-sm">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('Privacy Policy')}
                  className="hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openLegal('Terms of Service')}
                  className="hover:text-sidebar-foreground transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-sidebar-foreground/50">
          <p>&copy; {new Date().getFullYear()} SoloOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
