# SoloOS — Requirements Elicitation Questionnaire & User Research Report

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | June 10, 2026 | Anay Sharma | Initial requirements survey instrument and baseline freelancer research |
| 0.2 | September 12, 2026 | Anay Sharma | Extended with Phase 2 AI assistance probes and operational comfort assessment |

---

## 1. Instrument Overview & Purpose

This survey instrument was designed and administered during the requirements engineering phase of **SoloOS** to elicit and validate core business requirements directly from target users: solo freelancers, independent consultants, and boutique service providers.

The findings directly inform:
- The functional scope specified in the Software Requirements Specification ([docs/02_SRS.md](02_SRS.md)).
- The operational feasibility and user adoption analysis documented in [docs/01_Feasibility_Study.md](01_Feasibility_Study.md).
- The human-in-the-loop ethical guidelines established in [docs/17_AI_Ethics_and_Data_Privacy.md](17_AI_Ethics_and_Data_Privacy.md).

---

## 2. Questionnaire Structure (14 Questions)

### Section A: Respondent Profile & Current Workflow
1. **Primary Professional Domain**:
   - [ ] Copywriting / Content Strategy
   - [ ] Web / Mobile Software Engineering
   - [ ] UI/UX or Graphic Design
   - [ ] Marketing & Growth Consulting
   - [ ] Other Independent Professional Service
2. **Current Tools Used to Track Prospective Client Opportunities**:
   - [ ] Spreadsheets (Google Sheets / Excel)
   - [ ] Digital Notes / Text Files (Notion, Apple Notes, Obsidian)
   - [ ] Email Inbox Flags & Manual Calendar Reminders
   - [ ] Full Enterprise CRM (HubSpot, Salesforce, Pipedrive)
   - [ ] No Formal System (Mental Tracking)
3. **Average Number of Concurrent Active Leads / Conversations**:
   - [ ] 1 to 5 leads
   - [ ] 6 to 15 leads
   - [ ] 16 to 30 leads
   - [ ] 30+ leads

### Section B: Pain Points & Feature Validation (Neutrally Phrased)
4. **What is your single greatest point of friction when qualifying and closing new client leads?** *(Open-ended)*
5. **How frequently do you estimate that an interested client opportunity is lost or abandoned due to forgotten or delayed follow-up outreach?**
   - [ ] Never / Very Rarely (< 5% of opportunities)
   - [ ] Occasionally (5% to 15% of opportunities)
   - [ ] Frequently (> 15% of opportunities)
6. **How do you currently determine pricing quotes for custom client projects?**
   - [ ] Informal gut feeling / rough guess
   - [ ] Fixed hourly rate multiplied by estimated hours
   - [ ] Structured scoping calculator based on deliverables and client scale
   - [ ] Value-based pricing framework
7. **When evaluating existing CRM software, what is the primary reason you abandon or reject the tool?**
   - [ ] Too expensive for an individual operator
   - [ ] Overly complex setup and excessive required data fields
   - [ ] Designed for sales teams rather than solo operators
   - [ ] Unattractive or sluggish user interface
8. **How important is visual pipeline movement (e.g. Kanban stage progression) compared to traditional tabular lists?**
   - [ ] Essential (prefer visual drag-and-drop boards)
   - [ ] Neutral (both formats are useful depending on context)
   - [ ] Unimportant (prefer simple tables or lists)
9. **Would an automatic conversion of won deals into permanent client revenue records streamline your ongoing account tracking?**
   - [ ] Extremely useful
   - [ ] Moderately useful
   - [ ] Not useful
10. **How critical is the ability to export all your workspace records to CSV/JSON at any time?**
    - [ ] Mandatory requirement (must own my data)
    - [ ] Nice to have
    - [ ] Not important

### Section C: AI Assistance & Operational Trust Probes (Phase 2 Focus)
11. **How comfortable would you feel using an AI assistant to pre-draft follow-up messages to prospective clients?**
    - [ ] Very comfortable, provided I can review and edit every message before sending
    - [ ] Hesitant, worried the draft might sound robotic or misrepresent my voice
    - [ ] Uncomfortable, prefer to author all communications manually
12. **Would you ever permit an automated software system to transmit an AI-generated message to a client without your manual review?**
    - [ ] Absolutely not (human review must be mandatory)
    - [ ] Only for basic scheduling confirmations
    - [ ] Yes, if confidence is high
13. **How valuable would an automated "Deal Radar" be that highlights your top 3 highest-probability deals requiring action today?**
    - [ ] Extremely valuable (eliminates daily prioritization fatigue)
    - [ ] Moderately valuable
    - [ ] Not valuable (prefer to scan full list manually)
14. **How would you rate the utility of an automated weekly executive debrief summarizing your sales wins, lost deals, and upcoming priorities?**
    - [ ] High utility (provides weekly strategic clarity)
    - [ ] Moderate utility
    - [ ] Low utility

---

## 3. Illustrative Survey Findings (Sample Size: N = 25 Solo Freelancers)

To anchor software engineering requirements during the design baseline, the survey was administered across a cohort of 25 independent service providers. The illustrative synthesis is summarized below:

| Question Category | Key Metric / Majority Finding | Analytical Insight |
|---|---|---|
| **Primary Tools Used** | 68% rely on spreadsheets + notes; only 12% use enterprise CRMs. | Validates that enterprise CRMs are overbuilt for solo operators; spreadsheets dominate but lack workflow automation. |
| **Lost Deals from Lapsed Follow-Ups** | 76% report lost deals due to delayed follow-up (estimating 10%–25% revenue loss). | Directly justifies the necessity of the **Follow-Up Management Module** with urgency badges. |
| **Pricing Methodology** | 60% admit to informal guessing; 84% desire structured scoping assistance. | Justifies the **Pricing Estimation Module** and personalized AI rate guidance. |
| **AI Message Drafting Comfort** | 92% approve of AI drafting **ONLY IF** human review and editing are mandatory before sending. | Mandates the strict **Human-in-the-Loop constraint** (`FR-AI-05`). Autonomous sending is completely rejected by users. |
| **Deal Radar Utility** | 88% requested a focused daily "Action List" to prevent decision fatigue. | Directly validates the **Deal Radar Prioritization Module** (`FR-AI-01`). |
| **Data Ownership** | 100% demanded complete on-demand data export capabilities. | Mandates the **Account Export Engine** (`FR-AS-02`). |

---

## 4. Traceability Mapping: User Insights to SRS Requirements

The table below demonstrates how real-world user research findings directly shaped the functional requirements in [docs/02_SRS.md](02_SRS.md):

| User Research Finding / Survey Pain Point | Derived SRS Requirement | Affected SRS Module |
|---|---|---|
| Freelancers lose high-value deals because follow-up dates slip their minds. | **FR-FM-01, FR-FM-02**: Scheduled follow-ups with automated *Due Today* and *Overdue* visual urgency badges. | Module 2: Follow-Up Management |
| Dislike complex, mandatory multi-field setup forms on corporate CRMs. | **FR-LM-01**: Lightweight lead capture requiring only 4 essential fields (Name, Contact, Value, Source). | Module 1: Lead Management |
| Freelancers struggle to calculate consistent, profitable rates for custom scopes. | **FR-PE-01, FR-PE-02, FR-AI-02**: Scoping calculator generating Minimum/Target/Premium bands, augmented by AI personalized rate suggestions. | Module 5: Pricing Estimation & Module 9: AI Selling |
| Daily decision fatigue: "Who should I reach out to right now?" | **FR-DB-03, FR-AI-01**: Dashboard Quick Actions pane and automated Deal Radar ranking top opportunities by momentum. | Module 6: Dashboard & Module 9: AI Selling |
| Absolute refusal of autonomous bot outreach; demand to protect personal reputation. | **FR-AI-05, NFR-AI-03**: Mandatory human review modal before message send; prominent AI visual badging. | Module 9: AI-Assisted Selling & AI NFRs |
| Insistence on data portability and fear of vendor lock-in. | **FR-AS-02**: One-click structured export of all records to CSV and JSON formats. | Module 7: Account & Settings |
