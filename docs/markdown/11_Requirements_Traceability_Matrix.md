# SoloOS — Requirements Traceability Matrix (RTM)

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM traceability baseline |
| 0.2 | September 12, 2026 | Anay Sharma | Extended with Phase 2 AI-Assisted Selling requirements and test cases |

---

## 1. Introduction & Purpose

The Requirements Traceability Matrix (RTM) establishes bidirectional traceability across the **SoloOS** software engineering lifecycle. It guarantees that:
1. **Forward Traceability**: Every functional and quality requirement specified in [docs/02_SRS.md](02_SRS.md) maps directly to architectural design components in [docs/03_System_Design_Document.md](03_System_Design_Document.md) and authoritative diagrams in [docs/UML.md](UML.md).
2. **Backward Traceability**: Every test case in [docs/05_Test_Plan.md](05_Test_Plan.md) verifies a valid system requirement, ensuring zero orphaned requirements and zero orphaned verification tests.

---

## 2. Bidirectional Traceability Matrix

| Requirement ID | Requirement Description | SRS Section | Architecture & SDD Module | UML Diagram Reference | Verification Test ID(s) | Compliance Status |
|---|---|---|---|---|---|---|
| **FR-LM-01** | Create new lead record with contact & value | SRS §3.2 (Mod 1) | SDD §3.1 Lead Management | UML Diag 1 (UC-02), Diag 4 | `TC-LM-01`, `TC-LM-03` | Verified (Phase 1) |
| **FR-LM-02** | Dual view: Kanban pipeline & tabular list | SRS §3.2 (Mod 1) | SDD §3.1 Lead Management | UML Diag 1 (UC-02) | `TC-LM-01`, `TC-LM-02` | Verified (Phase 1) |
| **FR-LM-03** | Stage transition across qualification pipeline | SRS §3.2 (Mod 1) | SDD §3.1 Lead Management | UML Diag 4, Diag 6 (State) | `TC-LM-02` | Verified (Phase 1) |
| **FR-LM-04** | Edit, archive, and delete leads | SRS §3.2 (Mod 1) | SDD §3.1 Lead Management | UML Diag 1 (UC-02) | `TC-LM-04` | Verified (Phase 1) |
| **FR-LM-05** | Elapsed contact time tracking | SRS §3.2 (Mod 1) | SDD §3.1 Lead Management | UML Diag 4 (Seq) | `TC-LM-01`, `TC-FM-02` | Verified (Phase 1) |
| **FR-FM-01** | Schedule follow-ups with urgency and due dates | SRS §3.2 (Mod 2) | SDD §3.2 Follow-Up Mgmt | UML Diag 1 (UC-03), Diag 4 | `TC-FM-01` | Verified (Phase 1) |
| **FR-FM-02** | Urgency classification (Due Today, Overdue) | SRS §3.2 (Mod 2) | SDD §3.2 Follow-Up Mgmt | UML Diag 1 (UC-03), Diag 4 | `TC-FM-02` | Verified (Phase 1) |
| **FR-FM-03** | Mark follow-up completed and log notes | SRS §3.2 (Mod 2) | SDD §3.2 Follow-Up Mgmt | UML Diag 4 (Seq) | `TC-FM-03` | Verified (Phase 1) |
| **FR-FM-04** | Append-only historical activity log | SRS §3.2 (Mod 2) | SDD §3.2 Follow-Up Mgmt | UML Diag 4 (Seq) | `TC-FM-03` | Verified (Phase 1) |
| **FR-PT-01** | Record client proposals and decision dates | SRS §3.2 (Mod 3) | SDD §3.4 Proposal Tracking | UML Diag 1 (UC-05) | `TC-PT-01` | Verified (Phase 1) |
| **FR-PT-02** | Proposal lifecycle state tracking | SRS §3.2 (Mod 3) | SDD §3.4 Proposal Tracking | UML Diag 1 (UC-05) | `TC-PT-01` | Verified (Phase 1) |
| **FR-PT-03** | Accepted proposal advances deal to Won | SRS §3.2 (Mod 3) | SDD §3.4 Proposal Tracking | UML Diag 4 (Seq) | `TC-CM-01` | Verified (Phase 1) |
| **FR-CM-01** | Automatic Client Record conversion on Won deal | SRS §3.2 (Mod 4) | SDD §3.5 Client Management | UML Diag 1 (UC-06), Diag 4 | `TC-CM-01` | Verified (Phase 1) |
| **FR-CM-02** | Direct client creation and archiving | SRS §3.2 (Mod 4) | SDD §3.5 Client Management | UML Diag 1 (UC-06) | `TC-CM-01` | Verified (Phase 1) |
| **FR-CM-03** | Cumulative lifetime revenue metric aggregation | SRS §3.2 (Mod 4) | SDD §3.5 Client Management | UML Diag 1 (UC-06) | `TC-CM-02` | Verified (Phase 1) |
| **FR-CM-04** | Client relationship health state indicators | SRS §3.2 (Mod 4) | SDD §3.5 Client Management | UML Diag 1 (UC-06) | `TC-CM-02` | Verified (Phase 1) |
| **FR-PE-01** | Scoping-based pricing estimation parameters | SRS §3.2 (Mod 5) | SDD §3.3 Pricing Estimation | UML Diag 1 (UC-04) | `TC-PE-01` | Verified (Phase 1) |
| **FR-PE-02** | Calculate Minimum/Target/Premium fee bands | SRS §3.2 (Mod 5) | SDD §3.3 Pricing Estimation | UML Diag 1 (UC-04) | `TC-PE-01` | Verified (Phase 1) |
| **FR-PE-03** | Save and attach pricing estimates to leads | SRS §3.2 (Mod 5) | SDD §3.3 Pricing Estimation | UML Diag 1 (UC-04) | `TC-PE-02` | Verified (Phase 1) |
| **FR-DB-01** | Real-time sales metrics aggregation | SRS §3.2 (Mod 6) | SDD §3.6 Dashboard & Analytics | UML Diag 1 (UC-07) | `TC-DB-01` | Verified (Phase 1) |
| **FR-DB-02** | Pipeline distribution & monthly forecasting | SRS §3.2 (Mod 6) | SDD §3.6 Dashboard & Analytics | UML Diag 1 (UC-07) | `TC-DB-01` | Verified (Phase 1) |
| **FR-DB-03** | Quick Actions / Today actionable priority pane | SRS §3.2 (Mod 6) | SDD §3.6 Dashboard & Analytics | UML Diag 1 (UC-07) | `TC-DB-01`, `TC-FM-02` | Verified (Phase 1) |
| **FR-AS-01** | Profile settings & currency preferences | SRS §3.2 (Mod 7) | SDD §3.7 Account & Settings | UML Diag 1 (UC-09) | `TC-AS-01` | Verified (Phase 1) |
| **FR-AS-02** | Structured data export (CSV & JSON) | SRS §3.2 (Mod 7) | SDD §3.7 Account & Settings | UML Diag 1 (UC-08) | `TC-AS-01` | Verified (Phase 1) |
| **FR-AS-03** | Secure account deletion & tenant purging | SRS §3.2 (Mod 7) | SDD §3.7 Account & Settings | UML Diag 1 (UC-09) | `TC-AS-01` | Verified (Phase 1) |
| **FR-SM-01** | Active tier display and billing cycle | SRS §3.2 (Mod 8) | SDD §3.8 Subscription Mgmt | UML Diag 1 (UC-10), Diag 7 | `TC-SM-01` | Verified (Phase 1) |
| **FR-SM-02** | Checkout order initialization with gateway | SRS §3.2 (Mod 8) | SDD §3.8 Subscription Mgmt | UML Diag 1 (UC-11), Diag 5 | `TC-SM-01`, `TC-SM-03` | Verified (Phase 1) |
| **FR-SM-03** | Webhook HMAC verification and tier upgrade | SRS §3.2 (Mod 8) | SDD §3.8 Subscription Mgmt | UML Diag 5 (Seq), Diag 7 | `TC-SM-01`, `TC-SM-04`, `TC-SM-05`, `TC-SM-06` | Verified (Phase 1) |
| **FR-SM-04** | Downgrade preservation until cycle end | SRS §3.2 (Mod 8) | SDD §3.8 Subscription Mgmt | UML Diag 7 (State) | `TC-SM-07` | Verified (Phase 1) |
| **FR-AI-01** | Deal Radar automated opportunity ranking | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-13), Diag 11 | `TC-AI-01` | Planned (Phase 2) |
| **FR-AI-02** | Personalized pricing suggestions & rationale | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-14), Diag 11 | `TC-AI-01`, `TC-PE-01` | Planned (Phase 2) |
| **FR-AI-03** | Computed client health scoring | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-15), Diag 11 | `TC-AI-05` | Planned (Phase 2) |
| **FR-AI-04** | Context-aware follow-up message drafting | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-16), Diag 12 | `TC-AI-02`, `TC-AI-04` | Planned (Phase 2) |
| **FR-AI-05** | Mandatory human-in-the-loop review modal | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-17), Diag 12 | `TC-AI-03` | Planned (Phase 2) |
| **FR-AI-06** | Automated weekly revenue debrief | SRS §3.2 (Mod 9) | SDD §3.9 AI-Assisted Selling | UML Diag 10 (UC-18), Diag 11 | `TC-AI-01`, `TC-DB-01` | Planned (Phase 2) |
| **NFR-AI-02**| Graceful degradation on AI provider outage | SRS §3.3.4 (AI NFR)| SDD §1.2, SDD §2.1 | UML Diag 11 (Arch) | `TC-AI-04` | Planned (Phase 2) |
| **NFR-AI-04**| Global AI feature opt-out toggle | SRS §3.3.4 (AI NFR)| SDD §3.7 Account & Settings | UML Diag 10 (UC-09) | `TC-AI-06` | Planned (Phase 2) |

---

## 3. Coverage Analysis Summary

- **Total Functional Requirements Traced**: 35 (29 Base CRM + 6 AI Selling).
- **Design Element Mapping**: 100% of requirements map to formal SDD modules and UML diagrams.
- **Verification Mapping**: 100% of requirements map to black-box test cases in `05_Test_Plan.md`.
- **Orphaned Requirements**: 0.
- **Orphaned Test Cases**: 0.
