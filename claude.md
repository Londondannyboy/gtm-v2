# GTM.quest v2 - Development Log

## Project Overview
Voice-first AI GTM consultation experience using CopilotKit + Hume AI + Pydantic AI.

---

## Progress Tracker

### Phase 1: CopilotKit + Pydantic AI (IN PROGRESS)
- [x] Create fresh Next.js project
- [x] Install CopilotKit dependencies
- [x] Create CopilotKit provider wrapper (`src/components/providers.tsx`)
- [x] Create `/api/copilotkit` route
- [x] Set up Python agent with Pydantic AI (`agent/src/agent.py`)
- [x] Create main page with CopilotSidebar + useCoAgent
- [ ] Test chat works end-to-end (needs agent running)

### Phase 2: Neon Auth
- [ ] Install Neon Auth dependencies
- [ ] Create auth client/server
- [ ] Create auth API routes
- [ ] Create AuthButton component
- [ ] Verify user context passes to agent

### Phase 3: Main Panel Report
- [ ] Create GTMReport container with useCoAgent
- [ ] Build StrategyCard component
- [ ] Build ProvidersCard component
- [ ] Build ROICard component
- [ ] Implement agent tools for state updates

### Phase 4: Database Integration
- [ ] Connect to existing GTM.quest database
- [ ] Add new columns to companies table
- [ ] Create gtm_use_cases table
- [ ] Create gtm_roi_benchmarks table
- [ ] Implement real database queries in agent

### Phase 5: Hume Voice Integration
- [ ] Create hume-token endpoint
- [ ] Create hume-webhook endpoint
- [ ] Create CLM endpoint for Hume
- [ ] Build VoiceWidget component
- [ ] Integrate voice with CopilotKit

### Phase 6: Polish & Showcase
- [ ] Voice-first landing page
- [ ] Card animations
- [ ] Confetti on completion
- [ ] PDF export
- [ ] Mobile optimization

---

## What Works

### 2026-01-08
- Fresh Next.js 16 project created at `/Users/dankeegan/gtm-quest-v2`
- Tailwind CSS configured
- TypeScript set up
- ESLint configured
- CopilotKit v1.50.1 installed with AG-UI client
- Provider wrapper created (`src/components/providers.tsx`)
- API route created (`src/app/api/copilotkit/route.ts`)
- Main page with CopilotSidebar + useCoAgent state sync
- Python agent created with 5 tools:
  - `generate_strategy` - Creates GTM strategy
  - `add_provider_recommendation` - Adds agency/tool recommendations
  - `generate_roi_projection` - Creates ROI projections
  - `add_use_case` - Adds success stories
  - `update_company_info` - Updates company details
- Build passes successfully

---

## What Doesn't Work / Issues Encountered

*(Track issues here as they arise)*

---

## Key Learnings from CopilotKit-demo

### Critical Patterns
1. **User context passing**: Use instructions prop + middleware extraction in agent
2. **State sync**: `useCoAgent` for rendering state outside chat
3. **Hume integration**: Voice → CLM endpoint → Pydantic AI agent
4. **Build order**: CopilotKit first, Neon Auth second, Hume last

### Files to Reference
- `/Users/dankeegan/copilotkit-demo/src/app/api/copilotkit/route.ts` - API route pattern
- `/Users/dankeegan/copilotkit-demo/agent/src/agent.py` - Agent structure
- `/Users/dankeegan/copilotkit-demo/src/lib/auth/` - Neon Auth setup
- `/Users/dankeegan/copilotkit-demo/src/components/voice-input.tsx` - Voice widget
- `/Users/dankeegan/copilotkit-demo/src/app/api/hume-token/route.ts` - Hume token
- `/Users/dankeegan/copilotkit-demo/src/app/api/chat/completions/route.ts` - CLM endpoint

### Bloat to Avoid
- CopilotKit-demo page.tsx is 1,619 lines - keep ours under 200
- CopilotKit-demo agent.py is 2,507 lines - split into tools/
- 75 SEO pages - use single template + dynamic data

---

## Environment Variables Needed

```env
# Database
DATABASE_URL=postgresql://...@neon.tech/...

# AI
GOOGLE_API_KEY=...

# Voice
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...

# Memory (optional)
ZEP_API_KEY=...

# Agent
AGENT_URL=http://localhost:8000
```

---

## Commands

```bash
# Development
npm run dev          # Frontend (port 3000)
cd agent && python -m uvicorn src.agent:app --reload  # Backend (port 8000)

# Deployment
vercel               # Frontend to Vercel
railway up           # Backend to Railway
```
