import * as pricingApi from '../api/pricing.api';
import * as activityService from './activity.service';
import type {
  ApiResponse,
  BusinessImpact,
  CreatePricingInput,
  PricingModel,
  PricingRecord,
  ProjectScope,
  Urgency,
} from '../types';

export interface PricingFormInput {
  serviceType: string;
  deliverables: string;
  scope: string;
  urgency: string;
  impact: string;
  model: string;
}

export interface PricingCalculation {
  minPrice: number;
  maxPrice: number;
  confidence: number;
  underpricingWarning: boolean;
  underpricingPercentage?: number;
  basePrice: number;
}

const SCOPES = [
  { value: 'Small', price: 1500 },
  { value: 'Medium', price: 3000 },
  { value: 'Large', price: 6000 },
  { value: 'Enterprise', price: 12000 },
];

const URGENCIES = [
  { value: 'Flexible (2+ weeks)', multiplier: 1.0 },
  { value: 'Standard (1-2 weeks)', multiplier: 1.2 },
  { value: 'Rush (<1 week)', multiplier: 1.5 },
];

const IMPACTS = [
  { value: 'Low', multiplier: 0.9 },
  { value: 'Medium', multiplier: 1.0 },
  { value: 'High', multiplier: 1.3 },
  { value: 'Critical', multiplier: 1.6 },
];

export function calculatePricing(input: PricingFormInput): PricingCalculation {
  const scopeData = SCOPES.find((s) => s.value === input.scope);
  const urgencyData = URGENCIES.find((u) => u.value === input.urgency);
  const impactData = IMPACTS.find((i) => i.value === input.impact);

  if (!scopeData || !urgencyData || !impactData) {
    return { minPrice: 0, maxPrice: 0, confidence: 0, underpricingWarning: false, basePrice: 0 };
  }

  let basePrice = scopeData.price;
  basePrice *= urgencyData.multiplier;
  basePrice *= impactData.multiplier;

  const minPrice = Math.floor(basePrice * 0.85);
  const maxPrice = Math.floor(basePrice * 1.35);
  const confidence = input.deliverables.length > 20 ? 92 : 85;
  const underpricingWarning = maxPrice < 2500;
  const underpricingPercentage = underpricingWarning
    ? Math.floor(((2500 - maxPrice) / 2500) * 100)
    : 0;

  return { minPrice, maxPrice, confidence, underpricingWarning, underpricingPercentage, basePrice };
}

export async function savePricingEstimate(
  userId: string,
  input: PricingFormInput,
  leadId?: string
): Promise<ApiResponse<{ calculation: PricingCalculation; record: PricingRecord }>> {
  const calculation = calculatePricing(input);

  const payload: CreatePricingInput = {
    lead_id: leadId,
    service_type: input.serviceType,
    deliverables: input.deliverables || undefined,
    scope: input.scope as ProjectScope,
    urgency: input.urgency as Urgency,
    impact: input.impact as BusinessImpact,
    model: input.model as PricingModel,
    recommended_min: calculation.minPrice,
    recommended_max: calculation.maxPrice,
    confidence_score: calculation.confidence,
    underpricing_warning: calculation.underpricingWarning,
  };

  const result = await pricingApi.createPricingRecord(userId, payload);
  if (result.error || !result.data) {
    return { data: null, error: result.error };
  }

  await activityService.logActivity(userId, {
    lead_id: leadId,
    action_type: 'pricing_calculated',
    action_label: `Pricing estimate: $${calculation.minPrice.toLocaleString()}–$${calculation.maxPrice.toLocaleString()}`,
    metadata: {
      service_type: input.serviceType,
      scope: input.scope,
      recommended_min: calculation.minPrice,
      recommended_max: calculation.maxPrice,
    },
  });

  return { data: { calculation, record: result.data }, error: null };
}

export async function getPricingHistory(
  userId: string,
  leadId?: string
): Promise<ApiResponse<PricingRecord[]>> {
  if (leadId) {
    return pricingApi.getPricingHistoryForLead(leadId, userId);
  }
  return pricingApi.getPricingRecords(userId);
}
