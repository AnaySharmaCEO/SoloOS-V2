# SoloOS — Data Flow Diagrams (DFD)

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM Data Flow Diagrams (Level 0 and Level 1) |
| 0.2 | September 12, 2026 | Anay Sharma | Extended Level 0 Context and Level 1 DFD with AI Assistance Subsystem |

---

## 1. Introduction & DFD Modeling Notation

Data Flow Diagrams (DFDs) represent the functional perspective of **SoloOS** using structured analysis methodologies. Distinct from Unified Modeling Language (UML) object-oriented diagrams, DFDs trace how data enters the system, transforms through discrete processes, moves between conceptual data stores, and returns to external entities.

### 1.1 Standard DFD Notational Conventions (Gane & Sarson Approximation in Mermaid)
- **External Entities (Source / Sink)**: Represented as rectangular nodes (`[Entity]`). These are agents outside the system boundary that supply or consume data.
- **Processes**: Represented as rounded rectangles (`(Process)`). These perform data transformations or business computations.
- **Data Stores**: Represented as bracketed database blocks (`[(Data Store)]`). These represent persistent collections of business records at a conceptual level (never physical SQL tables).
- **Data Flows**: Represented as labeled directional arrows (`-->|Data Item|`) indicating information movement.

---

## 2. Level 0: Context Diagram (System Overview)

The Level 0 Context Diagram establishes the total system boundary for SoloOS as a single process interacting with four external entities: the Freelancer (User), the Identity Provider, the Payment Gateway, and the Hosted AI Provider.

```mermaid
flowchart TD
    %% External Entities
    E_USER[Freelancer / User]
    E_AUTH[Identity Provider]
    E_PAY[Payment Gateway]
    E_AI[Hosted AI Provider]

    %% SoloOS Single Process
    P0((0.0 SoloOS System Boundary))

    %% User Data Flows
    E_USER -->|Credentials & Session Requests| P0
    P0 -->|Dashboard Views, Pipeline States & Action Prompts| E_USER
    E_USER -->|Lead Data, Follow-Up Logs & Proposal Details| P0
    P0 -->|Exported CSV / JSON Workspace Archives| E_USER
    E_USER -->|AI Draft Review & Message Approval Decisions| P0

    %% Identity Provider Data Flows
    P0 -->|Auth Credentials Verification| E_AUTH
    E_AUTH -->|Signed JWT Identity Tokens| P0

    %% Payment Gateway Data Flows
    P0 -->|Order Initialization Request| E_PAY
    E_PAY -->|Checkout Order Reference & Public Key| P0
    E_PAY -->|Signed Payment Webhook Event Payload| P0

    %% Hosted AI Provider Data Flows
    P0 -->|Sanitized Sales Context & Scoping Parameters| E_AI
    E_AI -->|Generated Message Drafts & Scoring Outputs| P0
```

---

## 3. Level 1: Subsystem Data Flow Decomposition

The Level 1 DFD decomposes the central process `0.0` into six core functional subsystems, illustrating inter-process data exchange and interactions with five conceptual data stores.

### Subsystems (Processes)
- **1.0 Lead Management**: Captures, validates, and updates lead pipeline records.
- **2.0 Follow-Up Tracking**: Calculates due dates, surfaces urgency alerts, and logs completed outreach.
- **3.0 Pricing & Proposals**: Computes scoping price bands and tracks sent client proposals.
- **4.0 Client Management**: Ingests converted won leads into permanent client relationship records.
- **5.0 Subscription & Billing**: Manages checkout sessions and verifies webhook events.
- **6.0 AI Assistance Engine**: Computes Deal Radar rankings, client health scores, personalized pricing, and follow-up drafts with mandatory human-in-the-loop review.

### Conceptual Data Stores
- **D1 Lead Store**: Persistent lead entities, stages, contact histories, and notes.
- **D2 Follow-Up Store**: Scheduled outreach tasks, urgency classifications, and activity logs.
- **D3 Proposal & Pricing Store**: Pricing calculation scopes, quotes, and contract statuses.
- **D4 Client Store**: Permanent client accounts, relationship health, and cumulative revenue.
- **D5 Subscription Store**: User subscription tiers, billing cycles, and renewal timestamps.

```mermaid
flowchart TD
    %% External Entities
    L1_USER[Freelancer / User]
    L1_PAY[Payment Gateway]
    L1_AI[Hosted AI Provider]

    %% Conceptual Data Stores
    D1[(D1: Lead Store)]
    D2[(D2: Follow-Up Store)]
    D3[(D3: Proposal & Pricing Store)]
    D4[(D4: Client Store)]
    D5[(D5: Subscription Store)]

    %% Processes
    P1(1.0 Lead Management)
    P2(2.0 Follow-Up Tracking)
    P3(3.0 Pricing & Proposals)
    P4(4.0 Client Management)
    P5(5.0 Subscription & Billing)
    P6(6.0 AI Assistance Engine)

    %% Lead Management Flows
    L1_USER -->|New Lead Details & Stage Moves| P1
    P1 -->|Store Lead Records| D1
    D1 -->|Active Lead Data| P1
    P1 -->|Render Pipeline Views| L1_USER
    P1 -->|Won Lead Transition Event| P4

    %% Follow-Up Tracking Flows
    L1_USER -->|Schedule / Complete Follow-Up| P2
    P2 -->|Store Follow-Up Tasks| D2
    D2 -->|Due Follow-Ups & Urgency Badges| P2
    P2 -->|Action Items & Alerts| L1_USER
    D1 -->|Lead Contact Context| P2

    %% Pricing & Proposals Flows
    L1_USER -->|Project Scoping Parameters| P3
    P3 -->|Store Estimates & Proposals| D3
    D3 -->|Proposal Records| P3
    P3 -->|Pricing Bands & Proposal Trackers| L1_USER

    %% Client Management Flows
    P4 -->|Create / Update Client Records| D4
    D4 -->|Client Profiles & Revenue Metrics| P4
    P4 -->|Lifetime Client Summaries| L1_USER

    %% Subscription & Billing Flows
    L1_USER -->|Upgrade Plan Selection| P5
    P5 -->|Order Requests| L1_PAY
    L1_PAY -->|Signed Webhook Event| P5
    P5 -->|Upsert Subscription Status| D5
    D5 -->|Active Tier Entitlements| P5
    P5 -->|Unlocked Pro Capabilities| L1_USER

    %% AI Assistance Engine Flows
    D1 -->|Sanitized Lead History| P6
    D2 -->|Interaction Timestamps| P6
    D3 -->|Historical Won Quotes| P6
    D4 -->|Client Communication Recency| P6
    P6 -->|Sanitized Context Payload| L1_AI
    L1_AI -->|Generated Drafts & Scores| P6
    P6 -->|Deal Radar & Draft Messages for Review| L1_USER
    L1_USER -->|Human Approved / Edited Drafts| P6
    P6 -->|Record Approved Outreach Log| D2
```

---

## 4. Data Dictionary Cross-Reference

All data elements and data store attributes depicted in these diagrams are formally defined in [docs/10_Data_Dictionary.md](10_Data_Dictionary.md).
