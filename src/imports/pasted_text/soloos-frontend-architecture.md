# SoloOS Frontend Architecture + UI/UX Build Instruction

## Project Context

You are building the frontend for a SaaS product called **SoloOS**.

SoloOS is an:

# Inbox-First Revenue OS for Solo Freelancers

It is NOT just another CRM.

It is a system built specifically for:

* copywriters
* marketers
* solo consultants
* service sellers

who get clients through:

* cold email
* Instagram DMs
* LinkedIn outreach
* X/Twitter
* referrals
* inbound leads

and struggle with:

* missed follow-ups
* lost warm leads
* pricing confusion
* proposal delays
* revenue leakage

The core promise is:

# Help users move faster from Lead → Paid → Repeat Client

without enterprise CRM complexity.

The MVP focuses on:

# Preventing deal loss from missed follow-ups

with:

# Pricing support as the secondary wedge

This is NOT an enterprise CRM.
Do not design like Salesforce, HubSpot, or generic admin dashboards.

The product should feel like:

# a personal revenue operating system

not

# a corporate database.

---

# Core UX Philosophy

Every UI decision must answer:

# Who needs my attention right now?

The app must prioritize:

* action over analytics
* clarity over complexity
* speed over feature overload
* execution over storage

Users should open the app and immediately know:

# what to do today

not stare at useless charts.

The product should reduce mental friction.

The user should feel:

# This helps me make money

not

# This helps me organize things.

---

# Frontend Stack

Use:

* React.js
* Vite
* Tailwind CSS
* React Router
* React Query
* Context API
* React Hook Form
* reusable component structure

Do NOT use Redux initially.
Do NOT overengineer.

---

# Architecture Requirement

Before implementing UI pages:

# First create the frontend architecture structure

including:

* folder structure
* route structure
* reusable layout system
* protected route flow
* service layer abstraction
* hooks layer
* state structure
* API integration structure

This must be scalable and clean.

---

# Required Folder Structure

```text
src/

 ├── components/
 │    ├── ui/
 │    ├── dashboard/
 │    ├── leads/
 │    ├── pricing/
 │    └── followups/

 ├── pages/
 │    ├── auth/
 │    ├── onboarding/
 │    ├── dashboard/
 │    ├── leads/
 │    ├── pricing/
 │    ├── proposals/
 │    └── settings/

 ├── hooks/
 │    ├── useAuth.js
 │    ├── useLeads.js
 │    ├── useFollowups.js
 │    └── usePricing.js

 ├── services/
 │    ├── api/
 │    │    └── supabaseClient.js
 │    ├── leadService.js
 │    ├── followupService.js
 │    ├── pricingService.js
 │    ├── proposalService.js
 │    └── authService.js

 ├── context/
 │    └── AuthContext.jsx

 ├── routes/
 │    └── ProtectedRoutes.jsx

 ├── layouts/
 │    └── DashboardLayout.jsx

 ├── utils/
 │    ├── pricingHelpers.js
 │    ├── dateHelpers.js
 │    └── stageHelpers.js

 ├── constants/
 │    └── pipelineStages.js

 └── App.jsx
```

---

# API Layer Rule (Very Important)

The `services/api` file is the bridge between:

# Supabase backend

and

# frontend hooks + services

Meaning:

Supabase should NOT be called directly inside components.

Correct structure:

```text
Component
→ Hook
→ Service
→ API layer
→ Supabase
```

Example:

```text
Dashboard.jsx
→ useFollowups()
→ followupService.js
→ supabaseClient.js
→ Supabase
```

This is mandatory.

Do not violate this.

This is required for scaling and maintainability.

---

# UX Flow + UI Mapping

---

# Screen 1 — Onboarding

## Goal

Understand who the user is.

## UX Goal

Make onboarding feel like setup for a personal operating system.

Not boring forms.

## Questions

1. What do you do?

* copywriter
* marketer
* consultant
* media buyer
* email marketer

2. Current business stage?

* no clients yet
* first few clients
* stable monthly clients
* scaling systems

3. Biggest blocker?

* forgetting follow-ups
* pricing confusion
* proposal delays
* inconsistent leads
* client retention

4. Average project value?

## UI Requirements

* clean step-based onboarding
* progress indicator
* minimal friction
* modern SaaS feel
* no giant forms

Output:
Dashboard becomes personalized.

---

# Screen 2 — Dashboard (Most Important)

## Goal

This is the action center.

## UX Goal

User opens app and instantly knows:

# what must be done today

## UI Priority

### Section 1 — TODAY (top priority)

Examples:

* Follow up with Rahul
* Proposal reply pending from Sarah
* Warm lead inactive for 4 days
* Pricing decision pending

This must dominate the page.

### Section 2 — Quick Metrics

Only:

* warm leads
* pending follow-ups
* proposals pending
* this month revenue

Minimal only.

### Section 3 — Quick Actions

Buttons:

* Add Lead
* Log Response
* Open Pricing Engine

Fast actions.

Do NOT make dashboard chart-heavy.

---

# Screen 3 — Lead Pipeline

## Goal

Visual progression of opportunities.

## UX Goal

Users think visually.

Use:

# Kanban Board

Columns:

* New Lead
* Contacted
* Waiting Reply
* Warm Lead
* Proposal Sent
* Won
* Lost

## Card UI Must Show

* client name
* company
* last contact
* next action due
* estimated value

## Quick Actions

* move stage
* mark replied
* schedule follow-up
* open pricing

Fast interaction required.

---

# Screen 4 — Lead Detail Page

## Goal

Full command center for one lead.

## Must Include

* conversation timeline
* last contact
* next follow-up
* proposal status
* pricing history
* notes
* quick actions

## Strong UX Requirement

Risk alerts must be obvious.

Example:

# No reply for 5 days

This should be visually strong.

---

# Screen 5 — Follow-Up Engine (Main Wedge)

## Goal

Prevent revenue leakage.

## UX Goal

This should feel like:

# revenue protection system

not reminders.

## View Structure

Sections:

* Urgent Today
* Follow Up Tomorrow
* At Risk Leads

Each entry shows:

* who
* why follow-up is needed
* suggested message
* urgency level

Actions:

* Send
* Mark Done
* Snooze

This is the main retention screen.

---

# Screen 6 — Pricing Engine

## Goal

Stop users from underpricing.

## Inputs

* service type
* deliverables
* project scope
* deadline urgency
* expected business impact
* monthly vs one-time

## Output

Show:

# Recommended Price Range

Example: $2000 – $4000

plus:

* confidence score
* underpricing warning
* pricing model recommendation

This should feel premium and high-value.

---

# Screen 7 — Proposal Tracker

## Goal

Track proposal stage.

Not full proposal generation yet.

## UI Shows

* proposal amount
* sent date
* expected reply date
* status

Statuses:

* Pending
* Accepted
* Rejected

If delayed:
follow-up reminder triggers.

---

# Screen 8 — Revenue Overview

## Goal

Emotional proof of progress.

## Keep Simple

Only:

* monthly revenue
* closed deals
* pending revenue
* average deal size
* repeat client percentage

No finance ERP style complexity.

---

# Protected Route Logic

Rules:

No auth → Login page

Authenticated but onboarding incomplete → Onboarding

Authenticated + onboarding complete → Dashboard

This must be clean and reliable.

---

# Design Style Rules

The UI should feel:

* modern
* clean
* premium
* focused
* minimal
* fast

Avoid:

* enterprise clutter
* too many tables
* corporate dashboard look
* overwhelming settings
* excessive colors
* generic template SaaS appearance

Think:

# Notion + Linear + modern SaaS clarity

with

# freelancer-first usability

---

# Final Build Instruction

Do NOT start by building random pages.

Build in this order:

1. Frontend architecture
2. Auth flow
3. Onboarding
4. Dashboard layout
5. Lead capture + pipeline
6. Follow-up engine
7. Pricing engine
8. Proposal tracking
9. Revenue overview

Focus on:

# retention-driving UX first

not polish first.

The product wins if users return daily.

That depends on:

# Follow-Up Engine + Today Dashboard

These are the highest priority areas.

Build like a founder product.

Not like a template SaaS clone.
