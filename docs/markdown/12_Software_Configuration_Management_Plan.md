# SoloOS — Software Configuration Management Plan (SCMP)

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM configuration management baseline |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI-Powered CRM multi-environment release strategy |

---

## 1. Introduction & Purpose

The Software Configuration Management Plan (SCMP) establishes the operational standards, toolchains, branching conventions, environment promotion controls, and change auditing procedures for **SoloOS**.

This plan ensures:
1. Deterministic build repeatability across local, staging, and production environments.
2. Protection of baseline requirements in [docs/02_SRS.md](02_SRS.md) and design artifacts in [docs/03_System_Design_Document.md](03_System_Design_Document.md).
3. Continuous enforcement of repository security policies (zero leakage of proprietary schemas, serverless functions, or secrets).

---

## 2. Configuration Identification & Repository Structure

### 2.1 Configuration Items (CIs)
The following assets are classified as controlled Configuration Items under active change governance:
- **Client Source Code**: React components, TypeScript hooks, and service adapters located in `/src`.
- **Engineering Documentation Set**: All 18 formal SDLC specifications located in `/docs`.
- **UML System Models**: Authoritative Mermaid models in `docs/UML.md`.
- **Build Configurations**: Vite build scripts, PostCSS configurations, and package manager lockfiles (`package-lock.json`).
- **Security Ignore Policies**: Repository `.gitignore` rules.

### 2.2 Version Control System
- **Platform**: Git distributed version control system hosted on GitHub (`https://github.com/AnaySharmaCEO/SoloOS`).
- **Default Trunk**: `main`.

---

## 3. Branching & Commit Strategy

SoloOS adheres to a simplified **Trunk-Based Development** model complemented by short-lived feature and release branches:

```
main (Production Baseline: v0.1.0 -> v0.2.0)
  │
  ├── feature/ai-deal-radar ----------> (PR Review / Fast-Forward Merge)
  ├── feature/ai-followup-modal ------> (PR Review / Fast-Forward Merge)
  └── hotfix/payment-webhook-race ----> (Direct Patch / Tagged Release)
```

### 3.1 Branch Naming Conventions
- `feature/<feature-name>`: Discrete feature implementations (e.g. `feature/ai-deal-radar`).
- `bugfix/<issue-id>`: Corrective defect resolutions (e.g. `bugfix/pipeline-drag-stutter`).
- `docs/<doc-name>`: Specification and documentation enhancements (e.g. `docs/rtm-update`).
- `hotfix/<defect-id>`: Critical production patches requiring immediate trunk promotion.

### 3.2 Commit Message Standard (Conventional Commits)
All commit messages must follow the Conventional Commits specification:
```text
<type>(<scope>): <short imperative description>

[optional body providing rationale]
[optional footer referencing issue ID]
```
- **Allowed Types**:
  - `feat`: New user-facing capability or requirement implementation.
  - `fix`: Bug resolution.
  - `docs`: Documentation modifications or additions in `/docs`.
  - `refactor`: Code reorganization without functional change.
  - `test`: Addition or modification of QA test suites.
  - `chore`: Toolchain, dependency, or `.gitignore` adjustments.

---

## 4. Environment & Release Strategy

SoloOS maintains a strict 3-tier environment promotion pipeline:

```
[ Local Development ] ---> [ Staging (Edge Preview) ] ---> [ Production (Global CDN) ]
 (Mocked BaaS/AI)            (Sandbox Payment & AI)          (Live Verified Releases)
```

### 4.1 Environment Classification
1. **Local Development (`local`)**:
   - Executed via Vite local development server (`npm run dev`).
   - Uses local test credentials and sandbox mock adapters for payment and AI services.
2. **Staging Environment (`staging`)**:
   - Automatically built from pull requests or development branches.
   - Connected to cloud BaaS staging instances, sandbox payment gateways, and test AI proxy endpoints.
   - Used for manual QA exploratory testing and UAT verification.
3. **Production Environment (`production`)**:
   - Deployed strictly from immutable, tagged releases on the `main` branch.
   - Hosted on globally distributed static edge CDNs terminating TLS 1.3.

### 4.2 Semantic Versioning (SemVer 2.0.0)
Releases are versioned according to `MAJOR.MINOR.PATCH`:
- **MAJOR (`1.0.0`)**: Incompatible API breaking changes or major product transitions.
- **MINOR (`0.2.0`)**: Additive functional capabilities (e.g. Phase 2 AI-Assisted Selling extension).
- **PATCH (`0.1.1`)**: Backward-compatible defect fixes and security patches.

---

## 5. Change Control & Baseline Management

Any modification affecting system functional requirements or architecture must follow the formal baseline change control workflow:

```
[ Change Request ] -> [ Impact Analysis (RTM) ] -> [ Architectural Sign-Off ] -> [ Documentation Update ] -> [ Code Merge ]
```

1. **Change Request (CR) Formulation**: The engineer documents the proposed requirement modification, problem context, and justification.
2. **Impact Analysis**: The change is evaluated against [docs/11_Requirements_Traceability_Matrix.md](11_Requirements_Traceability_Matrix.md) to identify all dependent SDD modules, UML diagrams, and test plan cases.
3. **Baseline Update**: If approved by the Project Lead (Anay Sharma), the version-history table is incremented (e.g., `0.1` -> `0.2`) across affected documents in `/docs` before code implementation begins.
4. **Verification & Audit**: The change is validated against the test plan to ensure zero regression before merging into `main`.
