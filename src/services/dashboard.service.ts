// ============================================
// DASHBOARD SERVICE
// ============================================
// Business logic for dashboard metrics and analytics

import * as dashboardApi from '../api/dashboard.api';
import type { ApiResponse, DashboardMetrics, RevenueMetrics } from '../types';

// ============================================
// DASHBOARD METRICS
// ============================================

export async function getDashboardMetrics(userId: string): Promise<ApiResponse<DashboardMetrics>> {
  return dashboardApi.getDashboardMetrics(userId);
}

export async function getRevenueMetrics(userId: string): Promise<ApiResponse<RevenueMetrics>> {
  return dashboardApi.getRevenueMetrics(userId);
}

export async function getTodayActionItems(userId: string): Promise<ApiResponse<any[]>> {
  return dashboardApi.getTodayActionItems(userId);
}

// ============================================
// DASHBOARD HELPERS
// ============================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function calculateGrowth(current: number, previous: number): {
  value: number;
  percentage: number;
  isPositive: boolean;
} {
  const difference = current - previous;
  const percentage = previous > 0 ? (difference / previous) * 100 : 0;

  return {
    value: difference,
    percentage,
    isPositive: difference >= 0,
  };
}

export function prioritizeActionItems(items: any[]): any[] {
  // Sort by urgency and type
  return items.sort((a, b) => {
    // Urgent follow-ups first
    if (a.type === 'follow-up' && a.urgency === 'urgent') return -1;
    if (b.type === 'follow-up' && b.urgency === 'urgent') return 1;

    // Then delayed proposals
    if (a.type === 'proposal' && a.days_waiting > 3) return -1;
    if (b.type === 'proposal' && b.days_waiting > 3) return 1;

    // Then warm leads
    return 0;
  });
}
