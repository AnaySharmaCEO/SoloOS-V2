import { useState, useCallback } from 'react';
import * as pricingService from '../services/pricing.service';
import type { PricingCalculation, PricingRecord } from '../types';
import type { PricingFormInput } from '../services/pricing.service';

interface SaveEstimateResult {
  calculation: PricingCalculation;
  record: PricingRecord;
  error: null;
}
interface SaveEstimateError {
  calculation: null;
  record: null;
  error: string;
}

interface UsePricingReturn {
  saving: boolean;
  error: string | null;
  lastRecord: PricingRecord | null;
  calculate: (input: PricingFormInput) => PricingCalculation;
  saveEstimate: (
    input: PricingFormInput,
    leadId?: string
  ) => Promise<SaveEstimateResult | SaveEstimateError>;
}

export function usePricing(userId: string | undefined): UsePricingReturn {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRecord, setLastRecord] = useState<PricingRecord | null>(null);

  const calculate = useCallback((input: PricingFormInput) => {
    return pricingService.calculatePricing(input);
  }, []);

  const saveEstimate = useCallback(
    async (input: PricingFormInput, leadId?: string): Promise<SaveEstimateResult | SaveEstimateError> => {
      if (!userId) {
        const message = 'No active session found';
        setError(message);
        return { calculation: null, record: null, error: message };
      }
      setSaving(true);
      setError(null);
      const result = await pricingService.savePricingEstimate(userId, input, leadId);
      setSaving(false);

      if (result.error) {
        // Return the error directly rather than relying on the caller
        // reading `error` state right after this resolves — that state
        // update can still be in flight (this was flagged as a real bug:
        // a failed save could read a stale/previous error message).
        setError(result.error.message);
        return { calculation: null, record: null, error: result.error.message };
      }
      if (result.data) {
        setLastRecord(result.data.record);
        return { calculation: result.data.calculation, record: result.data.record, error: null };
      }
      const message = 'Could not save this estimate. Try again.';
      setError(message);
      return { calculation: null, record: null, error: message };
    },
    [userId]
  );

  return { saving, error, lastRecord, calculate, saveEstimate };
}
