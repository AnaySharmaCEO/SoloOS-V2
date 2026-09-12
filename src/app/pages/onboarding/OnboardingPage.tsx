import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    businessStage: '',
    blocker: '',
    avgProjectValue: 0,
  });
  const { completeOnboarding } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const roles = [
    'Copywriter',
    'Marketer',
    'Consultant',
    'Media Buyer',
    'Email Marketer',
  ];

  const businessStages = [
    'No clients yet',
    'First few clients',
    'Stable monthly clients',
    'Scaling systems',
  ];

  const blockers = [
    'Forgetting follow-ups',
    'Pricing confusion',
    'Proposal delays',
    'Inconsistent leads',
    'Client retention',
  ];

  const handleNext = async () => {
    setError('');
    
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const success = await completeOnboarding({
          full_name: formData.fullName.trim(),
          role: formData.role,
          business_stage: formData.businessStage,
          blocker: formData.blocker,
          avg_project_value: formData.avgProjectValue,
        });

        if (success) {
          setTimeout(() => {
            navigate('/app');
          }, 100);
        } else {
          setError('Failed to complete setup. Please try again.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim() !== '';
      case 2:
        return formData.role !== '';
      case 3:
        return formData.businessStage !== '';
      case 4:
        return formData.blocker !== '';
      case 5:
        return formData.avgProjectValue > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-md shadow-2xs p-8 w-full max-w-xl space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs font-semibold transition-all ${
                  i <= step ? 'bg-ledger text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                {i < step ? <CheckCircle2 className="w-4 h-4 text-white" /> : i}
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-ledger transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Full Name */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your full name?</h2>
              <p className="text-xs text-muted-foreground mt-1">Calibrates your workspace signature and client-facing estimates.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-md text-foreground outline-none focus:ring-1 focus:ring-ledger text-sm"
                placeholder="e.g. Jane Doe"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your primary discipline?</h2>
              <p className="text-xs text-muted-foreground mt-1">Tailors pricing advisor baselines and follow-up templates for your work.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  className={`p-3.5 rounded-md border text-left transition-all cursor-pointer flex justify-between items-center text-xs ${
                    formData.role === role
                      ? 'border-ledger bg-ledger-tint/50 text-foreground font-semibold shadow-2xs'
                      : 'border-border hover:border-line-strong bg-card text-foreground font-medium'
                  }`}
                >
                  <span>{role}</span>
                  {formData.role === role && <CheckCircle2 className="w-4 h-4 text-ledger" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Business Stage */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your current business stage?</h2>
              <p className="text-xs text-muted-foreground mt-1">Helps structure pipeline priorities for your opportunity volume.</p>
            </div>
            <div className="space-y-2.5">
              {businessStages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => setFormData({ ...formData, businessStage: stage })}
                  className={`w-full p-3.5 rounded-md border text-left transition-all cursor-pointer flex justify-between items-center text-xs ${
                    formData.businessStage === stage
                      ? 'border-ledger bg-ledger-tint/50 text-foreground font-semibold shadow-2xs'
                      : 'border-border hover:border-line-strong bg-card text-foreground font-medium'
                  }`}
                >
                  <span>{stage}</span>
                  {formData.businessStage === stage && <CheckCircle2 className="w-4 h-4 text-ledger" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Primary Blocker */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">What is your biggest sales bottleneck?</h2>
              <p className="text-xs text-muted-foreground mt-1">We prioritize daily dashboard priority items around this focus area.</p>
            </div>
            <div className="space-y-2.5">
              {blockers.map((blocker) => (
                <button
                  key={blocker}
                  type="button"
                  onClick={() => setFormData({ ...formData, blocker })}
                  className={`w-full p-3.5 rounded-md border text-left transition-all cursor-pointer flex justify-between items-center text-xs ${
                    formData.blocker === blocker
                      ? 'border-ledger bg-ledger-tint/50 text-foreground font-semibold shadow-2xs'
                      : 'border-border hover:border-line-strong bg-card text-foreground font-medium'
                  }`}
                >
                  <span>{blocker}</span>
                  {formData.blocker === blocker && <CheckCircle2 className="w-4 h-4 text-ledger" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Average Deal Size */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Average project or deal size?</h2>
              <p className="text-xs text-muted-foreground mt-1">Sets baseline parameters for your strategic pricing model.</p>
            </div>
            <div className="space-y-3">
              <input
                type="number"
                value={formData.avgProjectValue || ''}
                onChange={(e) =>
                  setFormData({ ...formData, avgProjectValue: parseInt(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2.5 bg-input-background border border-border rounded-md text-foreground outline-none focus:ring-1 focus:ring-ledger text-base font-mono font-bold"
                placeholder="2500"
              />
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2500, 5000, 10000, 15000, 25000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, avgProjectValue: value })}
                    className="px-3 py-2 border border-border rounded-md hover:bg-muted text-xs font-mono font-semibold transition-colors text-foreground"
                  >
                    ${value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-brick-tint border border-brick/40 text-brick-ink px-3.5 py-2 rounded-md text-xs font-medium">
            {error}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || isSubmitting}
            className="h-9 text-xs font-semibold disabled:opacity-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            disabled={!isStepComplete() || isSubmitting}
            className="h-9 text-xs font-semibold bg-ledger hover:bg-ledger-dark text-white flex items-center gap-1"
          >
            <span>{isSubmitting ? 'Configuring workspace...' : step === 5 ? 'Complete Setup' : 'Continue'}</span>
            {step < 5 && <ArrowRight className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
