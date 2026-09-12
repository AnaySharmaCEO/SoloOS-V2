# SoloOS — Front-End Deployment & Operations Guide

| Version | Date | Author | Change |
|---|---|---|---|
| 0.1 | August 15, 2026 | Anay Sharma | Initial Phase 1 Base CRM UI-layer deployment procedures |
| 0.2 | September 12, 2026 | Anay Sharma | Extended for Phase 2 AI feature flags and multi-stage hosting configurations |

---

## 1. Scope & Architecture Boundary

This document defines the build, verification, and deployment procedures for the **SoloOS Front-End User Interface Application Layer (UI Layer)**.

> [!IMPORTANT]
> **Out-of-Scope Notice**: In accordance with the repository security and architectural boundaries (Rule 2), physical backend database servers, relational database schema migrations, serverless edge function runtimes, and private third-party API secrets (payment gateway private keys, AI provider secrets) are managed in dedicated private infrastructure environments and are **strictly out of scope** for this document and client repository.

---

## 2. Build Prerequisites & Toolchain

The SoloOS client application compiles into static HTML, JavaScript, and CSS assets suitable for global distribution across modern static hosting networks or edge Content Delivery Networks (CDNs).

### 2.1 System Requirements
- **Runtime**: Node.js v18.16.0 LTS or higher (v20.x LTS recommended).
- **Package Manager**: `npm` (v9.x+) or `pnpm` (v8.x+).
- **Git**: Distributed version control client.
- **Repository**: `https://github.com/AnaySharmaCEO/SoloOS`

---

## 3. Environment Variables Configuration

The front-end build requires public configuration parameters injected at compile or runtime. These variables expose client-facing endpoint identifiers, public client tokens, and feature flags only.

| Environment Variable Name | Classification | Description | Example / Format |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Public / Non-Secret | Managed Backend API service endpoint URL | `https://your-project-id.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Public / Non-Secret | Client-side anonymous public access token for BaaS calls | `eyJhbGciOi...` (Public Anon JWT) |
| `VITE_BILLING_PROVIDER` | Public / Non-Secret | Identifier of the active client payment adapter | `razorpay` |
| `VITE_RAZORPAY_KEY_ID` | Public / Non-Secret | Public publishable API key for client checkout modal | `rzp_live_...` or `rzp_test_...` |
| `VITE_AI_ENABLED` | Public / Feature Flag | Master toggle enabling Phase 2 AI-assisted selling UI views | `true` or `false` |

> [!CAUTION]
> **Security Protocol**: Never place private server-side secrets (such as backend database administrative service-role keys, private payment gateway secret keys, or private AI provider API tokens) into front-end environment files or build systems. Any variable prefixed with `VITE_` is compiled directly into public client-side JavaScript bundles and is inspectable by end users.

---

## 4. Local Build & Packaging Procedure

### 4.1 Step 1: Clone Repository
```bash
git clone https://github.com/AnaySharmaCEO/SoloOS
cd soloos-app
```

### 4.2 Step 2: Install Clean Dependencies
```bash
npm ci
# Or if using pnpm:
# pnpm install --frozen-lockfile
```

### 4.3 Step 3: Configure Environment
Copy the sanitized configuration template:
```bash
cp .env.example .env
```
Populate `.env` with your environment-specific public variables as specified in Section 3.

### 4.4 Step 4: Execute Production Build
```bash
npm run build
```
This command triggers the TypeScript compiler check (`tsc`) followed by the Vite production asset pipeline:
- Code minification and dead-code tree shaking.
- CSS asset extraction and optimization via PostCSS.
- Cache-busting content hashing on compiled chunk files.
- Static output compilation directly into the `./dist` directory.

### 4.5 Step 5: Local Production Preview
To verify the compiled production bundle locally before promoting to remote environments:
```bash
npm run preview
```
Open `http://localhost:4173` to test the minified production bundle in a local HTTP server environment.

---

## 5. Static Hosting Platform Configurations

Because SoloOS is a Single Page Application utilizing client-side routing, the hosting platform must be configured to route all incoming HTTP requests to `index.html` (Single Page Rewrites / Fallbacks).

### 5.1 Option A: Vercel (Recommended)
1. Link your Git repository within the Vercel dashboard.
2. Select the **Vite** framework preset.
3. Set **Build Command**: `npm run build`.
4. Set **Output Directory**: `dist`.
5. Add public environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AI_ENABLED`, etc.) under Project Settings > Environment Variables.
6. Configure SPA rewrites in `vercel.json` (if not auto-detected):
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

### 5.2 Option B: Netlify
1. Connect repository in Netlify.
2. Set **Build command**: `npm run build`.
3. Set **Publish directory**: `dist`.
4. Add environment variables in Netlify Site Configuration.
5. Create a `public/_redirects` file with SPA fallback routing:
   ```text
   /*    /index.html   200
   ```

### 5.3 Option C: Cloudflare Pages
1. Create a project under Cloudflare Pages connected to the repository branch.
2. Select **Vite** preset (Build command: `npm run build`, Output directory: `dist`).
3. Configure environment variables in Cloudflare Dashboard.
4. Supply a `public/_routes.json` or standard single-page routing rule.

---

## 6. Pre-Production Promotion Checklist

Before promoting a build to live production, verify each item on the checklist:

- [ ] **Type & Lint Check**: Run `npm run lint` and `tsc --noEmit` with zero errors.
- [ ] **Build Verification**: `npm run build` succeeds cleanly with zero bundle resolution warnings.
- [ ] **Environment Audit**: Confirm that only public `VITE_` keys are present and no internal database or private AI provider keys appear in the bundle.
- [ ] **SPA Fallback Routing**: Confirm deep links (e.g., navigating directly to `/pipeline` or `/settings`) reload successfully without HTTP 404 errors.
- [ ] **SSL / TLS Certificate**: Confirm the custom domain terminates TLS 1.3 with a valid HTTPS certificate.
- [ ] **Payment Modal Verification**: Perform a test checkout transaction on staging using sandbox gateway credentials.
- [ ] **AI Graceful Degradation Check**: Verify that when `VITE_AI_ENABLED=false` or when AI provider requests time out, all base CRM features remain 100% operational.
- [ ] **Responsive Viewport Check**: Validate UI rendering across mobile (375px), tablet (768px), and widescreen desktop (1920px).
- [ ] **Asset Caching Headers**: Ensure static assets (`/assets/*.js`, `*.css`) receive long-term immutable caching headers (`Cache-Control: public, max-age=31536000, immutable`), while `index.html` receives no-cache headers (`Cache-Control: no-cache, no-store, must-revalidate`).

---

## 7. Rollback & Incident Response Runbook

In the event of a critical client defect or regression in production:

1. **Instant CDN Rollback**:
   - In your hosting platform dashboard (Vercel / Netlify / Cloudflare), locate the previous stable deployment in deployment history.
   - Click **Instant Rollback / Promote to Production**. The edge CDN redirects traffic to the prior immutable build within seconds.
2. **Post-Rollback Triage**:
   - Identify whether the regression was introduced by UI code or an external provider dependency.
   - Reproduce the incident in local staging (`npm run preview`).
   - If caused by an external AI provider outage, toggle `VITE_AI_ENABLED=false` in environment settings to instantly disable AI features without altering application code.
   - Author a targeted hotfix branch, execute the verification checklist, and merge via normal CI/CD controls.

---

## 8. Support Contact

For deployment operations or infrastructure questions:
- **Lead Engineer**: Anay Sharma
- **Contact**: anaysharmabiz@gmail.com
- **Repository**: https://github.com/AnaySharmaCEO/SoloOS
