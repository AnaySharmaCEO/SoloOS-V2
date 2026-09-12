# SoloOS — System Design Document (SDD)

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM system architecture and module design |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI Service Layer, AI sequence flows, and provider abstraction |

---

## 1. Introduction & Design Goals

### 1.1 Purpose
This System Design Document (SDD) provides the complete architectural and technical specification for **SoloOS**. It translates the functional and non-functional requirements defined in [docs/02_SRS.md](02_SRS.md) into concrete software structures, subsystem interfaces, and data-flow models.

The system is architected across two coherent phases:
- **Phase 1 — Base CRM (Delivered Foundation)**: A decoupled, responsive Single Page Application interacting with a managed cloud Backend-as-a-Service (BaaS) and a third-party payment gateway.
- **Phase 2 — AI-Powered CRM (Planned Extension)**: An assistive intelligence extension introducing an AI Orchestration Service and Hosted AI Provider adapter to support Deal Radar ranking, personalized pricing, client health scoring, follow-up drafting, and revenue debriefs.

### 1.2 Design Goals
1. **Zero-Latency Perceived Performance**: Maintain sub-100ms client UI reactivity for pipeline navigation, search, and filtering via client-side caching and optimistic mutations.
2. **Strict Multi-Tenant Isolation**: Enforce cryptographic identity verification and database-level Row Level Security (RLS), guaranteeing complete isolation of freelancer business data.
3. **Zero-Footprint Payment Security**: Delegate all payment credential handling directly to PCI-DSS compliant checkout modals (SAQ-A scope minimization).
4. **Decoupled AI Provider Architecture**: Integrate external AI services strictly through an asynchronous serverless proxy with an Adapter pattern, preventing vendor lock-in and shielding client bundles from private credentials.
5. **Human-in-the-Loop AI Governance**: Structurally enforce human review for all generated outreach messages before transmission.
6. **Graceful Degradation**: Ensure that unexpected AI provider outages, rate limits, or latency spikes never impair core base CRM functionality.

### 1.3 Architectural Constraints
- **Client Architecture**: The client compiles to static HTML/JS/CSS distributable across edge Content Delivery Networks (CDNs).
- **Physical Schema Abstraction**: Physical database tables, column names, SQL scripts, and raw prompt engineering templates are encapsulated within internal serverless boundaries and excluded from public repositories.

---

## 2. High-Level Architecture Overview

SoloOS employs a modern, 4-tier decoupled cloud architecture comprising the Client Application Layer, Application Service Layer, Managed Backend-as-a-Service (BaaS), and External Cloud Providers.

For the formal UML diagrams, refer to [docs/UML.md Section 8 (Base Architecture)](UML.md#8-component--architecture-diagram-logical) and [docs/UML.md Section 11 (Extended AI Architecture)](UML.md#11-extended-architecture--ai-service-layer).

```
+--------------------------------------------------------------------------------+
|                        Client Application (UI Layer)                           |
|  +------------------------------+       +-----------------------------------+  |
|  |   Presentation Components    | <---> |   Client-Side State & Cache       |  |
|  |  (Kanban, Modals, Radar)     |       |       (TanStack Query)            |  |
|  +------------------------------+       +-----------------------------------+  |
+-----------------------------------|--------------------------------------------+
                                    |
                                    v
+--------------------------------------------------------------------------------+
|                           Application Service Layer                            |
|  +----------------------+  +---------------------+  +-----------------------+  |
|  |   Domain Services    |  | Integration Adapter |  | AI Orchestration Svc  |  |
|  | (Leads, Deals, Proj) |  | (Payment, Messaging)|  | (Context & Prompts)   |  |
|  +----------------------+  +---------------------+  +-----------------------+  |
+-------------------|-------------------|-------------------------|--------------+
                    |                   |                         |
                    v                   v                         v
+-----------------------------------+ +------------------------------------------+
|      Managed Backend (BaaS)       | |            External Providers            |
|  - Identity & Auth (JWT)          | |  - Third-Party Payment Gateway           |
|  - Managed PostgreSQL (RLS)       | |  - Transactional Email Provider          |
|  - Serverless Edge Functions      | |  - Hosted AI Provider (LLM API)          |
+-----------------------------------+ +------------------------------------------+
```

### 2.1 Layer Responsibilities
- **Client Presentation Layer**: Component-driven SPA rendering reactive UI views. Handles input validation, local view states, drag-and-drop interactions, and AI review modals.
- **Client State & Cache Layer**: Mediates asynchronous network queries, manages optimistic cache updates, handles background revalidation, and monitors network online/offline status.
- **Application Service Layer**: Enforces business logic abstractions, data normalization mappers, payment adapter contracts, and AI orchestration pipelines.
- **Managed Backend Services (BaaS)**: Provides secure identity verification, managed relational persistence with row-level tenant isolation policies, and serverless edge compute runtimes.
- **External Providers**: Specialized cloud third parties, including Payment Gateways (checkout and webhooks), Email/Messaging providers, and Hosted AI Providers.

---

## 3. Module-Level Architectural Design

### 3.1 Lead Management Module
- **Purpose**: Manage the intake, organization, and progression of prospective client opportunities.
- **Responsibilities**: Validate new lead parameters; provide dual Kanban and tabular rendering; record stage transitions and contact timestamps.
- **Interactions**: Emits conversion events to the Client Management Module upon deal win; provides context to the AI Deal Radar.

### 3.2 Follow-Up Management Module
- **Purpose**: Prevent lost revenue from missed outreach opportunities.
- **Responsibilities**: Schedule outreach tasks by due date and urgency; calculate status badges (*Due Today*, *Overdue*, *Upcoming*); record completed activity logs.
- **Interactions**: Supplies lead activity history to the AI Orchestration Service for follow-up drafting.

### 3.3 Pricing Estimation Module
- **Purpose**: Provide structured, scoping-based pricing estimates for freelance projects.
- **Responsibilities**: Capture scope parameters (duration, deliverable complexity, client tier); compute recommended price bands (*Minimum*, *Target*, *Premium*); allow direct attachment to leads.
- **Interactions**: Feeds scoping data into the AI Personalized Pricing engine.

### 3.4 Proposal Tracking Module
- **Purpose**: Track sent client proposals, quotes, and contract decisions.
- **Responsibilities**: Log proposal amounts, sent dates, and decision deadlines; track status transitions (*Draft*, *Sent*, *Accepted*, *Declined*).
- **Interactions**: Triggers automatic deal advancement to *Won* upon proposal acceptance.

### 3.5 Client Management Module
- **Purpose**: Maintain long-term records and revenue histories for converted clients.
- **Responsibilities**: Ingest won leads into permanent client accounts; compute cumulative lifetime revenue; track account health indicators.
- **Interactions**: Provides historical project and payment data to the AI Client Health Scoring engine.

### 3.6 Dashboard & Analytics Module
- **Purpose**: Provide a high-level executive command center for daily solo operations.
- **Responsibilities**: Aggregate pipeline value, win rate percentages, closed revenue, and overdue action items; render pipeline stage distribution charts.
- **Interactions**: Surfaces the prioritized Deal Radar and the Weekly Revenue Debrief.

### 3.7 Account & Settings Module
- **Purpose**: Manage user identity, profile configurations, data export, and AI toggles.
- **Responsibilities**: Update profile settings; trigger full CSV/JSON data export; manage global AI feature enable/disable flags.
- **Interactions**: Interacts with Identity Provider and local data exporter utilities.

### 3.8 Subscription Management Module
- **Purpose**: Govern workspace monetization, tier access control (Free vs. Pro), and checkout.
- **Responsibilities**: Gate Pro features; initialize payment orders via serverless functions; process cryptographically signed webhooks.
- **Interactions**: Interfaces with the Payment Gateway Adapter and the serverless webhook verification function.

### 3.9 AI-Assisted Selling Module (Phase 2 Planned Extension)
- **Purpose**: Provide intelligent sales co-pilot capabilities without replacing human agency.
- **Responsibilities**:
  - *Deal Radar*: Synthesizes lead stage duration, deal value, and last contact date into prioritized opportunity rankings.
  - *Personalized Pricing*: Calibrates scoping inputs against historical win rates to recommend tailored rate ranges.
  - *Client Health Scoring*: Analyzes communication intervals and payment patterns to evaluate account churn risk.
  - *Follow-Up Message Drafting*: Generates customized outreach drafts based on lead history for human review.
  - *Weekly Revenue Debrief*: Synthesizes weekly pipeline movements into an actionable executive summary.
- **Interactions**: Dispatches sanitized request payloads to the serverless AI Orchestration Service; renders outputs in interactive, editable UI modals.

---

## 4. Data Flow Narratives & Sequence Specifications

### 4.1 Lead-to-Client Lifecycle Flow
*Reference: [docs/UML.md Section 4](UML.md#4-sequence-diagram--lead-to-client-core-flow)*

1. The user inputs a prospective lead in the UI. The Application Service Layer validates parameters and persists the lead to the managed backend data store.
2. The UI renders the new lead card in the *New Lead* pipeline stage.
3. The follow-up engine continuously tracks elapsed time against scheduled tasks. When outreach is due, an action prompt appears.
4. The user completes outreach and logs notes; the system updates the lead's contact timestamp.
5. Upon successful negotiation, the user marks the lead as *Won*. The service layer atomically marks the lead won, generates a permanent Client Record with historical context, and updates lifetime revenue metrics.

### 4.2 Subscription Checkout & Webhook Verification Flow
*Reference: [docs/UML.md Section 5](UML.md#5-sequence-diagram--subscription-checkout-flow)*

1. The user clicks "Upgrade to Pro". The client requests a checkout session from an authenticated serverless edge function.
2. The serverless function contacts the Payment Gateway API server-side to generate an authorized order reference and returns the reference with the public gateway client key.
3. The client opens the Payment Gateway checkout modal. The user completes payment inside the gateway's isolated iframe.
4. The Payment Gateway emits an asynchronous HTTP POST webhook to the serverless webhook endpoint with a signed HMAC-SHA256 signature header.
5. The serverless function cryptographically validates the signature. Upon verification, it updates the user's subscription record to *Active Pro* in the backend data store.
6. The client refetches subscription status and immediately unlocks Pro capabilities.

### 4.3 AI-Assisted Follow-Up Drafting Flow
*Reference: [docs/UML.md Section 12](UML.md#12-sequence-diagram--ai-assisted-follow-up-drafting)*

1. The user opens a due follow-up task and clicks "Draft with AI".
2. The client requests an AI draft from the Application Service Layer, which invokes the serverless AI Orchestration Service.
3. The AI Orchestration Service sanitizes the lead context (lead name, recent communication summary, current deal stage, objective) and constructs an internal completion request to the Hosted AI Provider.
4. The Hosted AI Provider returns a structured message draft to the AI Orchestration Service, which returns it to the client.
5. The client application renders the draft inside an **interactive review modal**.
6. **Human Decision Gate**:
   - *Option A (Approve as-is)*: The user clicks "Approve & Send", confirming the draft.
   - *Option B (Edit before send)*: The user modifies the draft text directly in the modal and clicks "Approve & Send".
   - *Option C (Discard)*: The user discards the draft and writes a message manually.
7. Upon human approval, the system logs the message to the lead activity history and marks the follow-up task complete.

---

## 5. State Machine Models

### 5.1 Lead Lifecycle State Model
*Reference: [docs/UML.md Section 6](UML.md#6-state-diagram--lead-lifecycle)*

```
[ New Lead ] ---> [ Contacted ] ---> [ Waiting Reply ] ---> [ Warm Lead ] ---> [ Proposal Sent ] ---> [ WON ]
                         ^                  |                                          |
                         |                  v                                          v
                         +----------- [ At Risk ]                                   [ LOST ]
```
Leads transition sequentially through qualification. Inactive leads enter *At Risk*, triggering priority outreach before returning to *Contacted* or transitioning to terminal *Won* or *Lost* states.

### 5.2 Subscription Lifecycle State Model
*Reference: [docs/UML.md Section 7](UML.md#7-state-diagram--subscription-lifecycle)*

```
[*] -> [ Free ] ---> [ Pending Payment ] ---> [ Active (Pro) ] ---> [ Past Due ]
          ^                     |                    |                   |
          |                     v                    v                   v
          +---------------------+-------------- [ Canceled ] <-----------+
```
Users initialize on the *Free* tier. Upgrades trigger *Pending Payment*, moving to *Active (Pro)* upon webhook verification. Failed renewals enter *Past Due* grace periods. Cancellations remain active until the billing period concludes, returning cleanly to *Free*.

---

## 6. Concrete Technology Stack & Rationale

| Architectural Tier | Selected Technology | Technical Rationale & Justification |
|---|---|---|
| **Front-End Framework** | **React 18 (TypeScript)** | Component modularity, strong compile-time type safety preventing runtime null pointer errors, and broad ecosystem support for headless accessible components. |
| **Build & Tooling** | **Vite** | Fast Hot Module Replacement (HMR) during development, efficient ES module bundling, and optimized static asset compilation via Rollup. |
| **Styling & Design System** | **Tailwind CSS + Radix UI + Lucide Icons** | Utility-first CSS eliminating stylesheet bloat, combined with headless, accessible primitives ensuring full WCAG AA compliance. |
| **Client State & Cache** | **TanStack Query (React Query)** | Manages server-state caching, automated background revalidation, optimistic mutation handling, and built-in offline synchronization. |
| **Managed BaaS Tier** | **Supabase (Managed PostgreSQL)** | Built-in JWT identity verification, relational persistence with native PostgreSQL Row Level Security (RLS) for tenant isolation, and automated cloud backups. |
| **Serverless Edge Compute** | **Deno / Edge Functions** | Globally distributed, low-latency execution for payment order creation, webhook verification, and AI orchestration without maintaining dedicated servers. |
| **Payment Gateway Adapter** | **Razorpay Adapter** | Native support for subscription billing, localized payment methods (cards, UPI, net banking), secure client modal, and cryptographically signed webhooks. |
| **Hosted AI Provider** | **Hosted Large Language Model API** | High-performance hosted AI API accessed via serverless proxy, delivering low latency for contextual drafting and ranking without self-hosted GPU infrastructure. |

---

## 7. Security, Compliance & Data Privacy Architecture

### 7.1 Multi-Tenant Isolation & Authentication
- User authentication generates short-lived, cryptographically signed JSON Web Tokens (JWT).
- Multi-tenancy is enforced at the PostgreSQL database engine layer via Row Level Security (RLS) policies. Every read, insert, update, and delete operation is evaluated against `auth.uid()`, preventing unauthorized cross-tenant data leakage.

### 7.2 Zero-Touch Payment PCI Compliance
- SoloOS adheres to PCI-DSS SAQ-A compliance minimization.
- Credit card instrumentation, CVVs, and banking details are entered exclusively within the Payment Gateway's isolated modal. No sensitive financial information ever transits or resides within SoloOS servers.

### 7.3 Cryptographic Webhook Authentication
- All incoming payment webhooks must present an `X-Signature` header containing an HMAC-SHA256 hash computed over the raw request payload using the shared webhook secret.
- The serverless function computes the hash and performs a constant-time cryptographic comparison before executing any database mutations. Unsigned or invalid requests are rejected with HTTP 400.

### 7.4 AI Data Minimization & Privacy Policy
In accordance with ethical AI standards (detailed in [docs/17_AI_Ethics_and_Data_Privacy.md](17_AI_Ethics_and_Data_Privacy.md)):
- **What is sent to the AI Provider**: Sanitized, category-level sales context only (deal stage, elapsed days since contact, general project scope parameters, and user-provided notes).
- **What is NEVER sent**: User credentials, payment tokens, raw email inbox credentials, client financial banking details, or full database dumps.
- **Model Training Exclusion**: All requests transmitted to the hosted AI provider are flagged with data-privacy headers ensuring enterprise zero-data-retention, preventing user data from being utilized for foundational model retraining.

---

## 8. Extensibility & Future Evolution

### 8.1 Dual Adapter Abstraction Pattern
To protect the system against single-vendor lock-in, both the Billing and AI subsystems implement the **Adapter Design Pattern**:

```
+------------------------------------+      +------------------------------------+
|        Billing Service             |      |       AI Orchestration Service     |
+------------------------------------+      +------------------------------------+
                  |                                           |
                  v                                           v
+------------------------------------+      +------------------------------------+
|    <<interface>> IBillingProvider  |      |      <<interface>> IAIProvider     |
| - createOrder()                    |      | - generateDraft()                  |
| - verifyWebhook()                  |      | - calculateDealRadar()             |
+------------------------------------+      +------------------------------------+
        ^                    ^                      ^                    ^
        |                    |                      |                    |
+---------------+    +---------------+      +---------------+    +---------------+
|RazorpayAdapter|    | StripeAdapter |      | HostedModelA  |    | HostedModelB  |
+---------------+    +---------------+      +---------------+    +---------------+
```

Adding or substituting payment processors or hosted AI models requires implementing the respective interface contract without modifying any client presentation components or core business hooks.
