import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ShieldCheck, FileText } from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms';

interface LegalModalProps {
  type: LegalDocType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegalModal({ type, open, onOpenChange }: LegalModalProps) {
  if (!type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col bg-surface border-border text-text-primary p-0 gap-0 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-tint text-green flex items-center justify-center flex-shrink-0">
              {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-text-primary">
                {isPrivacy ? 'SoloOS Privacy Policy' : 'SoloOS Terms & Conditions'}
              </DialogTitle>
              <DialogDescription className="text-xs text-text-secondary mt-0.5">
                Last updated: September 2026 &bull; Workspace operational agreement
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Scrollable Mockup Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5 text-xs text-text-secondary leading-relaxed font-sans">
          {isPrivacy ? (
            <>
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">1. Overview and Commitment to Privacy</h4>
                <p>
                  SoloOS ("we," "us," or "our") respects the privacy of our users and is deeply committed to protecting the confidential business, contact, and client data you manage within your SoloOS workspace. This Privacy Policy outlines our standards and protocols regarding the collection, storage, use, and protection of information when you access or use our applications, APIs, and associated web services.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">2. Information We Collect</h4>
                <p className="mb-2">
                  To power your revenue operations, SoloOS collects the following categories of information:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>Account Information:</strong> Name, business email address, workspace profile settings, and authentication identifiers provided during registration or Google OAuth authorization.</li>
                  <li><strong>Workspace &amp; Pipeline Data:</strong> Lead records, deal stages, estimated contract values, client profiles, communication logs, message templates, follow-up cadence dates, and proposal notes entered by you into your tenant.</li>
                  <li><strong>Billing Information:</strong> Payment method identifiers and transaction logs processed securely via authorized third-party billing providers (e.g. Stripe/Dodo). SoloOS does not directly store complete credit card numbers.</li>
                  <li><strong>Technical Telemetry:</strong> Log timestamps, browser client signatures, IP addresses, and diagnostic events collected to ensure system security and high availability.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">3. How We Use Your Data</h4>
                <p className="mb-2">
                  Your pipeline data is strictly your property. We only process your data to:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Deliver, operate, and maintain SoloOS features, including revenue debriefs, lead stage tracking, automated follow-up calculations, and proposal generation.</li>
                  <li>Verify account access, prevent unauthorized intrusions, and preserve workspace tenant isolation under Row-Level Security (RLS).</li>
                  <li>Deliver transaction confirmations, password resets, security notifications, and critical operational updates.</li>
                  <li>Provide customer support when explicitly requested by you.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">4. Data Isolation &amp; Zero Data Brokering</h4>
                <p>
                  SoloOS does NOT sell, rent, monetize, or broker your personal information, client lists, or commercial pipeline figures to any third party or advertiser. We do not use your proprietary business leads or client interactions to train shared public machine learning models.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">5. Data Retention &amp; Export</h4>
                <p>
                  You retain complete ownership of your data. You may at any time export full CSV archives of your leads, clients, and proposals directly from your Account Settings. If you request account closure or data deletion, your workspace records will be scheduled for permanent purging across our active and replica databases in compliance with applicable statutory timelines.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">6. Security Safeguards</h4>
                <p>
                  We implement industry-standard administrative, technical, and physical safeguards designed to shield your workspace from unauthorized access, loss, or alteration. All in-transit network traffic is encrypted using TLS 1.3, and underlying database volumes employ AES-256 encryption at rest.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">7. Contact Information</h4>
                <p>
                  For privacy questions, data requests, or compliance inquiries, please contact our privacy compliance desk directly at <span className="font-mono text-text-primary">ascendancyhq.co@proton.me</span>.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">1. Acceptance of Terms</h4>
                <p>
                  By registering an account, accessing, or utilizing the SoloOS software platform ("SoloOS" or the "Service"), you agree to be legally bound by these Terms and Conditions ("Terms"). If you do not agree to these terms in their entirety, you must not access or use the Service.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">2. Eligibility &amp; Account Responsibility</h4>
                <p>
                  The Service is tailored for independent professionals, consultants, agency operators, and solo entrepreneurs. You must be at least 18 years of age to establish an account. You are solely responsible for maintaining the strict confidentiality of your authentication credentials, multi-factor keys, and for all actions executed through your workspace.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">3. Subscription Tiers, Billing &amp; Fair Use</h4>
                <p className="mb-2">
                  SoloOS operates under structured plan tiers:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>SoloOS Free:</strong> Available with capacity thresholds (e.g. up to 5 active leads, 2 active clients, and standard message templates). Unlimited won/lost archival history is preserved.</li>
                  <li><strong>SoloOS Pro ($30/month):</strong> Provides unmetered active leads, unlimited active clients, comprehensive Revenue Debrief analytics, proposal generation tools, and priority processing.</li>
                  <li><strong>Billing Terms:</strong> Subscriptions are billed in advance on a recurring monthly or annual cadence. You may cancel your subscription at any time; your Pro entitlements remain active until the end of your prepaid billing period.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">4. Acceptable Conduct &amp; Prohibited Uses</h4>
                <p className="mb-2">
                  You agree to use SoloOS solely for legitimate, lawful sales and pipeline management operations. You shall not:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Deploy SoloOS to send unsolicited commercial bulk spam in violation of CAN-SPAM, GDPR, or CASL regulations.</li>
                  <li>Reverse engineer, decompile, crawl, or attempt to extract source algorithms or proprietary UI components.</li>
                  <li>Attempt to bypass tenant isolation, security controls, or API rate limiting mechanisms.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">5. Intellectual Property &amp; Content Ownership</h4>
                <p>
                  You retain full, unencumbered intellectual property rights to all client information, deal terms, contract estimates, and business correspondence that you input into the Service. SoloOS and its licensors retain all right, title, and interest in and to the SoloOS interface, brand assets, design systems, algorithms, and documentation.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">6. Warranty Disclaimer &amp; Limitation of Liability</h4>
                <p>
                  The Service is provided on an "as is" and "as available" basis without express or implied warranties of any kind. SoloOS does not guarantee specific deal closure rates or revenue targets. To the maximum extent permitted under applicable law, SoloOS shall not be liable for indirect, incidental, special, or consequential damages resulting from downtime, lost revenue, or service disruptions.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-1.5">7. Modifications to Service and Terms</h4>
                <p>
                  We reserve the right to modify these Terms or platform capabilities as our product evolves. Material amendments to subscription rates or service terms will be communicated via your registered account email at least thirty (30) days prior to taking effect.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-surface flex justify-end">
          <Button
            size="sm"
            onClick={() => onOpenChange(false)}
            className="bg-green hover:bg-green-hover text-white text-xs font-semibold px-4 h-8 transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
