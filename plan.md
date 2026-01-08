# GTM.quest Transformation Plan: CopilotKit + Hume AI Showcase

## Executive Summary

Transform GTM.quest from an SEO-focused content site into an **interactive AI-powered GTM consultation experience** using CopilotKit and Hume AI. The key insight: CopilotKit is **NOT constrained to sidebar widgets** - you can render agent state anywhere via `useCoAgent`, enabling full-page "cold reports" that build up through conversation.

### Design Decisions (Confirmed)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Interaction Mode** | Voice-first (Hume prominent) | More impressive as showcase, differentiates from typical chatbots |
| **Session Handling** | Auth required for full features | Basic demo anonymous, auth for save/export/full recommendations |
| **Primary Goal** | Showcase first | Prioritize "wow factor" and visual polish, lead capture secondary |
| **Initial Data** | Real data from existing DB | Use existing GTM agencies, enhance with additional providers |
| **Build Approach** | Fresh build (not clone) | Ultra-clean, new interface, avoid CopilotKit-demo bloat |

---

## Tech Stack (Matching CopilotKit-demo)

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 16.x |
| **React** | React | 19.x |
| **AI Chat** | CopilotKit | 1.50.1 |
| **AI Protocol** | AG-UI | 0.0.42 |
| **Backend Agent** | Pydantic AI | latest |
| **LLM** | Google Gemini 2.0 Flash | via Pydantic AI |
| **Voice** | Hume EVI | 0.2.11 |
| **Memory** | Zep Cloud | 3.x |
| **Auth** | Neon Auth | beta |
| **Database** | Neon PostgreSQL | serverless |
| **Styling** | Tailwind CSS | 4.x |
| **Deploy Frontend** | Vercel | - |
| **Deploy Backend** | Railway | - |

### Build Approach: Fresh, Not Clone

**Why fresh build:**
- CopilotKit-demo has bloat (1,619 line page.tsx, 75 SEO pages, 2,507 line agent.py)
- You want "ultra clean" + new interface
- GTM.quest has different content structure

**What to extract from CopilotKit-demo:**
- CopilotKit + Pydantic AI + AG-UI wiring pattern
- Hume EVI → CLM endpoint integration
- Neon Auth setup
- Zep memory integration
- User context passing via instructions prop

**Build order (proven from CopilotKit-demo learnings):**
1. CopilotKit + Pydantic AI (core chat) - FIRST
2. Neon Auth - SECOND
3. Hume voice - LAST (most complex, depends on everything else)

---

## Architecture Vision: "Report-First" Design

```
┌─────────────────────────────────────────────────────────────┐
│                     GTM.quest Layout                        │
├─────────────────────────────────────────┬───────────────────┤
│                                         │                   │
│         MAIN PANEL (70%)                │  SIDEBAR (30%)    │
│                                         │                   │
│  ┌─────────────────────────────────┐   │  ┌─────────────┐  │
│  │  GTM Strategy Report            │   │  │ Voice Chat  │  │
│  │  (populates as you talk)        │   │  │ + Hume EVI  │  │
│  └─────────────────────────────────┘   │  │             │  │
│                                         │  │ "Tell me   │  │
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │  │  about your│  │
│  │ROI Card  │ │Providers │ │Use Case│  │  │  product"  │  │
│  │          │ │We Rec.   │ │Example │  │  │             │  │
│  └──────────┘ └──────────┘ └────────┘  │  └─────────────┘  │
│                                         │                   │
│  ┌─────────────────────────────────┐   │  Mobile: Popup    │
│  │  Budget Breakdown Chart         │   │  instead of       │
│  │  (animated as data arrives)     │   │  sidebar          │
│  └─────────────────────────────────┘   │                   │
│                                         │                   │
└─────────────────────────────────────────┴───────────────────┘
```

**Key Pattern**: `useCoAgent` syncs state from the backend agent to the main panel. As the user talks, the agent populates `state.strategy`, `state.providers`, `state.roiProjection`, etc. - and React components on the main panel reactively render these.

---

## Answer: Is CopilotKit Constrained to Sidebar?

**NO.** CopilotKit offers multiple UI patterns:

| Component | Use Case |
|-----------|----------|
| `CopilotSidebar` | Wraps content, collapsible sidebar |
| `CopilotPopup` | Floating chat bubble |
| `CopilotChat` | **Place anywhere, any size** |
| `useCopilotChat` (headless) | **Fully custom UI** |
| `useCoAgent` | **Render state outside chat** |

For GTM.quest, we'll use:
- **Sidebar/Popup** for the conversational interface
- **`useCoAgent`** to populate the main panel report in real-time
- **Generative UI** via `useRenderToolCall` for rich cards in chat

---

## Phase 1: Core CopilotKit Integration

### 1.1 Install Dependencies

```bash
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime @ag-ui/client
```

### 1.2 Create CopilotKit Provider

**File: `app/providers/CopilotProvider.tsx`**

Wrap the app with CopilotKit, connecting to the Pydantic AI backend.

### 1.3 Create CopilotKit API Route

**File: `app/api/copilotkit/route.ts`**

Proxy requests to the Python agent backend using `HttpAgent` from `@ag-ui/client`.

### 1.4 Create Responsive Chat Component

**File: `app/components/GTMChat.tsx`**

- Desktop: `CopilotSidebar` (collapsible, 30% width)
- Mobile: `CopilotPopup` (floating button)
- Custom instructions for GTM advisor persona

---

## Phase 2: Python Agent Backend

### 2.1 Agent Structure

**Directory: `agent/`**
```
agent/
├── src/
│   ├── agent.py          # Main Pydantic AI agent
│   ├── tools/
│   │   ├── strategy.py   # GTM strategy generation
│   │   ├── providers.py  # Provider recommendations
│   │   ├── roi.py        # ROI calculations
│   │   └── use_cases.py  # Industry use case lookup
│   └── database.py       # Neon PostgreSQL queries
├── pyproject.toml
└── README.md
```

### 2.2 Agent State Schema

```python
class GTMState(BaseModel):
    # Company info (synced from frontend)
    company_name: str | None = None
    industry: str | None = None
    stage: str | None = None
    target_market: str | None = None

    # Generated outputs (populate main panel)
    strategy: GTMStrategy | None = None
    recommended_providers: list[Provider] = []
    roi_projection: ROIProjection | None = None
    use_cases: list[UseCase] = []
    budget_breakdown: BudgetBreakdown | None = None
    timeline_phases: list[Phase] = []
```

### 2.3 Agent Tools

| Tool | Purpose | Updates State |
|------|---------|---------------|
| `gather_company_info` | Extract company details from conversation | `company_name`, `industry`, `stage` |
| `generate_strategy` | Create GTM approach (PLG/Sales-Led/Hybrid) | `strategy` |
| `recommend_providers` | Query Neon for matching agencies/tools | `recommended_providers` |
| `calculate_roi` | Project ROI based on inputs | `roi_projection` |
| `find_use_cases` | Find similar companies in database | `use_cases` |
| `create_budget` | Generate budget breakdown | `budget_breakdown` |

---

## Phase 3: Main Panel Report Components

### 3.1 Report Container

**File: `app/components/report/GTMReport.tsx`**

```tsx
const { state } = useCoAgent<GTMState>({ name: "gtm_agent" });

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {state.strategy && <StrategyCard strategy={state.strategy} />}
    {state.recommended_providers.length > 0 && (
      <ProvidersCard providers={state.recommended_providers} />
    )}
    {state.roi_projection && <ROICard projection={state.roi_projection} />}
    {state.use_cases.length > 0 && <UseCasesGrid cases={state.use_cases} />}
    {state.budget_breakdown && <BudgetChart breakdown={state.budget_breakdown} />}
  </div>
);
```

### 3.2 Visual Card Components

| Component | Visual Style | Data Source |
|-----------|--------------|-------------|
| `StrategyCard` | Hero card with gradient, icon, summary | `state.strategy` |
| `ProvidersCard` | Grid of agency logos + ratings | `state.recommended_providers` |
| `ROICard` | Animated counter + chart | `state.roi_projection` |
| `UseCasesGrid` | Case study cards with company logos | `state.use_cases` |
| `BudgetChart` | Pie/bar chart (recharts or chart.js) | `state.budget_breakdown` |
| `TimelinePhases` | Horizontal timeline with milestones | `state.timeline_phases` |

### 3.3 Animations

- Cards fade in as state populates
- Numbers animate (count up)
- Charts draw progressively
- Skeleton loaders while waiting

---

## Phase 4: Hume AI Voice Integration

### 4.1 Voice Components

**File: `app/components/voice/VoiceAdvisor.tsx`**

Reuse pattern from `loss.london`:
- Hume EVI for voice input/output
- Custom system prompt with GTM advisor persona
- Forward transcripts to CopilotKit via `appendMessage`

### 4.2 Hume Token Endpoint

**File: `app/api/hume-token/route.ts`**

Generate OAuth tokens for Hume connection.

### 4.3 Voice UI Elements

- Animated waveform during speech
- Push-to-talk or voice activity detection
- Visual indicator when AI is "thinking"

---

## Phase 5: Database Schema (Neon)

### 5.1 New Tables

```sql
-- GTM providers/agencies
CREATE TABLE gtm_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- 'agency', 'tool', 'platform'
  specializations TEXT[],
  industries TEXT[],
  company_stages TEXT[], -- 'seed', 'series_a', 'growth', 'enterprise'
  pricing_tier TEXT, -- 'budget', 'mid', 'premium'
  logo_url TEXT,
  website TEXT,
  description TEXT,
  rating DECIMAL(2,1),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Use cases / success stories
CREATE TABLE gtm_use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  company_stage TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB, -- { "revenue_increase": "150%", "time_to_market": "3 months" }
  providers_used UUID[],
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ROI benchmarks by industry/stage
CREATE TABLE gtm_roi_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  company_stage TEXT NOT NULL,
  strategy_type TEXT, -- 'plg', 'sales_led', 'hybrid'
  avg_cac DECIMAL(10,2),
  avg_ltv DECIMAL(10,2),
  avg_payback_months INTEGER,
  typical_budget_range JSONB, -- { "min": 50000, "max": 200000 }
  success_rate DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversation sessions (for returning users)
CREATE TABLE gtm_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  state JSONB, -- Full GTMState snapshot
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Data Strategy (Using Existing DB)

**Leverage existing GTM.quest data:**
- `companies` table already has GTM agencies (filter: `company_type='gtm_agency'`)
- Existing `specializations`, `overview`, `meta_description` fields
- Brand assets via brand.dev integration already working

**Enhance with:**
- Add `pricing_tier`, `company_stages` fields to existing agencies
- Create `gtm_use_cases` table with real success stories
- Create `gtm_roi_benchmarks` from industry research
- Link use cases to existing agencies via `providers_used`

**Migration approach:**
1. Add new columns to existing `companies` table
2. Create new tables for use cases and benchmarks
3. Backfill existing agencies with pricing/stage data
4. No data loss, purely additive

---

## Phase 6: User Experience Flow

### 6.1 Voice-First Landing Experience

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│            [Animated waveform background]                   │
│                                                             │
│                    GTM.quest                                │
│                                                             │
│     ┌─────────────────────────────────────┐                │
│     │                                     │                │
│     │      🎙️  [Large Pulse Button]       │                │
│     │                                     │                │
│     │   "Speak with our AI Strategist"    │                │
│     │                                     │                │
│     └─────────────────────────────────────┘                │
│                                                             │
│              [or type your question →]                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Anonymous User Journey (Demo Mode)

```
1. User lands on GTM.quest
   → Voice button pulses invitingly
   → "Speak with our AI GTM Strategist"

2. User clicks voice button
   → Hume EVI activates
   → Warm greeting: "Hi! I'm your GTM strategist. Tell me about your company."

3. User speaks
   → "I'm building a B2B SaaS for healthcare"
   → Voice responds while report populates

4. Report builds in real-time
   → Strategy card fades in: "Product-Led Growth recommended"
   → 3 provider cards appear (teaser - blurred/limited)
   → ROI card shows range estimate

5. Conversion point
   → "To see all 12 matching providers and save your report..."
   → Sign in prompt (Stack auth)
   → Or continue limited demo
```

### 6.3 Authenticated User Journey (Full Features)

```
1. User signs in
   → Full provider list unlocks
   → Export to PDF enabled
   → Session auto-saves

2. Enhanced recommendations
   → Provider ratings visible
   → Direct booking links
   → Personalized budget breakdown

3. Returning user
   → "Welcome back! Last time we discussed healthcare SaaS..."
   → Previous report pre-loaded
   → Continue refining strategy
```

### 6.4 Showcase "Wow" Moments

| Moment | Visual Effect |
|--------|---------------|
| Voice activation | Waveform expands from button |
| First strategy reveal | Card slides up with gradient glow |
| Provider match | Logos animate in with match % |
| ROI calculation | Numbers count up dramatically |
| Report complete | Celebration confetti + share prompt |

---

## Phase 7: Page Structure Changes

### 7.1 Homepage Transformation

**Current**: Hero + content sections + agency directory

**New (Voice-First)**:
- **Landing state**: Full-screen voice CTA with animated waveform background
- **Active state**: Split layout - Report (70%) + Voice/Chat sidebar (30%)
- **Mobile**: Voice button overlay, report scrolls below

```
LANDING STATE:
┌────────────────────────────────────────┐
│                                        │
│          [Waveform Animation]          │
│                                        │
│              🎙️ SPEAK                  │
│     "Talk to our AI GTM Strategist"    │
│                                        │
│         [or type →] ___________        │
│                                        │
└────────────────────────────────────────┘

ACTIVE STATE (after voice starts):
┌───────────────────────────┬────────────┐
│                           │            │
│   GTM REPORT              │  🎙️ Voice  │
│   [Builds as you talk]    │  ~~~~~~~~  │
│                           │  Chat log  │
│   [Strategy Card]         │  below     │
│   [Providers Grid]        │            │
│   [ROI Chart]             │  [Sign in  │
│                           │   to save] │
└───────────────────────────┴────────────┘
```

### 7.2 Keep Existing Pages

- `/what-is-gtm` - Educational content (good for SEO)
- `/best-gtm-agencies` - Directory (link from providers)
- `/agency/[slug]` - Agency detail pages
- `/articles` - Content hub

### 7.3 New Pages

- `/report/[id]` - Shareable report view
- `/book-call` - Schedule with recommended provider

---

## Implementation Order (Fresh Build)

### Phase 1: Fresh Next.js + CopilotKit + Pydantic AI
**Goal**: Get chat working end-to-end before anything else

```bash
# 1. Create fresh Next.js project
npx create-next-app@latest gtm-quest-v2 --typescript --tailwind --app

# 2. Install core dependencies
npm install @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
npm install @ag-ui/client
```

**Files to create (minimal):**
- `app/layout.tsx` - CopilotKit provider wrapper
- `app/page.tsx` - Simple sidebar chat
- `app/api/copilotkit/route.ts` - Proxy to Python agent
- `agent/src/agent.py` - Basic Pydantic AI agent

**Extract from CopilotKit-demo:**
- `/Users/dankeegan/copilotkit-demo/src/app/api/copilotkit/route.ts` → API route pattern
- `/Users/dankeegan/copilotkit-demo/agent/src/agent.py` → Agent structure (trim to essentials)

**Checkpoint**: Chat works, agent responds, state syncs via `useCoAgent`

### Phase 2: Neon Auth Integration
**Goal**: Add authentication before voice (voice needs user context)

```bash
npm install @neondatabase/auth @neondatabase/neon-js @neondatabase/serverless
```

**Files to create:**
- `lib/auth/client.ts` - Neon Auth client
- `lib/auth/server.ts` - Session handling
- `app/api/auth/*` - Auth routes
- `components/AuthButton.tsx` - Sign in/out

**Extract from CopilotKit-demo:**
- `/Users/dankeegan/copilotkit-demo/src/lib/auth/` → Auth setup

**Checkpoint**: Users can sign in, session persists, user context available

### Phase 3: Main Panel Report + State Sync
**Goal**: Report builds in real-time as user talks

**Files to create:**
- `components/report/GTMReport.tsx` - Uses `useCoAgent` to render state
- `components/report/StrategyCard.tsx`
- `components/report/ProvidersCard.tsx`
- `components/report/ROICard.tsx`

**Agent tools to implement:**
- `gather_company_info` - Extract company details from conversation
- `generate_strategy` - Create GTM approach
- `recommend_providers` - Query database for matches

**Checkpoint**: Conversation populates visual cards on main panel

### Phase 4: Database Integration
**Goal**: Real recommendations from Neon database

**Use existing GTM.quest database:**
- Connect to existing `companies` table
- Add new columns: `pricing_tier`, `company_stages`
- Create `gtm_use_cases` and `gtm_roi_benchmarks` tables

**Agent tools to enhance:**
- `recommend_providers` - Real database queries
- `calculate_roi` - Use benchmark data
- `find_use_cases` - Match similar companies

**Checkpoint**: Recommendations are real, not mocked

### Phase 5: Hume Voice Integration (LAST)
**Goal**: Voice-first experience with EVI

```bash
npm install @humeai/voice-react
```

**Files to create:**
- `app/api/hume-token/route.ts` - Token generation
- `app/api/hume-webhook/route.ts` - Event handling
- `app/api/chat/completions/route.ts` - CLM endpoint
- `components/voice/VoiceWidget.tsx` - Voice UI

**Extract from CopilotKit-demo:**
- `/Users/dankeegan/copilotkit-demo/src/components/voice-input.tsx` → Voice widget
- `/Users/dankeegan/copilotkit-demo/src/app/api/hume-token/route.ts` → Token endpoint
- `/Users/dankeegan/copilotkit-demo/src/app/api/chat/completions/route.ts` → CLM endpoint

**Checkpoint**: Full voice-first experience working

### Phase 6: Polish & Showcase
**Goal**: "Wow factor" for demo

- Voice-first landing page with animated waveform
- Card animations (fade in, count up numbers)
- Confetti on report completion
- PDF export
- Mobile optimization

**Checkpoint**: Ready to show off

---

## Fresh Build File Structure

```
gtm-quest-v2/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx              # CopilotKit + Neon Auth providers
│   ├── page.tsx                # Voice-first landing → Report + Chat
│   ├── globals.css             # Tailwind + custom styles
│   │
│   └── api/
│       ├── copilotkit/
│       │   └── route.ts        # CopilotKit → Pydantic AI proxy
│       ├── auth/
│       │   └── [...neon]/route.ts  # Neon Auth routes
│       ├── hume-token/
│       │   └── route.ts        # Hume access token
│       ├── hume-webhook/
│       │   └── route.ts        # Voice event storage
│       └── chat/
│           └── completions/
│               └── route.ts    # CLM endpoint for Hume
│
├── components/
│   ├── report/
│   │   ├── GTMReport.tsx       # Main panel (uses useCoAgent)
│   │   ├── StrategyCard.tsx    # GTM approach card
│   │   ├── ProvidersCard.tsx   # Agency recommendations
│   │   ├── ROICard.tsx         # ROI projection with animation
│   │   └── UseCasesGrid.tsx    # Similar company cases
│   │
│   ├── voice/
│   │   └── VoiceWidget.tsx     # Hume EVI integration
│   │
│   ├── auth/
│   │   └── AuthButton.tsx      # Sign in/out
│   │
│   └── ui/                     # Shared UI components
│
├── lib/
│   ├── auth/
│   │   ├── client.ts           # Neon Auth client
│   │   └── server.ts           # Session handling
│   ├── db.ts                   # Neon PostgreSQL connection
│   └── types.ts                # GTMState, User types
│
└── agent/                      # Python backend (separate repo or monorepo)
    ├── pyproject.toml
    ├── Procfile                # Railway deployment
    └── src/
        ├── agent.py            # Main Pydantic AI agent
        ├── tools/
        │   ├── strategy.py     # GTM strategy generation
        │   ├── providers.py    # Database queries for agencies
        │   ├── roi.py          # ROI calculations
        │   └── use_cases.py    # Case study matching
        └── db.py               # Neon connection
```

### Key Differences from CopilotKit-demo

| Aspect | CopilotKit-demo | GTM.quest v2 |
|--------|-----------------|--------------|
| **page.tsx** | 1,619 lines (monolithic) | ~200 lines (clean) |
| **agent.py** | 2,507 lines (one file) | Split into tools/ |
| **SEO pages** | 75 separate files | Single template + data |
| **Report** | In chat only | Main panel via `useCoAgent` |
| **Landing** | Text chat | Voice-first with waveform |

---

## Verification Plan

1. **Unit Tests**: Agent tools return correct state updates
2. **Integration Test**: Frontend receives state via `useCoAgent`
3. **E2E Test**: Full conversation → report generation
4. **Visual Test**: Cards render correctly, animations work
5. **Voice Test**: Hume → CopilotKit → Agent flow
6. **Mobile Test**: Popup works, report scrolls properly

---

## Questions Resolved

| Question | Answer |
|----------|--------|
| Is CopilotKit sidebar-only? | **No** - use `CopilotChat` anywhere, `useCoAgent` for main panel |
| Can we do "cold reports"? | **Yes** - `useCoAgent` renders state outside chat |
| Voice integration? | **Yes** - Hume EVI → forward to CopilotKit |
| Database for recommendations? | **Yes** - Neon PostgreSQL, agent queries via tools |
