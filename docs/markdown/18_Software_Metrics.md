# SoloOS — Software Metrics Report

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | November 2026 | Anay Sharma | Initial metrics report: size, effort, process and quality metrics |

---

## 1. Purpose

This report collects the measurable facts about SoloOS in one place. Metrics are grouped into four categories:

1. **Size metrics**: how big the system is.
2. **Effort and schedule metrics**: how much work and time it needs, estimated versus actual.
3. **Process metrics**: how the team works (GitHub and Agile activity).
4. **Quality metrics**: how well the system was tested.

Values marked **[FILL]** must be taken from the real repository and test runs. Section 7 shows the command or place to get each one.

---

## 2. Size Metrics

| Metric | Value | Source |
|---|---|---|
| Unadjusted Function Points (UFP) | 170 | `14_Cost_Estimation.md`, Section 2.2 |
| Value Adjustment Factor (VAF) | 1.07 | `14_Cost_Estimation.md`, Section 2.3 |
| Adjusted Function Points (AFP) | 182 | 170 × 1.07 |
| Estimated size | 8.19 KSLOC | 182 FP × 45 SLOC/FP |
| **Actual** lines of code in `src/` | **[FILL]** | Section 7, item 1 |
| Number of source files | **[FILL]** | Section 7, item 1 |
| Functional modules | 9 (8 Base CRM + 1 AI-Assisted Selling) | SRS |

**Size variance** = (Actual KSLOC − Estimated KSLOC) / Estimated KSLOC × 100 = **[FILL]** %

---

## 3. Effort and Schedule Metrics

### 3.1 COCOMO II estimate (model output)

Inputs from `14_Cost_Estimation.md`: Size = 8.19 KSLOC, A = 2.94, E = 1.05, effort multiplier product = 1.12.

$$\text{Effort} = 2.94 \times (8.19)^{1.05} \times 1.12 \approx 30.0 \text{ Person-Months}$$

$$\text{Duration} = 3.67 \times (30.0)^{0.318} \approx 10.8 \text{ months}$$

$$\text{Average team size} = \text{Effort} / \text{Duration} \approx 2.8 \text{ people}$$

### 3.2 Estimated versus actual

| Metric | Estimated | Actual | Variance |
|---|---|---|---|
| Effort (person-hours) | ~4,800 h (30 PM × 160 h) | **[FILL]** | **[FILL]** % |
| Duration (weeks) | ~47 weeks (10.8 months) | **[FILL]** | **[FILL]** % |
| Team size | ~3 | 2 | n/a |

**Effort variance** = (Actual − Estimated) / Estimated × 100

**Why actual is much lower than the model:** COCOMO II assumes code is written from scratch by a typical team. SoloOS uses ready-made parts (Supabase for auth and database, Radix UI and Tailwind for the interface, Razorpay for checkout), so far less code is written by hand. The report explains this gap instead of hiding it.

### 3.3 Cost metrics (from `14_Cost_Estimation.md`)

| Metric | Value |
|---|---|
| Monthly infrastructure cost (1,000 users) | $99.00 |
| Revenue at 100 Pro subscribers × $15 | $1,500.00 / month |
| Break-even subscribers | 7 (99 / (15 × 0.975) ≈ 6.8) |
| Net margin | 90.9% |

---

## 4. Process Metrics (GitHub and Agile)

### 4.1 GitHub activity

| Metric | Value | Source |
|---|---|---|
| Total commits | **[FILL]** | Section 7, item 2 |
| Commits per contributor | **[FILL]** | Section 7, item 2 |
| Pull requests (opened / merged) | **[FILL]** / **[FILL]** | GitHub, Pull requests tab |
| Issues (opened / closed) | **[FILL]** / **[FILL]** | GitHub, Issues tab |
| Active development days | **[FILL]** | Section 7, item 2 |

### 4.2 Agile metrics

| Sprint | Planned story points | Completed story points | Notes |
|---|---|---|---|
| Sprint 1 | **[FILL]** | **[FILL]** | **[FILL]** |
| Sprint 2 | **[FILL]** | **[FILL]** | **[FILL]** |
| Sprint 3 | **[FILL]** | **[FILL]** | **[FILL]** |

- **Velocity** = average completed story points per sprint = **[FILL]**
- **Sprint completion rate** = completed / planned × 100 = **[FILL]** %

### 4.3 Moodle activity

| Metric | Value |
|---|---|
| Submissions made on Moodle | **[FILL]** |
| Deliverables uploaded (SRS, UML, Architecture, Metrics) | **[FILL]** of 4 |

---

## 5. Quality Metrics

Test cases are defined in `05_Test_Plan.md` and results are recorded in `15_Software_Test_Report.md`.

| Metric | Formula | Value |
|---|---|---|
| Total test cases | count | **[FILL]** |
| Passed | count | **[FILL]** |
| Failed | count | **[FILL]** |
| **Pass rate** | passed / total × 100 | **[FILL]** % |
| Defects found | count | **[FILL]** |
| Defects fixed | count | **[FILL]** |
| **Defect density** | defects found / KSLOC (actual) | **[FILL]** per KSLOC |
| **Requirements coverage** | requirements with at least one test / total requirements × 100 | **[FILL]** % (use `11_Requirements_Traceability_Matrix.md`) |
| Code coverage | % of lines run by automated tests | **[FILL]** % (only if automated tests exist) |

---

## 6. Design Metrics (from the existing diagrams)

| Metric | Value | Source |
|---|---|---|
| UML diagrams produced | 12 (8 Phase 1, 4 Phase 2) | `UML.md` |
| DFD levels | 2 (Level 0 and Level 1) | `08_DFD.md` |
| Processes in Level 1 DFD | 6 | `08_DFD.md` |
| Data stores | 5 (D1 to D5) | `08_DFD.md` |
| Architecture layers | 4 (Client, Application Service, BaaS, External) | `03_System_Design_Document.md` |
| Domain entities in class diagram | 9 | `UML.md`, Diagram 2 |

---

## 7. How to Collect the [FILL] Values

Run these in the repository folder.

1. **Lines of code and file count** (counts the source files only):
   ```
   git ls-files src | xargs wc -l
   git ls-files src | wc -l
   ```
   The last line of the first command is the total.

2. **Commits and activity:**
   ```
   git rev-list --count HEAD
   git shortlog -sn
   git log --format=%ad --date=short | sort -u | wc -l
   ```
   These give total commits, commits per author, and the number of days with at least one commit.

3. **Pull requests and issues:** read the counts on the GitHub Pull requests and Issues tabs (Open and Closed).

4. **Sprint data:** use your own sprint plan or GitHub Projects board. Count the story points planned and finished in each sprint.

5. **Test results:** run each test case in `05_Test_Plan.md` by hand, mark Pass or Fail, and copy the totals here and into `15_Software_Test_Report.md`.

6. **Actual effort:** add up the hours spent. If you did not log them, estimate honestly (days worked × hours per day) and say it is an estimate.

---

## 8. Summary

| Category | Key result |
|---|---|
| Size | 182 AFP, about 8.19 KSLOC estimated; actual **[FILL]** KSLOC |
| Effort | 30.0 PM estimated by COCOMO II; actual **[FILL]** person-hours |
| Process | **[FILL]** commits, **[FILL]** pull requests, velocity **[FILL]** |
| Quality | **[FILL]** % test pass rate, **[FILL]** defects per KSLOC |
