# SoloOS — The AI-Powered Freelancer Sales & Revenue Workspace

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM UI repository and documentation release |
| 0.2 | September 12, 2026 | Anay Sharma | Added Phase 2 AI-Powered CRM scope and extended engineering suite |

> **Turn pipeline chaos into predictable freelance revenue with intelligent sales assistance.**

SoloOS is a focused client acquisition, pipeline management, and revenue intelligence workspace purpose-built for independent freelancers, solo consultants, and boutique service providers. SoloOS bridges the gap between chaotic spreadsheets and bloated corporate enterprise CRMs.

The project is developed across two progressive SDLC phases:
- **Phase 1 — Base CRM (Delivered Foundation)**: Visual lead pipeline, proactive follow-up scheduling, scope-based pricing estimation, proposal tracking, client relationship records, and tiered subscription billing.
- **Phase 2 — AI-Powered CRM (Current Planned Extension)**: An intelligent layer augmenting the delivered foundation with automated deal prioritization ("Deal Radar"), personalized pricing recommendations, computed client health scoring, human-in-the-loop AI-drafted follow-up messages, and automated weekly revenue debriefs.

---

## 1. Problem Statement

Independent professionals frequently lose high-ticket client opportunities due to fragmented communication, forgotten follow-up cadences, and arbitrary pricing guesses. Traditional CRM platforms are engineered for corporate sales teams with heavy administrative overhead, while basic spreadsheets lack automation and actionable pipeline visibility. SoloOS solves this disconnect by providing an intuitive, purpose-built workspace engineered specifically for the solo business model, enhanced with assistive intelligence that preserves human agency.

---

## 2. Key Capabilities

### Phase 1: Delivered Foundation (Base CRM)
- **Visual Pipeline Management**: Organize prospective client leads across customizable stages from initial inquiry to closed-won.
- **Smart Follow-Up Scheduling**: Track due dates and urgency levels to eliminate dropped leads and maintain consistent touchpoints.
- **Project Pricing Estimator**: Generate structured, input-based price estimates and suggested fee ranges based on project scope and deliverables.
- **Proposal Lifecycle Tracking**: Monitor proposal status, quote amounts, and client decision timelines.
- **Client Directory & Revenue History**: Maintain clean customer records, relationship timelines, and client lifetime revenue summaries upon winning deals.
- **Executive Revenue Dashboard**: Surface key pipeline metrics, win rates, pending revenue, and monthly performance indicators at a glance.
- **Tiered Workspace Access**: Seamlessly access core freelance tools on the Free tier or upgrade to the Pro plan for advanced capabilities.

### Phase 2: Planned Extension (AI-Powered CRM)
- **Deal Radar (Automated Prioritization)**: Intelligently ranks and surfaces the highest-probability opportunities requiring immediate attention today.
- **Personalized Pricing Suggestions**: Computes context-aware pricing recommendations using historical project scopes and client industry profiles.
- **Client Health Scoring**: Evaluates relationship vitality and churn risk from communication recency and contract velocity.
- **AI-Drafted Follow-Up Messages**: Pre-drafts tailored, context-aware outreach messages ready for one-click human review, editing, and approval.
- **Weekly Revenue Debrief**: Asynchronously synthesizes weekly pipeline movements, closed revenue, and recommended focus areas.

---

## 3. Technology Stack (Category Level)

The client repository is structured around modern, modular front-end architecture designed for decoupled deployment:

- **Client Presentation Layer**: Component-driven Single Page Application (SPA) built with React and TypeScript.
- **Design System & Styling**: Utility-first CSS framework with accessible headless UI primitives and responsive layout design.
- **Client State & Data Fetching**: Asynchronous query caching and optimistic UI state management.
- **Managed Backend Services**: Cloud-native Backend-as-a-Service (BaaS) providing secure authentication and structured persistence.
- **Payment & Checkout Gateway**: Third-party checkout provider with client-side modal integration and server-verified webhook processing.
- **Hosted AI Service Layer**: External hosted AI provider integrated via a serverless AI orchestration service with mandatory human-in-the-loop review.

---

## 4. UI Layer Setup & Quickstart

This repository contains the front-end user interface. To run the application locally:

### Prerequisites
- Node.js (v18.x or higher recommended)
- Package manager (`npm` or `pnpm`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnaySharmaCEO/SoloOS
   cd soloos-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example environment file and configure the public endpoint references:
   ```bash
   cp .env.example .env
   ```
   Provide your public configuration values in `.env`:
   - `VITE_SUPABASE_URL`: Managed service API endpoint URL.
   - `VITE_SUPABASE_ANON_KEY`: Public client anonymous access key.
   - `VITE_BILLING_PROVIDER`: Active payment provider identifier (e.g. `razorpay`).
   - `VITE_RAZORPAY_KEY_ID`: Public payment gateway client key.
   - `VITE_AI_ENABLED`: Feature flag toggling AI-assisted selling UI views (`true` or `false`).

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```
   Production-ready static assets will be compiled into the `dist/` directory.

---

## 5. Software Engineering Documentation Suite

This project includes a comprehensive, formal Software Engineering documentation set authored in accordance with recognized software development lifecycle (SDLC) standards.

### 5.1 Formal DOCX Deliverables
For academic evaluation, formal reviews, and printable submissions, pre-compiled Microsoft Word (`.docx`) documents are provided in [`docs/docx/`](docs/docx/):

- **[docs/docx/SRS.docx](docs/docx/SRS.docx)**: Fully formatted IEEE Std 830-1998 Software Requirements Specification incorporating the Business Tool Landscape table, Level 0 and Level 1 Data Flow Diagrams (DFD) as embedded high-resolution figures, all functional modules (Modules 1–8 Base CRM and Module 9 AI-Assisted Selling), non-functional requirements, and complete use case specifications.
- **[docs/docx/UML_Diagrams.docx](docs/docx/UML_Diagrams.docx)**: Complete collection of all 12 system UML diagrams rendered as high-resolution visual models with full descriptions.
- **[docs/docx/Requirement_Report.docx](docs/docx/Requirement_Report.docx)**: Formal Requirements Engineering Report consolidating field elicitation findings (N=25 survey), toolchain comparative analysis, and bidirectional requirements baseline.

### 5.2 Markdown Source Documentation Suite
All source specifications reside in [`docs/markdown/`](docs/markdown/):

| Document | Title | Description |
|---|---|---|
| [docs/markdown/UML.md](docs/markdown/UML.md) | **UML Specifications** | Authoritative Mermaid UML diagrams for Phase 1 and Phase 2 (Use Cases, Domain Model, ERD, Sequences, State Machines, Component Architectures). |
| [docs/markdown/00_Project_Synopsis.md](docs/markdown/00_Project_Synopsis.md) | **Project Synopsis** | Executive summary covering problem statement, two-phase objectives, scope boundaries, and expected outcomes. |
| [docs/markdown/01_Feasibility_Study.md](docs/markdown/01_Feasibility_Study.md) | **Feasibility Study** | Technical, economic, operational, and schedule feasibility with alternatives analysis and Phase 2 AI feasibility addendum. |
| [docs/markdown/02_SRS.md](docs/markdown/02_SRS.md) | **Software Requirements Specification** | IEEE Standard 830-1998 formal specification covering all 9 functional modules, non-functional requirements, and detailed use case specifications. |
| [docs/markdown/03_System_Design_Document.md](docs/markdown/03_System_Design_Document.md) | **System Design Document** | 3-tier architecture, AI Orchestration Service, sequence narratives, state machines, tech stack justification, and security/privacy posture. |
| [docs/markdown/04_Project_Plan.md](docs/markdown/04_Project_Plan.md) | **Project Plan** | Two-phase WBS (Phase 1 delivered; Phase 2 prospective), 10-week Gantt chart timeline, project roles, risk register, and change management. |
| [docs/markdown/05_Test_Plan.md](docs/markdown/05_Test_Plan.md) | **Quality Assurance & Test Plan** | 4-level test strategy, black-box functional test cases for all modules, and payment & AI-specific edge cases. |
| [docs/markdown/06_User_Manual.md](docs/markdown/06_User_Manual.md) | **User Manual & Operations Guide** | End-user onboarding guide, core feature walkthroughs, AI feature controls with review/edit flows, and FAQ. |
| [docs/markdown/07_Deployment_Guide.md](docs/markdown/07_Deployment_Guide.md) | **Front-End Deployment Guide** | UI-layer build instructions, environment configuration, Vercel/Netlify/Cloudflare SPA deployment, and verification checklists. |
| [docs/markdown/08_DFD.md](docs/markdown/08_DFD.md) | **Data Flow Diagrams** | Structured analysis Level 0 (Context Diagram) and Level 1 DFD detailing processes, external entities, and data stores. |
| [docs/markdown/09_Requirements_Questionnaire.md](docs/markdown/09_Requirements_Questionnaire.md) | **Requirements Questionnaire** | Elicitation survey instrument administered to target freelancers, including AI trust probes and traceability mapping to SRS requirements. |
| [docs/markdown/10_Data_Dictionary.md](docs/markdown/10_Data_Dictionary.md) | **Data Dictionary** | Conceptual data dictionary defining all domain entities, attributes, and data categories without physical schema leakage. |
| [docs/markdown/11_Requirements_Traceability_Matrix.md](docs/markdown/11_Requirements_Traceability_Matrix.md) | **Requirements Traceability Matrix** | Bidirectional traceability matrix linking every SRS functional requirement to design components and verification test cases. |
| [docs/markdown/12_Software_Configuration_Management_Plan.md](docs/markdown/12_Software_Configuration_Management_Plan.md) | **Configuration Management Plan** | Git branching policies, semantic versioning standards, promotion environments, and baseline change control procedures. |
| [docs/markdown/13_Risk_Management_Plan.md](docs/markdown/13_Risk_Management_Plan.md) | **Risk Management Plan** | Comprehensive risk analysis, 5x5 probability-impact matrix, mitigation strategies, and contingency runbooks. |
| [docs/markdown/14_Cost_Estimation.md](docs/markdown/14_Cost_Estimation.md) | **Cost Estimation (COCOMO II & Function Points)** | Formal software cost and effort estimation model for academic evaluation. |
| [docs/markdown/15_Software_Test_Report.md](docs/markdown/15_Software_Test_Report.md) | **Software Test Report** | Test execution template recording test results, defect logs, metric distributions, and release sign-off criteria. |
| [docs/markdown/16_Glossary.md](docs/markdown/16_Glossary.md) | **Glossary & Acronyms** | Alphabetical master reference of all domain concepts, abbreviations, and engineering terms across the project. |
| [docs/markdown/17_AI_Ethics_and_Data_Privacy.md](docs/markdown/17_AI_Ethics_and_Data_Privacy.md) | **AI Ethics & Data Privacy** | Data minimization standards, human-in-the-loop guarantees, user opt-out policies, and failure-mode governance. |

---

## 6. License & Support

- **License**: This project is licensed under the MIT License.
- **Support & Feedback**: For support, questions, or inquiries, reach out to `anaysharmabiz@gmail.com`.