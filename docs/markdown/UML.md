# SoloOS — UML Diagrams

**Status:** Diagrams 1-8 document **Phase 1 (Base CRM)**, the completed
foundation. Diagrams 9-12 document **Phase 2 (AI-Powered CRM)**, the
in-progress extension that adds AI-assisted selling capabilities on top
of that foundation — kept as separate, additional diagrams rather than
edits to 1-8, so the evolution of the system is visible rather than
overwritten (see `doc_creation.md`, Rule 6).

All diagrams are logical/conceptual by intent — they describe entities,
behavior, and flow, not literal database tables, columns, or internal
service implementations, and (for Phase 2) not actual prompts, model
names, or fabricated accuracy figures. This is deliberate: these
diagrams are safe to keep in a public/academic repo alongside UI code
without exposing schema, business-rule, or AI-implementation internals.
See `doc_creation.md` for the rules this follows.

All diagrams are Mermaid — they render natively on GitHub/GitLab and most
IDEs with a Mermaid plugin. Every node/participant/class ID below is
unique across the *entire document*, not just within its own diagram —
reusing short IDs like `App` or `User` across multiple diagrams on the
same page is a common, well-documented cause of later diagrams silently
failing to render when several Mermaid blocks share one page.

---

## Part 1 — Phase 1: Base CRM (foundation, complete)

## 1. Use Case Diagram — Base CRM (Phase 1 Foundation)

Follows standard UML Use Case modeling conventions:
- **System Boundary**: A clearly defined boundary rectangle enclosing internal application capabilities.
- **Actors**: External entities placed outside the boundary (Primary Actor on the left; Secondary/Supporting Systems on the right).
- **Use Cases**: High-level action-oriented goals represented as ovals (`([Use Case])`) inside the boundary.
- **Associations**: Solid lines (`---`) representing participation without directional arrows.
- **Dependencies**: Dashed arrows indicating `«include»` (mandatory prerequisite) and `«extend»` (conditional/optional addition).

```mermaid
flowchart LR
    %% Primary Actor
    ucFreelancer((Freelancer or User))

    %% Secondary / Supporting Actors
    ucAuth((Identity Provider))
    ucPayment((Payment Gateway))

    %% System Boundary
    subgraph ucSystem["SoloOS Application Boundary"]
        uc1([Authenticate User Session])
        uc2([Manage Lead Pipeline])
        uc3([Track Follow-Up Actions])
        uc4([Generate Pricing Estimate])
        uc5([Track Proposals])
        uc6([Manage Client Records])
        uc7([View Dashboard Summary])
        uc8([Export Workspace Data])
        uc9([Manage Account Settings])
        uc10([View Subscription Plans])
        uc11([Upgrade Subscription Tier])
        uc12([Process Payment Checkout])
        ucConvertLead([Convert Won Deal to Client])
    end

    %% Actor Associations (Solid Lines - No basic directional arrows)
    ucFreelancer --- uc1
    ucFreelancer --- uc2
    ucFreelancer --- uc3
    ucFreelancer --- uc4
    ucFreelancer --- uc5
    ucFreelancer --- uc6
    ucFreelancer --- uc7
    ucFreelancer --- uc8
    ucFreelancer --- uc9
    ucFreelancer --- uc10
    ucFreelancer --- uc11

    %% Secondary Actor Connections
    uc1 --- ucAuth
    uc12 --- ucPayment

    %% Advanced Relationships: <<include>> (Mandatory Prerequisite)
    uc2 -.->|«include»| uc1
    uc3 -.->|«include»| uc1
    uc5 -.->|«include»| uc1
    uc7 -.->|«include»| uc1
    uc11 -.->|«include»| uc12

    %% Advanced Relationships: <<extend>> (Optional / Conditional Addition)
    ucConvertLead -.->|«extend»| uc2
```

---

## 2. Conceptual Class Diagram (domain model)

Attributes are described at a conceptual level (what the concept *is*),
not as literal column names or types — the physical schema is an
implementation detail that lives outside this documentation set.

```mermaid
classDiagram
    class cdUser {
        +identity
        +emailAddress
        +createdOn
    }

    class cdProfile {
        +displayName
        +role
        +businessStage
        +onboardingComplete
    }

    class cdLead {
        +name
        +stage
        +estimatedValue
        +source
        +lastContact
    }

    class cdFollowUp {
        +dueDate
        +urgency
        +status
        +reason
    }

    class cdClient {
        +accountHealth
        +totalRevenue
        +relationshipStartDate
    }

    class cdProposal {
        +amount
        +sentDate
        +status
    }

    class cdPricingEstimate {
        +projectScope
        +suggestedRange
        +generatedOn
    }

    class cdSubscription {
        +planTier
        +status
        +billingCycle
        +renewalDate
    }

    class cdPlan {
        +name
        +priceMonthly
        +priceYearly
        +featureSet
    }

    cdUser "1" -- "1" cdProfile : has
    cdUser "1" -- "many" cdLead : owns
    cdUser "1" -- "1" cdSubscription : has
    cdSubscription "many" --> "1" cdPlan : subscribes to
    cdLead "1" -- "many" cdFollowUp : generates
    cdLead "1" -- "many" cdProposal : receives
    cdLead "0..1" -- "0..1" cdClient : converts to
    cdLead "1" -- "many" cdPricingEstimate : priced via
```

---

## 3. Entity Relationship Diagram (logical, not physical schema)

```mermaid
erDiagram
    ER_USER ||--|| ER_PROFILE : has
    ER_USER ||--o{ ER_LEAD : owns
    ER_USER ||--|| ER_SUBSCRIPTION : has
    ER_SUBSCRIPTION }o--|| ER_PLAN : tier_of
    ER_LEAD ||--o{ ER_FOLLOWUP : generates
    ER_LEAD ||--o{ ER_PROPOSAL : receives
    ER_LEAD ||--o{ ER_PRICING_ESTIMATE : priced_via
    ER_LEAD |o--o| ER_CLIENT : converts_to
```

*Note: this describes relationships and cardinality only. Primary/foreign
key names, indexes, and constraints are physical schema detail and are
intentionally excluded — see `doc_creation.md`, Rule 2.*

---

## 4. Sequence Diagram — Lead-to-Client Core Flow

```mermaid
sequenceDiagram
    actor S4User as User
    participant S4App as SoloOS App
    participant S4Svc as Application Service Layer
    participant S4Store as Backend Data Store

    S4User->>S4App: Add new lead
    S4App->>S4Svc: submit lead details
    S4Svc->>S4Store: persist lead
    S4Store-->>S4Svc: confirmation
    S4Svc-->>S4App: lead created
    S4App-->>S4User: show lead in pipeline

    loop Follow-up cycle
        S4Svc->>S4Svc: evaluate follow-up timing rules
        S4Svc-->>S4App: surface due follow-up
        S4App-->>S4User: prompt follow-up action
        S4User->>S4App: log contact or send follow-up
        S4App->>S4Svc: record contact for lead
        S4Svc->>S4Store: update lead activity
    end

    S4User->>S4App: Mark lead as Won
    S4App->>S4Svc: convert lead to client
    S4Svc->>S4Store: create client record, update lead stage
    S4Store-->>S4Svc: confirmation
    S4Svc-->>S4App: client created
    S4App-->>S4User: show client in client list
```

---

## 5. Sequence Diagram — Subscription Checkout Flow

```mermaid
sequenceDiagram
    actor S5User as User
    participant S5App as SoloOS App
    participant S5Fn as Serverless Function Layer
    participant S5PG as Payment Gateway
    participant S5Store as Backend Data Store

    S5User->>S5App: Select Upgrade to Pro
    S5App->>S5Fn: request checkout for plan and cycle
    S5Fn->>S5PG: create payment order, server-side
    S5PG-->>S5Fn: order reference
    S5Fn-->>S5App: order reference plus public key
    S5App->>S5PG: open checkout widget
    S5User->>S5PG: complete payment
    S5PG-->>S5App: client-side success callback, UX only
    S5App-->>S5User: show Confirming your upgrade

    S5PG->>S5Fn: webhook - payment confirmed and signed
    S5Fn->>S5Fn: verify signature
    S5Fn->>S5Store: upsert subscription status
    S5Store-->>S5Fn: confirmation

    S5App->>S5Fn: refetch subscription status
    S5Fn->>S5Store: read subscription
    S5Store-->>S5Fn: current status
    S5Fn-->>S5App: plan is Pro
    S5App-->>S5User: show unlocked features
```

*Note: the webhook path is the only trusted source of truth for payment
confirmation — the client-side callback only drives UI feedback. See the
Architecture / System Design Document for the reasoning.*

---

## 6. State Diagram — Lead Lifecycle

```mermaid
stateDiagram-v2
    [*] --> L6NewLead
    L6NewLead --> L6Contacted
    L6Contacted --> L6WaitingReply
    L6WaitingReply --> L6WarmLead
    L6WaitingReply --> L6AtRisk
    L6WarmLead --> L6ProposalSent
    L6AtRisk --> L6Contacted
    L6ProposalSent --> L6Won
    L6ProposalSent --> L6Lost
    L6Won --> [*]
    L6Lost --> [*]
```

---

## 7. State Diagram — Subscription Lifecycle

```mermaid
stateDiagram-v2
    [*] --> L7Free
    L7Free --> L7PendingPayment : upgrade initiated
    L7PendingPayment --> L7Active : payment confirmed via webhook
    L7PendingPayment --> L7Free : payment failed or abandoned
    L7Active --> L7PastDue : renewal payment failed
    L7PastDue --> L7Active : payment recovered
    L7PastDue --> L7Canceled : grace period expired
    L7Active --> L7Canceled : user cancels
    L7Canceled --> L7Free : access downgraded
```

---

## 8. Component / Architecture Diagram (logical)

```mermaid
flowchart TB
    subgraph C8Client[Client Application - UI Layer]
        c8UI[Presentation Components]
        c8StateMgmt[Client-side State and Caching]
    end

    subgraph C8AppLayer[Application Service Layer]
        c8Services[Domain Services]
        c8Adapters[Integration Adapters]
    end

    subgraph C8Backend[Backend as a Service]
        c8AuthSvc[Identity and Auth]
        c8DataStore[(Managed Data Store)]
        c8Functions[Serverless Functions]
    end

    subgraph C8External[External Providers]
        c8PG[Payment Gateway]
        c8Mail[Email Provider]
        c8Msg[Messaging Provider]
    end

    c8UI --> c8StateMgmt --> c8Services
    c8Services --> c8Adapters
    c8Services --> c8AuthSvc
    c8Services --> c8DataStore
    c8Adapters --> c8Functions
    c8Functions --> c8DataStore
    c8Functions --> c8PG
    c8Functions --> c8Mail
    c8Functions --> c8Msg
```

*This diagram documents architectural layering and data-flow direction
only. It intentionally does not name specific tables, endpoints, or
vendor SDK calls — those belong in implementation-level docs outside this
repo, per `doc_creation.md`.*

---

## Part 2 — Phase 2: AI-Powered CRM (in progress)

The diagrams below specify what Phase 2 is adding, not what already
exists. Every AI capability shown here is planned, not built — see
`doc_creation.md`'s tense rule. Human review is deliberately shown as
part of every AI flow: the system drafts and suggests, the user decides.

## 9. Roadmap — Phase 1 to Phase 2

```mermaid
flowchart LR
    subgraph D9Phase1[Phase 1 - Base CRM - Complete]
        d9p1a[Lead Pipeline]
        d9p1b[Follow-Ups]
        d9p1c[Proposals and Clients]
        d9p1d[Pricing Estimator]
        d9p1e[Subscription Billing]
    end

    subgraph D9Phase2[Phase 2 - AI-Powered CRM - In Progress]
        d9p2a[Deal Radar]
        d9p2b[Personalized Pricing]
        d9p2c[Computed Client Health]
        d9p2d[AI Drafted Follow-Ups]
        d9p2e[Automated Revenue Debrief]
    end

    D9Phase1 --> D9Phase2
```

---

## 10. Extended Use Case Diagram — AI-Assisted Selling (Phase 2)

Additive to Diagram 1 — models the AI-assisted selling subsystem boundary, the primary freelancer actor, the secondary hosted AI provider, and the core AI use cases with explicit human-in-the-loop review semantics.

```mermaid
flowchart LR
    %% Primary Actor
    d10User((Freelancer or User))

    %% Secondary Supporting Actor
    d10AI((Hosted AI Provider))

    %% System Boundary
    subgraph d10System["SoloOS — AI-Assisted Selling Subsystem Boundary"]
        d10uc1([View Prioritized Deal Radar])
        d10uc2([Request Personalized Pricing Suggestion])
        d10uc3([Evaluate Client Health Score])
        d10uc4([Draft AI Follow-Up Message])
        d10uc5([Review and Approve AI Draft])
        d10uc6([Generate Weekly Revenue Debrief])
        d10ucManualEdit([Manually Edit Message Text])
    end

    %% Actor Associations (Solid Lines)
    d10User --- d10uc1
    d10User --- d10uc2
    d10User --- d10uc3
    d10User --- d10uc4
    d10User --- d10uc5
    d10User --- d10uc6

    %% Secondary Actor Associations (Backend Integration)
    d10uc1 --- d10AI
    d10uc2 --- d10AI
    d10uc3 --- d10AI
    d10uc4 --- d10AI
    d10uc6 --- d10AI

    %% Advanced Relationships: <<include>> (Mandatory Verification)
    d10uc5 -.->|«include»| d10uc4

    %% Advanced Relationships: <<extend>> (Optional Human Edit before Send)
    d10ucManualEdit -.->|«extend»| d10uc5
```

---

## 11. Extended Architecture — AI Service Layer

Additive to Diagram 8 — the same layering, with an AI Orchestration
Service added to the Application Service Layer and a Hosted AI Provider
added alongside the existing external providers. Kept as a full diagram
rather than an edit to Diagram 8 so both states of the architecture
remain visible.

```mermaid
flowchart TB
    subgraph D11Client[Client Application - UI Layer]
        d11UI[Presentation Components]
        d11State[Client-side State and Caching]
    end

    subgraph D11AppLayer[Application Service Layer]
        d11Services[Domain Services]
        d11Adapters[Integration Adapters]
        d11AIOrchestration[AI Orchestration Service]
    end

    subgraph D11Backend[Backend as a Service]
        d11Auth[Identity and Auth]
        d11Store[(Managed Data Store)]
        d11Functions[Serverless Functions]
    end

    subgraph D11External[External Providers]
        d11PG[Payment Gateway]
        d11Mail[Email Provider]
        d11Msg[Messaging Provider]
        d11AIProvider[Hosted AI Provider]
    end

    d11UI --> d11State --> d11Services
    d11Services --> d11Adapters
    d11Services --> d11AIOrchestration
    d11Services --> d11Auth
    d11Services --> d11Store
    d11Adapters --> d11Functions
    d11Functions --> d11Store
    d11Functions --> d11PG
    d11Functions --> d11Mail
    d11Functions --> d11Msg
    d11AIOrchestration --> d11Functions
    d11Functions --> d11AIProvider
```

*As with Diagram 8, this names a technology category ("Hosted AI
Provider"), not a specific vendor or model — consistent with
`doc_creation.md` Rule 2a.*

---

## 12. Sequence Diagram — AI-Assisted Follow-Up Drafting

```mermaid
sequenceDiagram
    actor S12User as User
    participant S12App as SoloOS App
    participant S12Svc as Application Service Layer
    participant S12AI as AI Orchestration Service
    participant S12Provider as Hosted AI Provider

    S12User->>S12App: Open due follow-up
    S12App->>S12Svc: request AI drafted message
    S12Svc->>S12AI: prepare context for lead
    S12AI->>S12Provider: request draft generation
    S12Provider-->>S12AI: suggested message
    S12AI-->>S12Svc: suggested message
    S12Svc-->>S12App: show suggested message
    S12App-->>S12User: display draft for review

    alt User approves as-is
        S12User->>S12App: approve draft
        S12App->>S12Svc: send follow-up using approved draft
    else User edits draft
        S12User->>S12App: edit message text
        S12App->>S12Svc: send follow-up using edited message
    end

    S12Svc-->>S12App: follow-up marked sent
    S12App-->>S12User: confirmation
```

*The user reviews and can edit every AI-drafted message before it sends
— nothing goes out on the user's behalf without confirmation. This is
the flow the AI Ethics and Data Privacy document (`doc_creation.md`,
document 17) should reference as the concrete mechanism behind its
"AI suggestions are advisory and human-reviewed" statement.*

