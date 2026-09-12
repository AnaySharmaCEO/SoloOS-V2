# SoloOS — Quality Assurance & Test Plan

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM test strategy and black-box verification test cases |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI-assisted selling test cases and safety verification |

---

## 1. Introduction & Objectives

### 1.1 Purpose
This Quality Assurance and Test Plan establishes the verification and validation strategy for **SoloOS**. It defines the testing scope, methodology, environment parameters, and black-box test cases required to confirm that the application conforms fully to the requirements established in [docs/02_SRS.md](02_SRS.md).

The plan spans both project phases:
- **Phase 1 (Base CRM — Completed Foundation)**: Lead pipeline, follow-ups, pricing estimator, proposals, clients, dashboard, and subscription billing.
- **Phase 2 (AI-Powered CRM — Planned Extension)**: Deal Radar prioritization, personalized pricing recommendations, client health scoring, human-in-the-loop AI follow-up drafting, and automated weekly revenue debriefs.

### 1.2 Quality Objectives
1. **Functional Correctness**: Confirm that all user-facing features operate deterministically across all standard sales workflows.
2. **Data Integrity & Multi-Tenant Isolation**: Verify that user data operations remain isolated to the authenticated tenant and persist accurately across sessions.
3. **Transaction Reliability**: Ensure the subscription checkout lifecycle behaves reliably across network partitions, card declines, delayed webhooks, and duplicate deliveries.
4. **AI Safety & Human Agency**: Verify that AI-generated messages are never transmitted autonomously and always pass through explicit human review.
5. **Graceful Degradation**: Verify that the base CRM remains 100% operational during simulated third-party AI provider outages or timeouts.

---

## 2. Test Strategy & Levels

Testing is executed across four complementary levels:

```
                  / \
                 / UAT \          User Acceptance Testing (End-to-End Freelance Workflows)
                /-------\
               / Manual  \        Black-Box UI & Cross-Device Exploration
              /   & UI    \
             /-------------\
            /  Integration  \     Service Adapters, Mocked Webhooks & AI Orchestration
           /-----------------\
          /    Unit Tests     \   Pure Business Logic, Price Formatter & Scoring Reducers
         /---------------------\
```

### 2.1 Unit Testing
- **Focus**: Pure algorithmic logic, including price estimation range computation, follow-up date calculations, urgency sorting, and date formatters.
- **Tools**: Automated JavaScript/TypeScript test runners.

### 2.2 Integration Testing
- **Focus**: Inter-layer communication between UI state management hooks, application service adapters, and mocked external provider endpoints (Payment Gateway and Hosted AI Provider).
- **Verification**: Asserts proper request payload construction, response normalization, and error catching.

### 2.3 Manual & Automated Black-Box UI Testing
- **Focus**: Validating application behavior from the perspective of an end user interacting with visual UI components (forms, Kanban cards, modals, tables, AI review dialogs) across standard browsers and mobile viewports.
- **Rule**: Test cases are authored strictly at a behavioral level without referencing internal function names, source file paths, or database structures.

### 2.4 User Acceptance Testing (UAT)
- **Focus**: Validating realistic freelance workflows from initial sign-up through pipeline progression, deal closing, AI message review, and subscription upgrading.

---

## 3. Scope of Testing

### 3.1 In-Scope
- User authentication, registration, session persistence, and logout flows.
- Full CRUD lifecycle and drag-and-drop operations for Leads.
- Follow-up scheduling, categorization, and completion logging.
- Pricing estimator calculation and attachment to leads.
- Proposal creation, status tracking, and deal conversion.
- Client directory viewing and lifetime revenue metric aggregation.
- Dashboard analytics calculation and quick action triggers.
- Account settings management, profile updates, and data exports.
- Subscription plan presentation, checkout modal invocation, webhook verification, and entitlement upgrading.
- AI Deal Radar ranking display and momentum badges.
- AI follow-up draft generation and interactive human-in-the-loop review modal.
- Client health score calculation and retention recommendations.
- Weekly revenue debrief synthesis and dashboard display.
- Graceful degradation fallback when AI services are unreachable.
- Cross-browser and responsive mobile viewport testing.

### 3.2 Out-of-Scope
- Physical server hardware penetration testing.
- Internal proprietary payment gateway banking settlement infrastructure.
- Internal machine learning weight architectures of the third-party hosted AI provider.

---

## 4. Test Environment

- **Browsers**: Google Chrome (latest 2 versions), Mozilla Firefox (latest 2 versions), Apple Safari (latest 2 versions), Microsoft Edge (latest 2 versions).
- **Devices & Viewports**:
  - Desktop: 1920x1080 and 1440x900.
  - Tablet: 768x1024 (iPad portrait/landscape).
  - Mobile: 375x667 (iPhone SE) and 390x844 (iPhone 13/14).
- **Backend Services**: Cloud-hosted development/staging project with test tenant credentials.
- **Payment Testing Environment**: Sandbox/Test mode of the third-party Payment Gateway with simulated payment cards, UPI test addresses, and automated webhook payload generators.
- **AI Testing Environment**: Mock AI provider proxy simulating normal inference responses (500ms), high latency responses (3,500ms), and HTTP 503/429 failure modes.

---

## 5. Functional Black-Box Test Cases

### 5.1 Lead Management Module
| Test ID | Test Description | Preconditions | Test Steps | Expected Result |
|---|---|---|---|---|
| **TC-LM-01** | Create a valid new lead | User is logged in to an empty or active workspace. | 1. Navigate to Pipeline view.<br>2. Click "Add Lead".<br>3. Enter Lead Name, contact details, estimated value ($5,000), and source.<br>4. Click Save. | Modal closes; new lead card appears immediately in the *New Lead* column with accurate details. |
| **TC-LM-02** | Move lead stage via drag-and-drop | Lead exists in *New Lead* stage. | 1. In Kanban view, click and drag the lead card to *Warm Lead* column.<br>2. Release mouse button. | Card snaps into the *Warm Lead* column; stage badge updates; pipeline value reflects in the new stage. |
| **TC-LM-03** | Lead validation on empty name | User opens "Add Lead" modal. | 1. Leave Lead Name blank.<br>2. Enter estimated value.<br>3. Click Save. | Form displays inline validation error indicating Lead Name is required; submission is prevented. |
| **TC-LM-04** | Delete a lead | Existing lead is selected in pipeline. | 1. Open lead details modal.<br>2. Click "Delete Lead".<br>3. Confirm deletion in warning dialog. | Lead is permanently removed from the pipeline and tabular views; dashboard counts update accordingly. |

### 5.2 Follow-Up Management Module
| Test ID | Test Description | Preconditions | Test Steps | Expected Result |
|---|---|---|---|---|
| **TC-FM-01** | Schedule an upcoming follow-up | Active lead exists in workspace. | 1. Open lead details.<br>2. Click "Add Follow-Up".<br>3. Select tomorrow's date, priority High, and note "Send portfolio".<br>4. Save. | Follow-up appears in the lead timeline and the Follow-Ups view under *Upcoming* with a High priority indicator. |
| **TC-FM-02** | Visual indicator for overdue task | Follow-up exists with yesterday's due date. | 1. Navigate to Dashboard or Follow-Ups view. | Task is prominently badged with an *Overdue* alert indicator and surfaced in the Action Items pane. |
| **TC-FM-03** | Complete a follow-up action | Open follow-up exists. | 1. Locate follow-up in the queue.<br>2. Click "Mark Complete".<br>3. Enter brief interaction notes in prompt and submit. | Follow-up is marked complete, removed from active queue, and logged to the lead's historical activity audit trail. |

### 5.3 Pricing Estimation Module
| Test ID | Test Description | Preconditions | Test Steps | Expected Result |
|---|---|---|---|---|
| **TC-PE-01** | Generate estimate from scoping inputs | User opens Pricing Estimator tool. | 1. Select project duration (e.g. 4 weeks).<br>2. Select complexity level (Medium).<br>3. Select client commercial scale.<br>4. Click "Calculate Estimate". | System renders a calculated pricing band displaying recommended Minimum, Target, and Premium fee ranges. |
| **TC-PE-02** | Attach estimate to an active lead | Calculated estimate is displayed on screen. | 1. Click "Attach to Lead".<br>2. Select an existing lead from dropdown.<br>3. Confirm selection. | Estimate values populate the lead's estimated value and appear in the lead's proposal preparation pane. |

### 5.4 Proposal Tracking & Client Management
| Test ID | Test Description | Preconditions | Test Steps | Expected Result |
|---|---|---|---|---|
| **TC-PT-01** | Create and track a sent proposal | Active lead exists. | 1. Navigate to Proposals view.<br>2. Click "New Proposal".<br>3. Associate with lead, set amount ($8,000), set status to *Sent*. | Proposal record is created and appears in the proposal tracking table with status *Sent*. |
| **TC-CM-01** | Convert Won lead to Client Record | Lead exists with status *Proposal Sent*. | 1. Update proposal status to *Accepted* (or drag lead to *Won*).<br>2. Confirm deal won prompt. | Lead transitions to *Won*; a new Client Record is automatically created in the Clients view containing cumulative revenue. |
| **TC-CM-02** | Verify Client lifetime revenue | Client record exists with $8,000 deal. | 1. Navigate to Clients view.<br>2. Inspect client summary card. | Total Revenue displays $8,000; relationship start date matches the deal close timestamp. |

### 5.5 Dashboard & Settings
| Test ID | Test Description | Preconditions | Test Steps | Expected Result |
|---|---|---|---|---|
| **TC-DB-01** | Dashboard metric aggregation | Multiple leads exist across Won, Warm, and Lost stages. | 1. Navigate to Dashboard view. | Total Pipeline Value, Win Rate percentage, and Active Lead counts match the mathematical sum of the underlying records. |
| **TC-AS-01** | Export data to CSV/JSON | User has active leads and clients. | 1. Navigate to Account Settings.<br>2. Click "Export Data".<br>3. Select CSV format. | Browser downloads a formatted archive containing accurate lead, client, and proposal records. |

---

## 6. Subscription & Payment Gateway Edge-Case Testing

| Test ID | Edge Case Scenario | Test Preconditions | Simulated Action / Test Steps | Expected System Behavior |
|---|---|---|---|---|
| **TC-SM-01** | **Standard Successful Upgrade** | Authenticated user on Free tier. | 1. Select Pro plan (Annual).<br>2. In payment modal, enter valid test payment credentials.<br>3. Gateway returns success callback and triggers signed webhook. | Modal closes; UI displays confirmation status; backend verifies webhook signature; user tier updates to Pro; premium features unlock immediately. |
| **TC-SM-02** | **Payment Gateway Declined / Insufficient Funds** | User in payment checkout modal. | 1. Enter test card with simulated decline error.<br>2. Submit payment. | Gateway modal displays clear card decline error; application state remains on Free tier without corrupting session; user can re-try. |
| **TC-SM-03** | **User Abandons / Closes Checkout Modal** | User clicks "Upgrade to Pro". | 1. Checkout modal renders.<br>2. User clicks the modal dismiss/close button without paying. | Modal closes cleanly; application returns to plan view; user tier remains Free with zero stuck "pending" UI locks. |
| **TC-SM-04** | **Delayed Webhook Delivery (Race Condition)** | User completes successful payment in modal. | 1. Client completes payment successfully.<br>2. Payment Gateway webhook is artificially delayed by 15 seconds.<br>3. User observes client UI. | Client UI shows "Verifying payment confirmation..." with an asynchronous polling indicator; once the webhook arrives and verifies, status transitions cleanly to Pro. |
| **TC-SM-05** | **Duplicate Webhook Delivery (Idempotency)** | Valid signed webhook already processed for payment. | 1. External test harness replays the identical signed webhook payload twice within 5 seconds. | Serverless endpoint identifies the duplicate event idempotently; returns HTTP 200 without creating duplicate subscription records or extending billing terms incorrectly. |
| **TC-SM-06** | **Forged / Invalid Webhook Signature** | Serverless webhook endpoint exposed to internet. | 1. Transmit HTTP POST to webhook endpoint with an invalid or missing signature header. | Serverless function immediately rejects payload with HTTP 400/401; zero database mutations occur. |
| **TC-SM-07** | **Plan Downgrade While Active** | User has an active Pro subscription with 15 days remaining. | 1. User navigates to Settings > Subscription.<br>2. Clicks "Cancel Auto-Renewal / Downgrade".<br>3. Confirms cancellation prompt. | Subscription status updates to *Canceled*; Pro feature access remains unlocked until the scheduled expiration date; UI displays expiration reminder. |

---

## 7. AI-Assisted Selling & Safety Verification Test Cases (Phase 2)

| Test ID | Feature / Edge Case | Preconditions | Test Steps | Expected System Behavior |
|---|---|---|---|---|
| **TC-AI-01** | **Deal Radar Prioritization Display** | Multiple active leads exist with varying contact recency and values. | 1. Navigate to Dashboard or Pipeline view.<br>2. Observe Deal Radar widget. | Leads are ranked in descending order of priority with visual momentum badges (*Hot*, *Steady*, *Cooling*, *At Risk*); top 3 immediate action deals are surfaced. |
| **TC-AI-02** | **Context-Aware Follow-Up Draft Generation** | Due follow-up task exists for an active lead. | 1. Open follow-up card.<br>2. Click "Draft with AI".<br>3. Observe modal. | Review modal opens within 3 seconds displaying an editable message draft incorporating lead name, stage context, and recent notes. |
| **TC-AI-03** | **Human-in-the-Loop Review & Edit Verification** | AI draft is loaded in review modal. | 1. Manually edit draft text (modify closing paragraph).<br>2. Click "Approve & Copy/Send". | System preserves human edits exactly; confirms transmission; marks follow-up completed; records edited message in lead activity log. No message is ever sent without explicit user confirmation. |
| **TC-AI-04** | **Hosted AI Provider Timeout / Graceful Degradation** | Mock proxy simulates 6-second timeout / HTTP 503 from AI provider. | 1. Click "Draft with AI" on a follow-up task.<br>2. Observe application response. | Application times out gracefully after 5 seconds; displays friendly alert *"AI assistant currently unavailable — compose manually"*; opens blank message composer. Base CRM features remain 100% functional with zero UI freezing. |
| **TC-AI-05** | **Client Health Scoring Under Sparse Data** | Newly converted client with zero completed projects and 1 contact log. | 1. Open client profile in Clients directory.<br>2. Inspect health indicator. | System assigns default baseline health status (*Stable / New*) without throwing null exceptions or NaN calculation errors. |
| **TC-AI-06** | **Global AI Opt-Out Toggle** | User is on Pro tier with AI enabled. | 1. Navigate to Settings > Account.<br>2. Toggle "AI Features" switch to Disabled.<br>3. Return to Follow-Ups and Dashboard views. | AI draft buttons, Deal Radar widgets, and AI badges are hidden; UI reverts cleanly to the standard manual Base CRM experience. |

---

## 8. Defect Severity & Triage Guidelines

Defects discovered during test execution are categorized according to standard severity levels:

- **Blocker (Severity 1)**: System crash, data loss, security exposure (cross-tenant leak), autonomous AI message transmission without human approval, or complete failure of the payment checkout flow.
- **Critical (Severity 2)**: Core functional failure (inability to add leads, convert won deals, or view pipeline) with no viable workaround.
- **Major (Severity 3)**: Secondary feature impairment (pricing estimator edge calculation, chart display anomaly, or AI draft modal formatting glitch) with an available workaround.
- **Minor / Trivial (Severity 4/5)**: Visual alignment glitches, minor copy discrepancies, or non-blocking cosmetic issues.
