# SoloOS — Software Requirements Specification (SRS)

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM specification (IEEE 830-1998 compliant) |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI-Powered CRM module, AI NFRs, and use cases |

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional, non-functional, interface, and behavioral requirements for **SoloOS** — an AI-powered sales and pipeline management workspace designed for solo freelancers, independent consultants, and boutique service providers.

This document serves as the authoritative engineering baseline for development, verification, architectural design, and academic evaluation, adhering strictly to the **IEEE Standard 830-1998 (Recommended Practice for Software Requirements Specifications)**.

### 1.2 Scope
SoloOS is an integrated software system engineered to streamline the freelance business acquisition lifecycle. The system is designed and executed across two defined SDLC phases:
- **Phase 1 — Base CRM (Delivered Foundation)**: Provides core sales infrastructure including lead pipeline visualization (Kanban and tabular formats), follow-up scheduling and logging, scoping-based pricing estimation, proposal tracking, automated client conversion, executive dashboard analytics, and tiered subscription checkout management.
- **Phase 2 — AI-Powered CRM (Planned Extension)**: Augments the delivered foundation with an assistive intelligence layer providing automated deal prioritization ("Deal Radar"), personalized pricing recommendations, computed client health scoring, context-aware follow-up message drafting, and automated weekly revenue debriefs.

All Phase 2 AI capabilities are strictly advisory, incorporating an inviolable **human-in-the-loop** review pattern where the user retains complete authority over all outbound communications and deal decisions.

### 1.3 Definitions, Acronyms, and Abbreviations
- **AI**: Artificial Intelligence.
- **BaaS**: Backend-as-a-Service.
- **Client**: A converted lead with an active or historical commercial relationship.
- **Deal Radar**: An AI-assisted ranking mechanism that evaluates and prioritizes sales opportunities by engagement recency, monetary value, and deal momentum.
- **Follow-Up**: A scheduled outreach action associated with a prospective lead to maintain sales momentum.
- **HMAC**: Hash-based Message Authentication Code.
- **IEEE**: Institute of Electrical and Electronics Engineers.
- **Lead**: A prospective client opportunity under active qualification.
- **LLM**: Large Language Model.
- **NFR**: Non-Functional Requirement.
- **Proposal**: A formal quotation or scope document delivered to a prospect.
- **RLS**: Row Level Security.
- **SPA**: Single Page Application.
- **SRS**: Software Requirements Specification.
- **UML**: Unified Modeling Language.
- **WCAG**: Web Content Accessibility Guidelines.

### 1.4 References
- SoloOS UML Specifications: [docs/UML.md](UML.md)
- SoloOS Feasibility Study: [docs/01_Feasibility_Study.md](01_Feasibility_Study.md)
- SoloOS System Design Document: [docs/03_System_Design_Document.md](03_System_Design_Document.md)
- SoloOS Quality Assurance & Test Plan: [docs/05_Test_Plan.md](05_Test_Plan.md)
- IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.

### 1.5 Document Overview
The remainder of this document is organized as follows:
- **Section 2 (Overall Description)**: Contextualizes the product perspective, summarizes functions, user classes, operating environment, design constraints, and operational assumptions.
- **Section 3 (Specific Requirements)**: Outlines external interface requirements, functional requirements organized by module (Modules 1–8 for Base CRM; Module 9 for AI-Assisted Selling), and non-functional requirements (including AI performance, safety, and transparency standards).
- **Section 4 (Use Case Specifications)**: Details formal tabular use case descriptions corresponding to the system UML use case models.
- **Section 5 (Appendices & UML References)**: Links diagrammatic models.

---

## 2. Overall Description

### 2.1 Product Perspective
SoloOS operates as a cloud-hosted, single-page web application. It integrates with an external Identity Provider for authentication, a managed cloud Backend-as-a-Service for multi-tenant relational persistence, a third-party Payment Gateway for subscription processing, and a Hosted AI Provider for generative and ranking tasks.

The architectural layering and system evolution are documented in [docs/UML.md](UML.md):
- **Roadmap (Phase 1 to Phase 2)**: [UML.md Section 9](UML.md#9-roadmap--phase-1-to-phase-2)
- **Component Architecture (Base)**: [UML.md Section 8](UML.md#8-component--architecture-diagram-logical)
- **Extended AI Architecture**: [UML.md Section 11](UML.md#11-extended-architecture--ai-service-layer)

```
+-------------------------------------------------------------------------+
|                        SoloOS Client (SPA)                              |
+-------------------------------------------------------------------------+
         |                        |                          |
         v                        v                          v
+------------------+    +-------------------+    +------------------------+
| Identity & BaaS  |    |  Payment Gateway  |    | Hosted AI Provider     |
| (Auth + Store)   |    | (Checkout/Webhook)|    | (Via Serverless Proxy) |
+------------------+    +-------------------+    +------------------------+
```

### 2.2 Product Functions Summary
Summarized from UML Use Case Models ([UML.md Section 1](UML.md#1-use-case-diagram--base-crm-phase-1-foundation) and [Section 10](UML.md#10-extended-use-case-diagram--ai-assisted-selling-phase-2)):

#### Base CRM Functions (Delivered Foundation)
1. User registration, secure authentication, and session persistence.
2. Visual multi-stage lead pipeline tracking (Kanban and list views).
3. Follow-up scheduling, priority categorization, and interaction logging.
4. Scoping-based project pricing estimation and suggested fee range calculation.
5. Proposal tracking across lifecycle states.
6. Automatic conversion of won opportunities into permanent client records.
7. Executive dashboard aggregation of pipeline value, revenue, and priority alerts.
8. Structured workspace data export (CSV/JSON).
9. Tiered subscription billing management (Free vs. Pro).

#### AI-Assisted Selling Functions (Planned Extension)
10. Automated deal prioritization ("Deal Radar") ranking active opportunities.
11. Personalized pricing recommendations based on scope and client parameters.
12. Computed client health scoring evaluating relationship vitality.
13. Context-aware AI drafting of follow-up outreach messages.
14. Mandatory human-in-the-loop review, editing, and manual transmission confirmation.
15. Automated weekly revenue debriefs summarizing pipeline progress and risks.

### 2.3 User Classes and Characteristics
- **Freelancer / Independent Consultant (Primary Actor)**: Individual professional managing client sales without dedicated administrative staff. Requires a fast, low-friction interface with clear action cues and zero administrative bloat.
- **Prospective Client / External Contact (Indirect Stakeholder)**: Recipient of quotes, proposals, and follow-ups. Benefits from timely, personalized communication without receiving robotic automated spam.
- **System Administrator (Support Actor)**: Responsible for service uptime monitoring, security audits, and tenant lifecycle support.

### 2.4 Operating Environment
- **Client Platforms**: Modern standards-compliant web browsers (Google Chrome v100+, Mozilla Firefox v100+, Apple Safari v15+, Microsoft Edge v100+) on desktop (>=1024px), tablet (768px–1023px), and mobile (375px–767px) viewports.
- **Hosting Environment**: Distributed global Content Delivery Network (CDN) serving static assets.
- **Backend Infrastructure**: Managed cloud BaaS and serverless edge functions executing on secure cloud runtimes.

### 2.5 Design and Implementation Constraints
- **Zero Raw Payment Handling**: SoloOS shall never capture, transmit, or store raw credit card numbers or sensitive payment instrumentation on application servers.
- **Human-in-the-Loop AI Mandate**: SoloOS shall never transmit AI-generated communications directly to external clients without explicit, manual human review and confirmation.
- **Stateless Client Decoupling**: Client UI components shall not interface with physical database schemas directly, interacting strictly through abstracted service layers.
- **Decoupled AI Abstraction**: Hosted AI services shall be integrated strictly via serverless proxy adapters, ensuring zero exposure of private API credentials in client-side bundles.

### 2.6 Assumptions and Dependencies
- Users possess an active internet connection to synchronize workspace data.
- External providers (Identity Provider, Payment Gateway, Hosted AI Provider) maintain operational availability consistent with their published Service Level Agreements (SLAs).
- The base CRM platform continues to operate without degradation during external AI provider downtime.

---

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
- **Visual Design**: The UI shall feature a modern, minimalist interface adhering to a cohesive design system with dark/light themes, WCAG AA contrast compliance, and responsive layouts.
- **Pipeline Interface**: The system shall render an interactive multi-column Kanban board allowing smooth drag-and-drop card transitions alongside a compact tabular list view.
- **AI Interaction Modals**: AI-generated suggestions (drafts, pricing recommendations) shall render in distinct, editable modal dialogs with visual AI badges and clear "Approve & Send", "Edit", and "Discard" actions.

#### 3.1.2 Hardware Interfaces
The system requires no specialized hardware; it shall function with standard input peripherals (mouse, keyboard, touchscreen).

#### 3.1.3 Software Interfaces
- **Identity Provider Interface**: Secure OAuth 2.0 / OpenID Connect token authentication for user session management.
- **Managed BaaS Interface**: Secure HTTPS/WSS communication for multi-tenant data querying and real-time state synchronization.
- **Payment Gateway Interface**: Client-side SDK integration for checkout modals; serverless webhook endpoint for signed payment settlement callbacks.
- **Hosted AI Provider Interface**: Server-to-server HTTPS JSON request/response interface executed via serverless edge functions.

#### 3.1.4 Communications Interfaces
All communications between client, serverless functions, and external providers shall be encrypted using Transport Layer Security (TLS 1.3).

---

### 3.2 Functional Requirements

#### Module 1: Lead Management (Base CRM)
- **FR-LM-01**: The system shall allow the user to create a new lead by specifying a lead name, contact email, referral source, estimated monetary value, and initial notes.
- **FR-LM-02**: The system shall render active leads in both an interactive multi-column Kanban pipeline view and a structured, sortable tabular list view.
- **FR-LM-03**: The system shall support moving leads across sequential pipeline stages: *New Lead*, *Contacted*, *Waiting Reply*, *Warm Lead*, *Proposal Sent*, *At Risk*, *Won*, and *Lost*.
- **FR-LM-04**: The system shall allow editing, archiving, and permanent deletion of existing lead records.
- **FR-LM-05**: The system shall automatically compute and display the elapsed time since the most recent contact event for each lead.

#### Module 2: Follow-Up Management (Base CRM)
- **FR-FM-01**: The system shall allow the user to schedule follow-up tasks linked to an active lead, specifying due date, urgency level (*Low*, *Medium*, *High*), and outreach objective.
- **FR-FM-02**: The system shall automatically categorize and visually badge follow-ups as *Due Today*, *Overdue*, or *Upcoming*.
- **FR-FM-03**: The system shall allow the user to mark a follow-up action as completed, prompting the user to record interaction notes and update the associated lead's contact timestamp.
- **FR-FM-04**: The system shall maintain an append-only historical activity log of all completed follow-up interactions linked to the lead profile.

#### Module 3: Proposal Tracking (Base CRM)
- **FR-PT-01**: The system shall allow the user to record client proposals with an associated lead, proposal title, quoted financial amount, delivery date, and decision deadline.
- **FR-PT-02**: The system shall track proposal statuses across states: *Draft*, *Sent*, *Under Review*, *Accepted*, and *Declined*.
- **FR-PT-03**: When a proposal is marked as *Accepted*, the system shall prompt the user to automatically advance the corresponding lead to the *Won* stage.

#### Module 4: Client Management (Base CRM)
- **FR-CM-01**: The system shall automatically generate a permanent Client Record upon marking a lead as *Won*, migrating historical communication notes and project scope.
- **FR-CM-02**: The system shall allow manual creation, updating, and archiving of client records independently of the lead pipeline.
- **FR-CM-03**: The system shall aggregate and display cumulative lifetime revenue and relationship duration for each client record.
- **FR-CM-04**: The system shall support recording client relationship status indicators (*Active*, *Inactive*, *High Attention*).

#### Module 5: Pricing Estimation (Base CRM)
- **FR-PE-01**: The system shall provide an interactive pricing estimator accepting scoping variables: expected duration, deliverable complexity, client commercial scale, and desired margin.
- **FR-PE-02**: The system shall calculate a recommended pricing band displaying *Minimum*, *Target*, and *Premium* fee suggestions based on the scoping inputs.
- **FR-PE-03**: The system shall allow saving calculated pricing estimates and attaching them directly to an active lead or proposal draft.

#### Module 6: Dashboard & Analytics (Base CRM)
- **FR-DB-01**: The system shall compute and display real-time executive metrics: Total Active Pipeline Value, Total Won Revenue, Conversion Win Rate percentage, and Active Follow-Up counts.
- **FR-DB-02**: The system shall render graphical distribution charts illustrating pipeline stage density and revenue forecasting by month.
- **FR-DB-03**: The system shall present an actionable *Quick Actions / Today* pane highlighting overdue follow-ups and aging proposals.

#### Module 7: Account & Settings (Base CRM)
- **FR-AS-01**: The system shall support user profile configuration, including display name, freelance business domain, and default currency symbol.
- **FR-AS-02**: The system shall provide an on-demand data export engine generating complete workspace archives in structured CSV and JSON formats.
- **FR-AS-03**: The system shall support secure account closure and data purging in compliance with data privacy regulations.

#### Module 8: Subscription Management (Base CRM)
- **FR-SM-01**: The system shall display the user's active subscription tier (*Free* or *Pro*), current billing cycle (*Monthly* or *Yearly*), and next renewal date.
- **FR-SM-02**: The system shall provide an upgrade interface that initializes a secure checkout order with the Payment Gateway upon user confirmation.
- **FR-SM-03**: The system shall provision access to Pro capabilities immediately upon receipt and cryptographic HMAC signature verification of a successful checkout webhook from the Payment Gateway.
- **FR-SM-04**: The system shall support plan downgrade and cancellation, maintaining Pro feature access until the end of the currently paid billing period.

#### Module 9: AI-Assisted Selling (Phase 2 Planned Extension)
- **FR-AI-01 (Deal Radar Prioritization)**:
  - *Input Contract*: List of active leads with stage duration, last contact timestamp, estimated deal value, and recent activity history.
  - *System Action*: The system shall compute an engagement and momentum score for each active lead, ranking opportunities on a visual "Deal Radar" component.
  - *Output Contract*: An ordered priority list with visual momentum badges (*Hot*, *Steady*, *Cooling*, *At Risk*) highlighting the top 3 deals requiring immediate action today.
- **FR-AI-02 (Personalized Pricing Recommendations)**:
  - *Input Contract*: Project scope inputs, deliverable requirements, client commercial category, and historical win/loss data from past proposals.
  - *System Action*: The system shall analyze the inputs against historical patterns to suggest a calibrated pricing proposal range.
  - *Output Contract*: Recommended pricing tiers accompanied by natural-language rationale explaining value positioning and risk considerations.
- **FR-AI-03 (Computed Client Health Scoring)**:
  - *Input Contract*: Client communication frequency, elapsed days since last project completion, and invoice payment timeliness.
  - *System Action*: The system shall compute a relationship vitality score categorized into qualitative health states (*Thriving*, *Stable*, *Needs Attention*, *At Risk*).
  - *Output Contract*: Visual health badge on the client profile card with actionable retention recommendations for accounts flagged as *Needs Attention* or *At Risk*.
- **FR-AI-04 (Context-Aware Follow-Up Drafting)**:
  - *Input Contract*: Selected lead's name, company, recent interaction history, last proposal details, and outreach goal.
  - *System Action*: The system shall generate a professional, contextually relevant follow-up message draft tailored to the lead's current stage and conversation context.
  - *Output Contract*: An editable text draft pre-populated into a review modal, categorized by suggested tone (*Friendly Check-In*, *Value-Add Resource*, *Decision Prompt*).
- **FR-AI-05 (Mandatory Human-in-the-Loop Review)**:
  - *Specification*: The system shall present all AI-drafted follow-up messages for explicit user inspection. The system **shall not** transmit any message to an external contact without explicit, manual confirmation by the user. The user shall be able to edit the draft freely or discard it with one click.
- **FR-AI-06 (Automated Weekly Revenue Debrief)**:
  - *Input Contract*: Pipeline transitions, won deals, lost opportunities, and logged follow-up actions recorded during the preceding 7 calendar days.
  - *System Action*: The system shall generate an asynchronous weekly summary report analyzing sales velocity, closed revenue, dropped opportunities, and upcoming priorities for the week ahead.
  - *Output Contract*: A structured debrief rendered on the Dashboard and delivered via user notification, featuring key wins, revenue summary, and top 3 recommended focus areas.

---

### 3.3 Non-Functional Requirements

#### 3.3.1 Performance Requirements
- **NFR-PERF-01**: The initial application bundle download and first contentful paint shall complete in under 2.0 seconds over standard 4G broadband connections.
- **NFR-PERF-02**: Client-side stage transitions, search queries, and filtering across up to 1,000 lead records shall execute within 100 milliseconds without UI lag.
- **NFR-PERF-03**: Standard database synchronization calls shall complete within 500 milliseconds under nominal cloud service operating conditions.

#### 3.3.2 Security & Privacy Requirements
- **NFR-SEC-01**: All data in transit shall be encrypted using TLS 1.3; all data at rest shall be encrypted using AES-256 in the managed data store.
- **NFR-SEC-02**: Multi-tenant data isolation shall be strictly enforced at the database layer via Row Level Security (RLS), verifying caller identity on every database query.
- **NFR-SEC-03**: Payment credentials shall never transit the application client or backend store; checkout operations shall occur strictly within the Payment Gateway's isolated modal.
- **NFR-SEC-04**: All external webhook requests shall be cryptographically validated using HMAC-SHA256 signature verification prior to updating subscription states.
- **NFR-SEC-05 (Data Minimization for AI)**: Data transmitted to the hosted AI provider shall be strictly minimized to functional context (e.g. stage, notes, timeline) and shall exclude unnecessary personally identifiable information.

#### 3.3.3 Software Quality Attributes
- **NFR-QUAL-01 (Usability & Accessibility)**: The UI shall comply with WCAG 2.1 Level AA standards, ensuring full keyboard navigability and high-contrast legibility. Core user flows shall require no more than three clicks from the main dashboard.
- **NFR-QUAL-02 (Availability & Reliability)**: The application client shall maintain 99.9% uptime, with graceful client-side network offline detection preventing data loss during temporary disconnects.
- **NFR-QUAL-03 (Maintainability & Extensibility)**: The codebase shall enforce clean separation between UI components, state hooks, and service adapters. Adding new payment or AI providers shall require implementing standardized adapter interfaces without altering UI components.
- **NFR-QUAL-04 (Portability)**: The UI shall be fully responsive across desktop, tablet, and mobile viewports.

#### 3.3.4 AI-Specific Non-Functional Requirements
- **NFR-AI-01 (Inference Latency & Non-Blocking UI)**: AI draft generation requests shall return within 3.0 seconds under normal provider load. All AI operations shall execute asynchronously with visible loading states, never freezing or blocking the user interface.
- **NFR-AI-02 (Graceful Degradation)**: If the hosted AI provider is unavailable, times out (>5.0 seconds), or returns a rate-limit error, the system shall degrade gracefully: displaying an informative notification and allowing the user to compose messages manually. The base CRM shall remain 100% operational at all times.
- **NFR-AI-03 (Transparency & Visual Badging)**: Every AI-generated output (draft message, Deal Radar ranking, pricing suggestion, client health score) shall be visually distinguished with clear AI badging so users can always differentiate machine suggestions from user-authored data.
- **NFR-AI-04 (User Opt-Out Control)**: The system shall provide a global toggle in Account Settings allowing users to disable all AI features and revert entirely to the manual Base CRM workflow.

---

## 4. Use Case Specifications

The following tabular specifications expand every use case modeled in the system UML diagrams:
- Base CRM: Use Cases `UC-01` through `UC-12` ([UML.md Section 1](UML.md#1-use-case-diagram--base-crm-phase-1-foundation)).
- AI-Assisted Selling: Use Cases `UC-13` through `UC-18` ([UML.md Section 10](UML.md#10-extended-use-case-diagram--ai-assisted-selling-phase-2)).

### UC-01: Authenticate User Session
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Identity Provider |
| **Preconditions** | User has a supported browser and network connection. |
| **Main Flow** | 1. User navigates to sign-in screen and enters credentials (or selects OAuth provider).<br>2. SoloOS dispatches authentication request to Identity Provider.<br>3. Identity Provider verifies credentials and returns secure session JWT.<br>4. SoloOS establishes local authenticated session and loads user workspace. |
| **Postconditions** | User is authenticated; private workspace is accessible. |

### UC-02: Manage Lead Pipeline
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated (`«include» UC-01`). |
| **Main Flow** | 1. User navigates to Pipeline view.<br>2. User creates a new lead or selects an existing lead card.<br>3. User modifies lead parameters or drags the card to advance pipeline stage.<br>4. System updates lead stage timestamp and recalculates pipeline metrics. |
| **Postconditions** | Lead stage is persisted; updated pipeline values reflect across dashboard. |

### UC-03: Track Follow-Up Actions
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated (`«include» UC-01`); at least one lead exists. |
| **Main Flow** | 1. User schedules a follow-up task specifying due date, urgency, and goal.<br>2. System surfaces due tasks in the daily priority queue.<br>3. User performs outreach and clicks "Mark Complete".<br>4. User records interaction notes in the completion dialog. |
| **Postconditions** | Follow-up is logged in lead activity history; next due date is scheduled. |

### UC-04: Generate Pricing Estimate
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated. |
| **Main Flow** | 1. User opens Pricing Estimator tool.<br>2. User inputs project timeline, deliverable complexity, client tier, and margin.<br>3. System calculates and displays recommended pricing band (*Minimum*, *Target*, *Premium*).<br>4. User saves estimate and links it to an active lead. |
| **Postconditions** | Pricing estimate is saved to the lead record. |

### UC-05: Track Proposals
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated (`«include» UC-01`); active lead exists. |
| **Main Flow** | 1. User creates proposal record with quoted amount and decision deadline.<br>2. User updates proposal status as negotiations evolve.<br>3. If marked *Accepted*, system prompts user to convert deal to Won (`«extend» UC-02`). |
| **Postconditions** | Proposal status is updated; win rate analytics update accordingly. |

### UC-06: Manage Client Records
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated. |
| **Main Flow** | 1. User navigates to Clients view.<br>2. User inspects automatically converted clients or manually adds a client.<br>3. User updates client health indicators and reviews cumulative revenue history. |
| **Postconditions** | Client profile is updated with lifetime revenue totals. |

### UC-07: View Dashboard Summary
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated (`«include» UC-01`). |
| **Main Flow** | 1. User accesses Dashboard view.<br>2. System aggregates active pipeline value, win rate, and overdue follow-ups.<br>3. User reviews high-priority action items for the day. |
| **Postconditions** | Accurate summary of solo business state is rendered. |

### UC-08: Export Workspace Data
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated with existing workspace data. |
| **Main Flow** | 1. User navigates to Settings > Data Management.<br>2. User selects Export Data and specifies format (CSV or JSON).<br>3. System compiles leads, follow-ups, proposals, and clients into an archive file.<br>4. Browser initiates file download. |
| **Postconditions** | User receives a portable, structured copy of workspace records. |

### UC-09: Manage Account Settings
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated. |
| **Main Flow** | 1. User opens Account Settings.<br>2. User updates profile attributes, default currency, or toggles AI features.<br>3. System validates input and persists settings. |
| **Postconditions** | Account settings are updated and applied immediately. |

### UC-10: View Subscription Plans
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | User is authenticated. |
| **Main Flow** | 1. User clicks "Upgrade to Pro" or navigates to Settings > Subscription.<br>2. System displays Free vs. Pro comparison table and billing cycle toggle. |
| **Postconditions** | Subscription tier options and active plan status are displayed. |

### UC-11: Upgrade Subscription Tier
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Payment Gateway |
| **Preconditions** | User is on Free tier (`«include» UC-12`). |
| **Main Flow** | 1. User selects Pro plan and clicks "Proceed to Checkout".<br>2. Application requests checkout order from serverless function.<br>3. Serverless function initializes order with Payment Gateway and returns public token.<br>4. Client renders Payment Gateway modal.<br>5. User completes payment instrumentation.<br>6. Gateway triggers client callback and transmits signed confirmation webhook. |
| **Postconditions** | Checkout is submitted; application transitions to awaiting webhook confirmation. |

### UC-12: Process Payment Checkout
| Attribute | Specification |
|---|---|
| **Primary Actor** | Payment Gateway |
| **Supporting Actor**| SoloOS Serverless Function |
| **Preconditions** | User submitted payment instrumentation in gateway modal. |
| **Main Flow** | 1. Payment Gateway transmits signed HTTP POST webhook to serverless endpoint.<br>2. Serverless function validates HMAC-SHA256 signature.<br>3. Serverless function updates user's subscription record to Active Pro.<br>4. Client application detects active Pro status and unlocks premium features. |
| **Postconditions** | User account is upgraded to Pro; transaction receipt is logged. |

### UC-13: View Prioritized Deal Radar
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Hosted AI Provider |
| **Preconditions** | User is authenticated; active leads exist in workspace. |
| **Main Flow** | 1. User navigates to Pipeline or Dashboard view.<br>2. Application requests Deal Radar ranking from AI Orchestration Service.<br>3. Service computes momentum scores using historical stage velocities.<br>4. System renders prioritized Deal Radar displaying top opportunities and momentum badges. |
| **Postconditions** | Leads are prioritized with actionable momentum indicators. |

### UC-14: Request Personalized Pricing Suggestion
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Hosted AI Provider |
| **Preconditions** | User opens Pricing Estimator tool. |
| **Main Flow** | 1. User inputs project scope parameters and clicks "Get AI Recommendation".<br>2. System sends sanitized scoping context to AI Orchestration Service.<br>3. Hosted AI provider returns calibrated pricing recommendation with positioning rationale.<br>4. System renders pricing suggestions with editable justification notes. |
| **Postconditions** | Personalized pricing recommendation is displayed for user review. |

### UC-15: Evaluate Client Health Score
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Hosted AI Provider |
| **Preconditions** | User navigates to Clients directory. |
| **Main Flow** | 1. System submits client interaction metrics to AI Orchestration Service.<br>2. Service computes relationship health score (*Thriving*, *Stable*, *Needs Attention*, *At Risk*).<br>3. System renders visual health badges on client cards with retention recommendations. |
| **Postconditions** | Client health scores and retention tips are displayed. |

### UC-16: Draft AI Follow-Up Message
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Hosted AI Provider |
| **Preconditions** | User selects a due follow-up task. |
| **Main Flow** | 1. User clicks "Draft with AI" on the follow-up task card.<br>2. Application gathers lead context (stage, last contact date, notes) and calls AI Service.<br>3. Hosted AI Provider generates a tailored message draft.<br>4. System presents the generated draft inside an interactive review modal. |
| **Postconditions** | AI draft is loaded into review modal awaiting human approval (`«include» UC-17`). |

### UC-17: Review and Approve AI Draft
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Preconditions** | AI draft has been generated (`«include» UC-16`). |
| **Main Flow** | 1. User reviews the AI-generated message draft in the modal.<br>2. User optionally edits text, adjusts tone, or adds specific details (`«extend» UC-17`).<br>3. User clicks "Approve & Copy/Send".<br>4. System records the message in the lead's activity history and marks the follow-up task complete. |
| **Postconditions** | Message is confirmed by the human user; follow-up task is marked complete. |

### UC-18: Generate Weekly Revenue Debrief
| Attribute | Specification |
|---|---|
| **Primary Actor** | Freelancer / User |
| **Supporting Actor**| Hosted AI Provider |
| **Preconditions** | User accesses Dashboard at the conclusion of a 7-day tracking window. |
| **Main Flow** | 1. System aggregates the past 7 days of pipeline activity, won revenue, and lost deals.<br>2. AI Orchestration Service synthesizes the activity into an executive debrief.<br>3. System displays the Weekly Revenue Debrief on the Dashboard with wins, losses, and focus areas. |
| **Postconditions** | Weekly revenue debrief is rendered and archived for reference. |

---

## 5. Appendices & UML References

All diagrams supporting this specification are maintained in the authoritative UML specification document:
- **Phase 1 Use Case Diagram**: [docs/UML.md Section 1](UML.md#1-use-case-diagram--base-crm-phase-1-foundation)
- **Conceptual Domain Class Model**: [docs/UML.md Section 2](UML.md#2-conceptual-class-diagram-domain-model)
- **Logical Entity Relationship Model**: [docs/UML.md Section 3](UML.md#3-entity-relationship-diagram-logical-not-physical-schema)
- **Lead-to-Client Sequence Flow**: [docs/UML.md Section 4](UML.md#4-sequence-diagram--lead-to-client-core-flow)
- **Subscription Checkout Sequence Flow**: [docs/UML.md Section 5](UML.md#5-sequence-diagram--subscription-checkout-flow)
- **Lead Lifecycle State Model**: [docs/UML.md Section 6](UML.md#6-state-diagram--lead-lifecycle)
- **Subscription Lifecycle State Model**: [docs/UML.md Section 7](UML.md#7-state-diagram--subscription-lifecycle)
- **Component Architecture (Base)**: [docs/UML.md Section 8](UML.md#8-component--architecture-diagram-logical)
- **Phase 1 to Phase 2 Roadmap**: [docs/UML.md Section 9](UML.md#9-roadmap--phase-1-to-phase-2)
- **Phase 2 Extended Use Case Diagram**: [docs/UML.md Section 10](UML.md#10-extended-use-case-diagram--ai-assisted-selling-phase-2)
- **Phase 2 Extended Architecture (AI Service Layer)**: [docs/UML.md Section 11](UML.md#11-extended-architecture--ai-service-layer)
- **Phase 2 AI Follow-Up Drafting Sequence Flow**: [docs/UML.md Section 12](UML.md#12-sequence-diagram--ai-assisted-follow-up-drafting)
