import { useState } from 'react';
import { useLocation } from 'react-router';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePricing } from '../../../hooks/usePricing';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

export default function PricingPage() {
  const { user } = useAuth();
  const location = useLocation();
  const leadId = (location.state as { leadId?: string } | null)?.leadId;
  const userId = user?.user?.id;
  const { calculate, saveEstimate, saving } = usePricing(userId);
  const { entitlements, canUse } = useEntitlements();
  const isPro = canUse('personalized_pricing') || entitlements.planId === 'pro';

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: '',
    deliverables: '',
    scope: '',
    urgency: '',
    impact: '',
    model: '',
  });

  const [showResults, setShowResults] = useState(false);

  const serviceTypes = [
    { value: 'Copywriting', impact: 1.0 },
    { value: 'Content Strategy', impact: 1.2 },
    { value: 'Email Marketing', impact: 1.1 },
    { value: 'Social Media Management', impact: 0.9 },
    { value: 'Consulting', impact: 1.4 },
    { value: 'Website Copy', impact: 1.1 },
  ];

  const scopes = [
    { value: 'Small', multiplier: 1, price: 1500, desc: 'Quick win, focused deliverable' },
    { value: 'Medium', multiplier: 2, price: 3000, desc: 'Standard project, multiple deliverables' },
    { value: 'Large', multiplier: 4, price: 6000, desc: 'Comprehensive engagement, major impact' },
    { value: 'Enterprise', multiplier: 8, price: 12000, desc: 'Large-scale strategic transformation' },
  ];

  const urgencies = [
    { value: 'Flexible (2+ weeks)', multiplier: 1.0, label: 'Standard timeline' },
    { value: 'Standard (1-2 weeks)', multiplier: 1.2, label: 'Moderate urgency' },
    { value: 'Rush (<1 week)', multiplier: 1.5, label: 'Premium rush timeline' },
  ];

  const impacts = [
    { value: 'Low', multiplier: 0.9 },
    { value: 'Medium', multiplier: 1.0 },
    { value: 'High', multiplier: 1.3 },
    { value: 'Critical', multiplier: 1.6 },
  ];

  const models = [
    { value: 'One-time project', description: 'Single deliverable, milestone payments' },
    { value: 'Monthly retainer', description: 'Ongoing monthly recurring work' },
    { value: 'Performance-based', description: 'Base fee plus results-driven bonuses' },
  ];

  const calculatePricing = () => {
    const result = calculate(formData);
    return {
      minPrice: result.minPrice,
      maxPrice: result.maxPrice,
      confidence: result.confidence,
      underpricingWarning: result.underpricingWarning,
      underpricingPercentage: result.underpricingPercentage,
      basePrice: result.basePrice,
    };
  };

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      const saved = await saveEstimate(formData, leadId);
      if (saved.error) {
        toast.error(saved.error);
      } else {
        toast.success('Pricing estimate saved to pipeline');
      }
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
      setCurrentStep(5);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.serviceType !== '';
      case 2: return formData.scope !== '';
      case 3: return formData.impact !== '';
      case 4: return formData.urgency !== '';
      case 5: return formData.model !== '';
      default: return false;
    }
  };

  const pricing = calculatePricing();

  const handleCopyPricing = async () => {
    const text = `$${pricing.minPrice.toLocaleString()} – $${pricing.maxPrice.toLocaleString()}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Pricing range copied to clipboard');
    } catch {
      toast.error(`Recommended range: ${text}`);
    }
  };

  const handleStartOver = () => {
    setShowResults(false);
    setCurrentStep(1);
    setFormData({
      serviceType: '',
      deliverables: '',
      scope: '',
      urgency: '',
      impact: '',
      model: '',
    });
  };

  if (showResults) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2 text-xs font-semibold text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to inputs
          </Button>

          {/* Result Header */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-tint text-green">
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Pricing Recommendation
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
              Recommended Range
            </h1>
            <p className="text-xs text-text-secondary max-w-md mx-auto">
              {isPro
                ? 'Calibrated against your last 6 accepted proposals and current pipeline history'
                : 'Based on general industry benchmarks — connect more proposals to sharpen this'}
            </p>
          </div>

          {/* Primary Range Display */}
          <div className="bg-surface border border-border rounded-xl p-8 md:p-10 shadow-sm text-center space-y-6">
            <div>
              <div className="font-mono text-3xl md:text-5xl font-bold text-green tracking-tight">
                ${pricing.minPrice.toLocaleString()} – ${pricing.maxPrice.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mt-2 font-medium">
                <CheckCircle className="w-4 h-4 text-green" />
                <span>{pricing.confidence}% baseline confidence score</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div>
                <div className="font-mono text-lg md:text-xl font-semibold text-text-primary">
                  ${pricing.minPrice.toLocaleString()}
                </div>
                <div className="text-[11.5px] text-text-secondary mt-0.5">Minimum Floor</div>
              </div>
              <div>
                <div className="font-mono text-lg md:text-xl font-bold text-green">
                  ${Math.floor(pricing.basePrice).toLocaleString()}
                </div>
                <div className="text-[11.5px] text-text-primary font-semibold mt-0.5">Recommended Target</div>
              </div>
              <div>
                <div className="font-mono text-lg md:text-xl font-semibold text-text-primary">
                  ${pricing.maxPrice.toLocaleString()}
                </div>
                <div className="text-[11.5px] text-text-secondary mt-0.5">Premium Tier</div>
              </div>
            </div>
          </div>

          {/* Underpricing Warning */}
          {pricing.underpricingWarning && (
            <div className="bg-ember-tint border border-ember/30 rounded-xl p-5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-ember font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-ember flex-shrink-0" />
                <span>Underpricing Warning</span>
              </div>
              <p className="text-text-primary leading-relaxed">
                You are potentially underpricing by ~<strong>{pricing.underpricingPercentage}%</strong> for this scope and impact level.
                Engagements of this complexity typically command <strong>${(pricing.maxPrice + 1000).toLocaleString()}–${(pricing.maxPrice + 3000).toLocaleString()}</strong>.
                Price for the strategic business value delivered rather than estimated hours spent.
              </p>
            </div>
          )}

          {/* Strategic Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface border border-border rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-xs text-text-primary">
                <TrendingUp className="w-4 h-4 text-green" />
                <span>Pricing Model Insight</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {formData.model === 'Monthly retainer'
                  ? `For a monthly retainer contract, divide by 12 months. Your target monthly billing rate is $${Math.floor(pricing.basePrice / 12).toLocaleString()}–$${Math.floor(pricing.maxPrice / 12).toLocaleString()}/mo.`
                  : formData.model === 'Performance-based'
                  ? `For performance pricing, require a base fee of $${Math.floor(pricing.minPrice * 0.6).toLocaleString()} up front plus milestone bonuses tied to outcomes.`
                  : `For one-time project engagements, require 50% upfront deposit upon contract signing and 50% prior to final delivery.`}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 font-semibold text-xs text-text-primary">
                <DollarSign className="w-4 h-4 text-text-secondary" />
                <span>Value Positioning</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {formData.impact === 'Critical' || formData.impact === 'High'
                  ? `High-impact deliverables justify top-tier rates. Frame your proposal around client revenue outcomes, ROI, and risk reduction.`
                  : `Standard business impact engagement. Emphasize quality execution, fast turnaround, and clear milestone deliverables.`}
              </p>
            </div>
          </div>

          {/* Effective Hourly Rate Sanity Check */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3 shadow-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green" /> Profit Sanity Check
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-secondary">Estimated hours:</span>
                <span className="ml-2 font-mono font-semibold text-text-primary">
                  {formData.scope === 'Small' ? '10-15 hrs' : formData.scope === 'Medium' ? '20-30 hrs' : formData.scope === 'Large' ? '40-60 hrs' : '80-120 hrs'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary">Effective hourly rate:</span>
                <span className="ml-2 font-mono font-bold text-green">
                  ${Math.floor(pricing.basePrice / (formData.scope === 'Small' ? 12.5 : formData.scope === 'Medium' ? 25 : formData.scope === 'Large' ? 50 : 100)).toLocaleString()}/hr
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              type="button"
              onClick={handleCopyPricing}
              className="h-9 px-4 text-xs font-semibold bg-green hover:bg-green-hover text-white flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Pricing Range</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleStartOver}
              className="h-9 px-4 text-xs font-semibold bg-surface border-border text-text-primary hover:bg-elevated flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start New Calculation</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-bg text-text-primary pb-16">
      {/* Header */}
      <div className="bg-surface border-b border-border px-4 md:px-8 py-6 mb-6">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-green-tint text-green">
            <Sparkles className="w-3.5 h-3.5" /> Strategic Pricing Advisor
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
            Stop Underpricing
          </h1>
          <p className="text-xs md:text-sm text-text-secondary">
            Value-based pricing guidance calculated for your scope and client impact.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-6">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-semibold text-xs transition-all ${
                    step <= currentStep
                      ? 'bg-green text-white'
                      : 'bg-elevated text-text-secondary border border-border'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`flex-1 h-0.5 mx-1.5 transition-all ${
                      step < currentStep ? 'bg-green' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-[11px] text-text-secondary text-center font-mono">
            Step {currentStep} of 5
          </div>
        </div>

        {/* Step Content Card */}
        <div className="bg-surface border border-border rounded-xl shadow-sm p-6 space-y-5">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">What service are you pricing?</h2>
                <p className="text-xs text-text-secondary mt-0.5">Select the primary service discipline for this engagement</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {serviceTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: type.value })}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                      formData.serviceType === type.value
                        ? 'border-green bg-green-tint text-green font-semibold shadow-xs'
                        : 'border-border hover:border-text-secondary/50 bg-elevated text-text-primary'
                    }`}
                  >
                    <span>{type.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">What is the project scope?</h2>
                <p className="text-xs text-text-secondary mt-0.5">Complexity and scale of deliverables</p>
              </div>
              <div className="space-y-2.5">
                {scopes.map((scope) => (
                  <button
                    key={scope.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, scope: scope.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                      formData.scope === scope.value
                        ? 'border-green bg-green-tint text-text-primary shadow-xs'
                        : 'border-border hover:border-text-secondary/50 bg-elevated text-text-primary'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-text-primary block">{scope.value}</span>
                        <span className="text-xs text-text-secondary mt-0.5 block">{scope.desc}</span>
                      </div>
                      <div className="font-mono text-xs text-text-secondary font-medium">~${scope.price.toLocaleString()} base</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">Expected business impact?</h2>
                <p className="text-xs text-text-secondary mt-0.5">How critical is this work to the client's business outcome?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {impacts.map((impact) => (
                  <button
                    key={impact.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, impact: impact.value })}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-center text-xs ${
                      formData.impact === impact.value
                        ? 'border-green bg-green-tint text-green font-bold shadow-xs'
                        : 'border-border hover:border-text-secondary/50 bg-elevated text-text-primary font-medium'
                    }`}
                  >
                    <span className="text-sm block">{impact.value}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">Timeline urgency?</h2>
                <p className="text-xs text-text-secondary mt-0.5">Rush turnaround deadlines command premium rate adjustments</p>
              </div>
              <div className="space-y-2.5">
                {urgencies.map((urgency) => (
                  <button
                    key={urgency.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: urgency.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                      formData.urgency === urgency.value
                        ? 'border-green bg-green-tint text-text-primary shadow-xs'
                        : 'border-border hover:border-text-secondary/50 bg-elevated text-text-primary'
                    }`}
                  >
                    <div className="font-bold text-sm text-text-primary mb-0.5">{urgency.value}</div>
                    <div className="text-xs text-text-secondary">{urgency.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-text-primary">Pricing model structure?</h2>
                <p className="text-xs text-text-secondary mt-0.5">How will you structure payment with the client?</p>
              </div>
              <div className="space-y-2.5">
                {models.map((model) => (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, model: model.value })}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer text-xs ${
                      formData.model === model.value
                        ? 'border-green bg-green-tint text-text-primary shadow-xs'
                        : 'border-border hover:border-text-secondary/50 bg-elevated text-text-primary'
                    }`}
                  >
                    <div className="font-bold text-sm text-text-primary mb-0.5">{model.value}</div>
                    <div className="text-xs text-text-secondary">{model.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="h-9 px-4 text-xs font-semibold bg-surface border-border text-text-primary disabled:opacity-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            disabled={!canProceed()}
            className="h-9 px-4 text-xs font-semibold bg-green hover:bg-green-hover text-white flex items-center gap-1 transition-colors"
          >
            <span>{currentStep === 5 ? (saving ? 'Calculating...' : 'Calculate Pricing') : 'Continue'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
