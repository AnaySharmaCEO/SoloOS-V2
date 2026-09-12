import * as decisionApi from '../api/decision.api';
import type { ApiResponse, DecisionLogEntry } from '../types';

export async function logDecision(
  userId: string,
  input: {
    lead_id?: string;
    proposal_id?: string;
    client_id?: string;
    decision_type: string;
    reason?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<ApiResponse<DecisionLogEntry>> {
  return decisionApi.createDecision(userId, input);
}
