# SoloOS — User Manual & Operations Guide

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM user manual and onboarding walkthrough |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI-Assisted Selling features, review flows, and AI FAQ |

---

## 1. Welcome to SoloOS

Welcome to **SoloOS** — the AI-powered sales and pipeline workspace engineered specifically for independent freelancers, solo consultants, and boutique service providers.

SoloOS eliminates the chaos of lost notes, messy spreadsheets, and forgotten client follow-ups. By unifying your lead pipeline, follow-up calendar, project scoping calculator, proposals, client records, and an intelligent sales co-pilot into one focused dashboard, SoloOS empowers you to run your solo business with clarity, confidence, and control.

---

## 2. Getting Started & Onboarding

### 2.1 Account Creation & Sign In
1. Open your web browser and navigate to the SoloOS application URL (`https://soloos.app` or your local development instance).
2. Click **Sign Up** on the welcome screen.
3. Enter your work email address and choose a secure password (or authenticate using your supported Google/GitHub OAuth provider).
4. Upon sign-in, you will arrive at your fresh, uncluttered workspace.

### 2.2 Navigating the Workspace
SoloOS provides clean, persistent navigation accessible from any view:
- **Dashboard**: Your daily executive command center highlighting today's urgent priorities and weekly debriefs.
- **Pipeline**: Visual Kanban board and list view of all prospective client leads.
- **Follow-Ups**: Centralized agenda for scheduling, reviewing, and logging outreach tasks.
- **Estimator**: Scoping tool to calculate suggested price bands and receive AI rate recommendations.
- **Proposals**: Centralized tracking for quotes, scopes of work, and contract acceptance.
- **Clients**: Permanent directory of converted client accounts and cumulative lifetime revenue records.
- **Settings**: Profile customization, structured data export, and subscription management.

---

## 3. Core Feature Walkthroughs (Phase 1 Foundation)

### 3.1 Managing Your Lead Pipeline
The pipeline is where prospective client conversations develop:

```
[ New Lead ] -> [ Contacted ] -> [ Warm Lead ] -> [ Proposal Sent ] -> [ WON ]
```

1. **Adding a Lead**:
   - Navigate to the **Pipeline** view and click **+ Add Lead**.
   - Enter the lead's name (e.g., *Acme Branding Project*), primary contact email, referral source (e.g., *Referral*, *LinkedIn*, *Website*), and estimated deal value.
   - Click **Save Lead**. The card will appear in the *New Lead* column.
2. **Advancing Stages**:
   - Simply drag and drop the lead card across columns as negotiations progress (e.g., from *Contacted* to *Warm Lead*).
   - Alternatively, open the lead card modal and select the new stage from the dropdown selector.
3. **Filtering & Views**:
   - Toggle between the visual **Kanban Board** and the structured **List View** for compact sorting by value, source, or last contact date.

### 3.2 Scheduling & Logging Follow-Ups
Never let an interested client slip away through neglected contact:

1. **Scheduling an Outreach Task**:
   - In the **Follow-Ups** view (or directly on a lead card), click **+ Schedule Follow-Up**.
   - Select the target due date, urgency level (*Low*, *Medium*, *High*), and outreach goal (e.g., *"Follow up regarding scope questions"*).
   - Click **Schedule**.
2. **Prioritizing Tasks**:
   - SoloOS automatically organizes tasks into **Due Today**, **Overdue**, and **Upcoming**.
   - Overdue tasks are highlighted with high-visibility red badges to demand immediate action.
3. **Logging the Interaction**:
   - After reaching out, click **Mark Complete**.
   - Enter brief notes regarding the client's response to update the lead's activity history.

### 3.3 Generating Accurate Pricing Estimates
Stop guessing project fees on the fly:

1. Open the **Estimator** tool from the sidebar.
2. Input key project parameters: expected duration (weeks), deliverable complexity, and client commercial tier.
3. Click **Calculate Estimate**.
4. Review the generated pricing band:
   - **Minimum Rate**: The baseline floor to protect your profitability.
   - **Target Rate**: The recommended quote balancing value and close rate.
   - **Premium Rate**: The rate recommended for expedited delivery or high-value positioning.
5. Click **Attach to Lead** to link the estimate directly to an active opportunity.

### 3.4 Tracking Proposals & Converting Clients
1. **Recording a Proposal**:
   - In **Proposals**, click **New Proposal**.
   - Link the proposal to an active lead and record the quoted financial amount and expected decision date.
2. **Marking Deals as Won**:
   - When the client accepts your terms, update the proposal status to **Accepted**.
   - SoloOS will prompt you to mark the lead as **Won**.
3. **Automatic Client Conversion**:
   - Marking a lead Won automatically creates a permanent **Client Record** in your Clients directory, migrating all communication notes and attributing the deal amount to your lifetime client revenue.

---

## 4. AI-Assisted Selling Features (Phase 2 Extension)

SoloOS includes an optional suite of assistive AI tools designed to eliminate administrative fatigue while preserving complete human agency.

### 4.1 Deal Radar (Automated Opportunity Prioritization)
- **What it does**: The Deal Radar continuously evaluates your active pipeline, analyzing stage velocity, deal size, and days since last contact to surface your highest-momentum deals.
- **Where to find it**: Displayed at the top of your **Dashboard** and **Pipeline** views.
- **How to use it**: Review the Deal Radar each morning. Opportunities badged as **Hot** or **At Risk** highlight exactly where your attention will yield the highest return today.

### 4.2 AI-Drafted Follow-Up Messages (Human-in-the-Loop)
- **What it does**: When a follow-up task is due, SoloOS can generate a personalized outreach draft tailored to your conversation history with that prospect.
- **The Human Review Flow**:
  1. Click **Draft with AI** on any follow-up task card.
  2. An interactive review modal opens displaying the generated message.
  3. **You have three choices**:
     - *Approve as-is*: Click **Approve & Send** if the message looks perfect.
     - *Edit*: Click into the text area to tweak wording, add a personal anecdote, or modify the tone, then click **Approve & Send**.
     - *Discard*: Click **Discard** to close the assistant and write a custom message from scratch.
  4. **Guarantee**: SoloOS will **never** transmit an email or message to a client autonomously. You retain 100% control over every word sent.

### 4.3 Personalized Pricing Suggestions
- **What it does**: Beyond the standard pricing estimator formulas, the AI assistant evaluates your past won/lost proposals in similar industries to recommend a customized pricing strategy.
- **How to use it**: In the Estimator, click **Get AI Recommendation** to view recommended rate positioning and natural-language negotiation rationales.

### 4.4 Computed Client Health Scoring
- **What it does**: In your Clients directory, SoloOS evaluates relationship vitality based on project frequency and communication recency, assigning qualitative badges (*Thriving*, *Stable*, *Needs Attention*, *At Risk*).
- **How to use it**: Review clients marked *Needs Attention* to proactively reach out with check-in messages before relationships lapse.

### 4.5 Weekly Revenue Debrief
- **What it does**: Every Monday morning, SoloOS synthesizes your prior 7 days of sales activity into an executive summary rendered on your Dashboard: wins achieved, deals lost, pipeline velocity, and recommended priorities for the coming week.

### 4.6 Turning Off AI Features (User Opt-Out)
If you prefer a purely manual CRM experience without AI suggestions:
1. Navigate to **Settings > Account**.
2. Locate the **AI-Assisted Features** toggle.
3. Switch the toggle to **Disabled**.
4. The application will immediately hide all AI buttons, Deal Radar widgets, and drafting modals, reverting entirely to the standard manual Base CRM.

---

## 5. Account & Subscription Management

### 5.1 Profile Settings & Data Export
- Access **Settings** to update your business display name, role specialization, and default currency.
- Click **Export Data** at any time to download an unencrypted CSV or JSON archive containing all your leads, follow-ups, proposals, and client records. You own your data.

### 5.2 Upgrading to SoloOS Pro
SoloOS offers a Pro tier unlocking unlimited pipelines, advanced analytics, and full AI assistance:
1. Click **Upgrade to Pro** in the top navigation bar.
2. Select either **Monthly** or discounted **Annual** billing.
3. Click **Proceed to Checkout** to open the secure payment modal.
4. Enter your payment details inside the secure gateway window.
5. Upon confirmation, your workspace unlocks Pro features immediately.

### 5.3 Cancellations & Downgrades
- You can cancel auto-renewal at any time under **Settings > Subscription**.
- If you cancel, your Pro access remains active until the end of your current paid billing cycle, after which your account reverts to the Free tier without losing any existing records.

---

## 6. Frequently Asked Questions (FAQ)

**Q: Does SoloOS ever send messages to clients on my behalf without asking?**  
*A: Absolutely not. SoloOS adheres to a strict human-in-the-loop policy. Every AI-drafted message is displayed in an editable review modal and requires your explicit approval before anything is sent or recorded.*

**Q: Will I lose my data if I cancel my Pro subscription?**  
*A: No. All existing leads, client histories, proposals, and notes remain safely stored in your account. You will simply return to Free tier limits for new entries.*

**Q: Is my client data used to train public AI models?**  
*A: No. All requests to our hosted AI provider are transmitted with enterprise privacy headers ensuring zero data retention. Your client information is never used to train public models.*

**Q: Does SoloOS store my credit card details?**  
*A: No. All transactions occur within our PCI-DSS compliant payment partner's secure modal. SoloOS never stores or sees your payment card numbers.*

**Q: What happens if the AI service is temporarily offline?**  
*A: SoloOS features graceful degradation. If the AI provider is unavailable, you can continue to use all base CRM features — adding leads, dragging cards, and writing follow-ups manually — with zero interruption.*

---

## 7. Troubleshooting & Support

If you encounter an unexpected issue:
1. **Refresh your browser**: A standard page refresh will re-synchronize your client state with the cloud data store.
2. **Check your network**: Confirm that your internet connection is active.
3. **Hard refresh**: If UI updates appear cached, perform a hard refresh (`Ctrl + F5` on Windows/Linux or `Cmd + Shift + R` on macOS).

### Contacting Support
For direct technical assistance, bug reports, or feature suggestions:
- **Support Contact Email**: anaysharmabiz@gmail.com
- **Project Lead**: Anay Sharma
- **GitHub Repository & Issues**: https://github.com/AnaySharmaCEO/SoloOS
- **Support Operating Hours**: Monday – Friday, 09:00 – 18:00 IST
