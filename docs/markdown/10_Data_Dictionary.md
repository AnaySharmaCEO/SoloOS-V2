# SoloOS — Conceptual Data Dictionary

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM conceptual data dictionary |
| 0.2 | September 12, 2026 | Anay Sharma | Extended with Phase 2 AI entities (DealRadarRanking, ClientHealthScore, AIDraft) |

---

## 1. Introduction & Methodology

This Conceptual Data Dictionary defines the domain information model for **SoloOS**. In accordance with repository architecture rules (Rule 2), this document models domain entities, attributes, definitions, and generic data categories — **not** literal physical database column names, SQL types, or internal storage constraints.

### 1.1 Data Type Categories Used
- **Text**: Alphanumeric string representation.
- **Number**: Numeric representation (monetary currency values, counts, scores).
- **Date / Timestamp**: Calendar date and chronological timestamp values.
- **Enumerated Status**: Defined, finite set of standardized domain states.
- **Boolean**: Two-state truth value (True / False).

---

## 2. Core Domain Entities (Phase 1 Foundation)

### 2.1 Entity: User
Represents an authenticated solo freelancer or consultant who owns a workspace.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Identity Identifier** | Text | Unique conceptual token representing the authenticated user. |
| **Email Address** | Text | Primary communication email and account username. |
| **Created Timestamp** | Date / Timestamp | Date and time when the user registered the workspace. |

### 2.2 Entity: Profile
Represents business preferences and onboarding metadata associated with a user.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Display Name** | Text | Freelancer's public personal or studio business name. |
| **Business Role** | Text | Professional service specialization (e.g. Copywriter, Consultant). |
| **Default Currency** | Text | Preferred currency symbol (e.g. USD, EUR, INR) for financial displays. |
| **Onboarding Completed** | Boolean | Indicates whether the initial workspace setup steps have been completed. |
| **AI Features Enabled** | Boolean | User preference flag governing whether Phase 2 AI assistance is active. |

### 2.3 Entity: Lead
Represents a prospective sales opportunity or potential client in the pipeline.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Lead Name** | Text | Descriptive title or client project name for the opportunity. |
| **Contact Email** | Text | Email address of the primary prospect point of contact. |
| **Referral Source** | Text | Origin channel of the lead (e.g. Referral, Website, Inbound Email). |
| **Pipeline Stage** | Enumerated Status | Current qualification stage (*New Lead*, *Contacted*, *Waiting Reply*, *Warm Lead*, *Proposal Sent*, *At Risk*, *Won*, *Lost*). |
| **Estimated Value** | Number | Projected monetary value of the project if closed. |
| **Last Contact Date** | Date / Timestamp | Chronological timestamp of the most recent logged interaction. |
| **Stage Entry Date** | Date / Timestamp | Timestamp indicating when the lead entered its current pipeline stage. |
| **General Notes** | Text | Unstructured qualitative notes regarding client requirements. |

### 2.4 Entity: Follow-Up
Represents a scheduled outreach task or communication touchpoint tied to an active lead.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Due Date** | Date / Timestamp | Scheduled calendar date and time for the outreach action. |
| **Urgency Level** | Enumerated Status | Qualitative priority category (*Low*, *Medium*, *High*). |
| **Outreach Objective** | Text | Stated reason or agenda for the follow-up contact. |
| **Execution Status** | Enumerated Status | State of the task (*Pending*, *Overdue*, *Completed*, *Canceled*). |
| **Completion Notes** | Text | Recorded summary of the prospect's response after outreach is completed. |

### 2.5 Entity: Proposal
Represents a formal commercial quotation or contract delivered to a prospect.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Proposal Title** | Text | Identifying title of the proposal document. |
| **Quoted Amount** | Number | Formal total financial fee presented to the client. |
| **Sent Date** | Date / Timestamp | Date when the proposal was delivered to the prospect. |
| **Decision Deadline** | Date / Timestamp | Expected client decision or expiration date. |
| **Proposal Status** | Enumerated Status | State of the quote (*Draft*, *Sent*, *Under Review*, *Accepted*, *Declined*). |

### 2.6 Entity: Pricing Estimate
Represents a scoping calculation generated to determine viable project fee ranges.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Project Duration** | Number | Estimated project timeline in calendar weeks. |
| **Deliverable Complexity** | Enumerated Status | Scoping complexity factor (*Standard*, *Custom*, *Enterprise*). |
| **Client Commercial Tier**| Enumerated Status | Relative scale of client organization (*Startup*, *Mid-Market*, *Enterprise*). |
| **Minimum Rate** | Number | Calculated baseline fee floor to protect profitability. |
| **Target Rate** | Number | Recommended quote balancing win probability and profitability. |
| **Premium Rate** | Number | Suggested premium fee for high-margin positioning. |
| **Generated Timestamp** | Date / Timestamp | Date when the pricing estimate was computed. |

### 2.7 Entity: Client
Represents a converted lead with an active or historical commercial relationship.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Client Name** | Text | Commercial legal or operational name of the client organization. |
| **Primary Contact** | Text | Primary liaison contact email and phone details. |
| **Relationship Start Date**| Date / Timestamp | Timestamp when the initial lead deal was marked *Won*. |
| **Cumulative Revenue** | Number | Sum of all successfully closed contract values for this client. |
| **Account Health State** | Enumerated Status | Qualitative vitality indicator (*Active*, *Inactive*, *High Attention*). |

### 2.8 Entity: Subscription & Plan
Represents the monetization agreement and feature entitlements for a workspace.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Plan Tier** | Enumerated Status | Workspace entitlement tier (*Free* or *Pro*). |
| **Billing Cycle** | Enumerated Status | Cadence of billing renewal (*Monthly* or *Yearly*). |
| **Subscription Status** | Enumerated Status | Billing state (*Free*, *Pending Payment*, *Active*, *Past Due*, *Canceled*). |
| **Renewal Date** | Date / Timestamp | Next scheduled subscription billing or expiration date. |

---

## 3. AI Intelligence Entities (Phase 2 Planned Extension)

### 3.1 Entity: Deal Radar Ranking
Represents an AI-computed opportunity priority score for an active lead.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Momentum Category** | Enumerated Status | Opportunity momentum rating (*Hot*, *Steady*, *Cooling*, *At Risk*). |
| **Priority Rank** | Number | Integer position indicating relative urgency within the daily queue. |
| **Action Rationale** | Text | Natural-language explanation of why this deal demands attention today. |
| **Calculated Timestamp** | Date / Timestamp | Time of the most recent radar computation. |

### 3.2 Entity: Client Health Score
Represents an AI-evaluated relationship vitality assessment for a client account.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Health State** | Enumerated Status | Evaluated relationship vitality (*Thriving*, *Stable*, *Needs Attention*, *At Risk*). |
| **Days Since Contact** | Number | Elapsed calendar days since the last recorded interaction. |
| **Retention Tip** | Text | Recommended outreach action to revitalize client relationship. |

### 3.3 Entity: AI Follow-Up Draft
Represents an assistive, pre-drafted message awaiting human review.
| Conceptual Attribute | Data Category | Description |
|---|---|---|
| **Draft Message Body** | Text | Pre-drafted text tailored to the lead's history and stage. |
| **Suggested Tone** | Enumerated Status | Categorized style of the draft (*Friendly Check-In*, *Value-Add*, *Closing Prompt*). |
| **Human Review State** | Enumerated Status | Workflow approval state (*Generated*, *Approved*, *Edited*, *Discarded*). |
| **Approved Text** | Text | Final user-edited version confirmed and logged to the lead history. |

---

## 4. Cross-Reference to UML Models

The entities and relationships modeled in this dictionary directly correspond to:
- **Conceptual Class Diagram**: [docs/UML.md Section 2](UML.md#2-conceptual-class-diagram-domain-model)
- **Logical Entity Relationship Model**: [docs/UML.md Section 3](UML.md#3-entity-relationship-diagram-logical-not-physical-schema)
