// ============================================
// USER & AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  role?: string;
  business_stage?: string;
  blocker?: string;
  avg_project_value?: number;
  onboarding_complete: boolean;
  follow_up_interval: number;
  risk_threshold: number;
  notifications_follow_up: boolean;
  notifications_proposal: boolean;
  notifications_lead: boolean;
  notifications_weekly: boolean;
  full_name?: string;
  notify_followup_reminders: boolean;
  notify_proposal_updates: boolean;
  notify_lead_activity: boolean;
  notify_weekly_digest: boolean;
  default_followup_interval_days: number;
  risk_alert_threshold_days: number;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User;
  profile: Profile;
  access_token?: string;
  refresh_token?: string;
}

// ============================================
// LEAD TYPES
// ============================================

export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Waiting Reply'
  | 'Warm Lead'
  | 'Proposal Sent'
  | 'Won'
  | 'Lost';

export type LeadSource =
  | 'Cold Email'
  | 'Instagram DM'
  | 'LinkedIn'
  | 'Twitter/X'
  | 'Referral'
  | 'Inbound'
  | 'Other';

export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ContactChannelType = 'Email' | 'Instagram' | 'LinkedIn' | 'X' | 'WhatsApp' | 'Call';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  stage: LeadStage;
  source?: LeadSource;
  estimated_value: number;
  last_contact_date?: string;
  next_follow_up_date?: string;
  notes?: string;
  days_in_stage: number;
  priority?: LeadPriority;
  next_action?: string;
  archived_at?: string | null;
  lost_reason?: string | null;
  win_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLeadInput {
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  stage: LeadStage;
  source?: LeadSource;
  estimated_value: number;
  notes?: string;
  priority?: LeadPriority;
  next_action?: string;
  channels?: { channel_type: ContactChannelType; channel_value?: string }[];
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  stage?: LeadStage;
  source?: LeadSource;
  estimated_value?: number;
  last_contact_date?: string;
  next_follow_up_date?: string;
  notes?: string;
  priority?: LeadPriority;
  next_action?: string;
  archived_at?: string | null;
  lost_reason?: string | null;
  win_reason?: string | null;
  days_in_stage?: number;
}

// ============================================
// FOLLOW-UP TYPES
// ============================================

export type FollowUpUrgency = 'urgent' | 'high' | 'medium' | 'low';
export type FollowUpStatus = 'pending' | 'completed' | 'snoozed' | 'cancelled';

export interface FollowUp {
  id: string;
  user_id: string;
  lead_id: string;
  lead_name?: string;
  lead_company?: string;
  urgency: FollowUpUrgency;
  reason: string;
  suggested_message?: string;
  due_date: string;
  status: FollowUpStatus;
  completed_at?: string;
  snoozed_until?: string;
  channel_used?: string;
  message_sent?: string;
  sent_at?: string;
  copied_message?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFollowUpInput {
  lead_id: string;
  urgency: FollowUpUrgency;
  reason: string;
  suggested_message?: string;
  due_date: string;
}

export interface UpdateFollowUpInput {
  urgency?: FollowUpUrgency;
  reason?: string;
  suggested_message?: string;
  due_date?: string;
  status?: FollowUpStatus;
  snoozed_until?: string;
  channel_used?: string;
  message_sent?: string;
  sent_at?: string;
  copied_message?: string;
  completed_at?: string;
}

// ============================================
// PRICING TYPES
// ============================================

export type PricingModel = 'One-time project' | 'Monthly retainer' | 'Performance-based';
export type ProjectScope = 'Small' | 'Medium' | 'Large' | 'Enterprise';
export type BusinessImpact = 'Low' | 'Medium' | 'High' | 'Critical';
export type Urgency = 'Flexible (2+ weeks)' | 'Standard (1-2 weeks)' | 'Rush (<1 week)';

export interface PricingRecord {
  id: string;
  user_id: string;
  lead_id?: string;
  service_type: string;
  deliverables?: string;
  scope: ProjectScope;
  urgency: Urgency;
  impact: BusinessImpact;
  model: PricingModel;
  recommended_min: number;
  recommended_max: number;
  confidence_score: number;
  underpricing_warning: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePricingInput {
  lead_id?: string;
  service_type: string;
  deliverables?: string;
  scope: ProjectScope;
  urgency: Urgency;
  impact: BusinessImpact;
  model: PricingModel;
  recommended_min: number;
  recommended_max: number;
  confidence_score: number;
  underpricing_warning: boolean;
}

// ============================================
// PROPOSAL TYPES
// ============================================

export type ProposalStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface Proposal {
  id: string;
  user_id: string;
  lead_id: string;
  lead_name?: string;
  lead_company?: string;
  lead_email?: string;
  lead_phone?: string;
  amount: number;
  sent_date: string;
  expected_reply_date?: string;
  actual_reply_date?: string;
  status: ProposalStatus;
  notes?: string;
  days_waiting: number;
  reminder_count?: number;
  last_reminder_sent_at?: string;
  decision_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProposalInput {
  lead_id: string;
  amount: number;
  sent_date: string;
  expected_reply_date?: string;
  notes?: string;
}

export interface UpdateProposalInput {
  amount?: number;
  sent_date?: string;
  expected_reply_date?: string;
  actual_reply_date?: string;
  status?: ProposalStatus;
  notes?: string;
  reminder_count?: number;
  last_reminder_sent_at?: string;
  decision_reason?: string;
}

// ============================================
// DASHBOARD METRICS TYPES
// ============================================

export interface DashboardMetrics {
  warm_leads_count: number;
  pending_followups_count: number;
  proposals_out_count: number;
  monthly_revenue: number;
  total_pipeline_value: number;
  at_risk_count: number;
  total_leads_count: number;
  total_proposals_count: number;
  total_clients_count: number;
}

export interface RevenueMetrics {
  total_won: number;
  total_pending: number;
  monthly_revenue: number;
  average_deal_size: number;
  win_rate: number;
  deals_closed_count: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// ============================================
// QUERY TYPES
// ============================================

export interface LeadFilters {
  stage?: LeadStage;
  source?: LeadSource;
  min_value?: number;
  max_value?: number;
  search?: string;
}

export interface FollowUpFilters {
  status?: FollowUpStatus;
  urgency?: FollowUpUrgency;
  overdue?: boolean;
}

export interface ProposalFilters {
  status?: ProposalStatus;
  min_amount?: number;
  max_amount?: number;
  delayed?: boolean;
}

// ============================================
// NOTES, ACTIVITY, CLIENTS, CHANNELS, TEMPLATES, DECISIONS
// ============================================

export interface LeadNote {
  id: string;
  user_id: string;
  lead_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface LeadContactChannel {
  id: string;
  user_id: string;
  lead_id: string;
  channel_type: ContactChannelType;
  channel_value?: string;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  user_id: string;
  lead_id?: string | null;
  client_id?: string | null;
  proposal_id?: string | null;
  action_type: string;
  action_label: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  user_id: string;
  template_type: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DecisionLogEntry {
  id: string;
  user_id: string;
  lead_id?: string | null;
  proposal_id?: string | null;
  client_id?: string | null;
  decision_type: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  lead_id: string;
  client_name: string;
  company?: string;
  relationship_status: string;
  client_status: string;
  retainer_active: boolean;
  retainer_value?: number;
  total_revenue: number;
  repeat_work_count: number;
  referral_source?: string;
  referral_opportunity?: string;
  upsell_opportunity?: string;
  next_client_action?: string;
  account_health: string;
  client_email?: string;
  client_phone?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateClientInput {
  relationship_status?: string;
  client_status?: string;
  retainer_active?: boolean;
  retainer_value?: number;
  total_revenue?: number;
  repeat_work_count?: number;
  referral_opportunity?: string;
  upsell_opportunity?: string;
  next_client_action?: string;
  account_health?: string;
  notes?: string;
}

export interface MoveStageInput {
  stage: LeadStage;
  lost_reason?: string;
  win_reason?: string;
}

export interface DashboardActionItem {
  id: string;
  type: 'follow-up' | 'proposal' | 'warm-lead' | 'pricing' | 'client';
  title: string;
  description: string;
  href: string;
  priority: number;
  value?: number;
}

export const LEAD_STAGES: LeadStage[] = [
  'New Lead',
  'Contacted',
  'Waiting Reply',
  'Warm Lead',
  'Proposal Sent',
  'Won',
  'Lost',
];

export const LOST_REASONS = [
  'Too expensive',
  'Ghosted',
  'Chose competitor',
  'No budget',
  'Bad timing',
  'Scope mismatch',
  'Other',
] as const;
