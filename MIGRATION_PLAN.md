# GTM.quest v2 Migration Plan

## Overview

Migrate content from original GTM.quest to the new voice-first v2 platform while preserving SEO rankings and adding CopilotKit/Hume AI capabilities.

---

## Current State

### Original GTM.quest Database (ep-green-smoke-ab3vtnw9)
| Table | Records | Purpose |
|-------|---------|---------|
| companies | 200+ | GTM agencies with full profiles |
| articles | 500+ | SEO content (listicles, guides, comparisons) |
| contact_submissions | varies | Lead capture forms |
| employer_companies | varies | Company enrichment data |

### New GTM.quest v2 Database (ep-wispy-violet-ab65vfgj)
- Currently empty
- Connected to new Neon Auth

---

## Migration Phases

### Phase 1: Database Schema & Data Migration

**1.1 Create Tables in v2 Database**

```sql
-- Companies/Agencies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  headquarters TEXT,
  logo_url TEXT,
  founded_year INTEGER,
  employee_count TEXT,
  website TEXT,
  pricing_model TEXT,
  min_budget INTEGER,
  global_rank INTEGER,
  specializations TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  category_tags TEXT[] DEFAULT '{}',
  app TEXT DEFAULT 'gtm',
  company_type TEXT,
  status TEXT DEFAULT 'published',
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  status TEXT DEFAULT 'published',
  app TEXT DEFAULT 'gtm',
  guide_type TEXT,
  featured_asset_url TEXT,
  hero_asset_url TEXT,
  hero_asset_alt TEXT,
  word_count INTEGER,
  is_featured BOOLEAN DEFAULT false,
  video_url TEXT,
  video_playback_id TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_type TEXT,
  full_name TEXT,
  email TEXT,
  company_name TEXT,
  company_website TEXT,
  current_role TEXT,
  job_title TEXT,
  linkedin_url TEXT,
  phone TEXT,
  message TEXT,
  newsletter_opt_in BOOLEAN DEFAULT false,
  schedule_call BOOLEAN DEFAULT false,
  site TEXT DEFAULT 'gtm',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_app_status ON companies(app, status);
CREATE INDEX idx_companies_service_areas ON companies USING GIN(service_areas);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_app_status ON articles(app, status);
```

**1.2 Migrate Data**

```bash
# Export from original database
pg_dump -h ep-green-smoke-ab3vtnw9-pooler.eu-west-2.aws.neon.tech \
  -U neondb_owner -d neondb \
  -t companies -t articles \
  --data-only > gtm_data_export.sql

# Import to v2 database
psql -h ep-wispy-violet-ab65vfgj-pooler.eu-west-2.aws.neon.tech \
  -U neondb_owner -d neondb \
  < gtm_data_export.sql
```

---

### Phase 2: SEO Page Infrastructure

**2.1 Location Pages (Static Generation)**

Create templated pages for top locations:

```
/app/gtm-agencies-[location]/page.tsx  (template)
```

**Priority locations** (based on traffic):
1. London, UK, US, France, Germany
2. Paris, Boston, New York, Berlin
3. Amsterdam, Dublin, Singapore, Sydney

**2.2 Dynamic Agency Pages**

```
/app/agency/[slug]/page.tsx
```

- generateStaticParams() pulls all agency slugs at build
- Full SEO with JSON-LD schema
- Related agencies sidebar
- Location-based internal links

**2.3 Dynamic Article Pages**

```
/app/articles/[slug]/page.tsx
```

- Support for listicles, comparisons, guides
- Markdown rendering with syntax highlighting
- Internal linking to agency pages

---

### Phase 3: Global Design System

**3.1 Design Tokens** (`/src/lib/design-tokens.ts`)

```typescript
export const designTokens = {
  colors: {
    primary: '#10B981',     // Emerald (GTM green)
    secondary: '#6366F1',   // Indigo
    accent: '#F59E0B',      // Amber
    background: '#FAFAFA',
    text: '#1F2937',
  },
  fonts: {
    heading: 'var(--font-playfair)',
    body: 'var(--font-geist-sans)',
  },
  spacing: {
    section: '4rem',
    card: '1.5rem',
  }
};
```

**3.2 SEO Components**

- `WebPageSchema.tsx` - JSON-LD for pages
- `AgencySchema.tsx` - Organization schema for agencies
- `ArticleSchema.tsx` - Article schema for content
- `BreadcrumbSchema.tsx` - Navigation schema

**3.3 Reusable UI Components**

- `AgencyCard.tsx` - Agency listing card
- `AgencyGrid.tsx` - Grid of agencies
- `LocationHero.tsx` - Location page hero
- `ArticleCard.tsx` - Article preview card
- `ContactForm.tsx` - Lead capture form

---

### Phase 4: Agent Integration

**4.1 Add Database Queries to Agent**

Update `agent/src/agent.py` with tools that query real data:

```python
@agent.tool
async def search_agencies(
    ctx: RunContext[StateDeps[AppState]],
    location: Optional[str] = None,
    specialization: Optional[str] = None,
    budget: Optional[int] = None,
) -> dict:
    """Search GTM agencies from our database."""
    # Query companies table with filters
    # Return matching agencies
```

**4.2 Connect Voice to Real Data**

- When user says "GTM agencies in London", query database
- Populate report cards with real agency data
- Show actual pricing, specializations, rankings

---

### Phase 5: Content Generation Pipeline

**5.1 Article Generation**

- Pydantic AI + Gemini for content creation
- Templates for different guide_types
- Internal linking to agency pages
- Auto-publish to articles table

**5.2 Agency Enrichment**

- Scrape new agency websites
- Extract specializations, pricing, case studies
- Update companies table
- Regenerate related articles

---

## File Structure (Target)

```
gtm-quest-v2/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Voice-first homepage
│   │   ├── agency/[slug]/page.tsx      # Dynamic agency pages
│   │   ├── articles/[slug]/page.tsx    # Dynamic article pages
│   │   ├── gtm-agencies-london/        # Static location pages
│   │   ├── gtm-agencies-uk/
│   │   ├── gtm-agencies-us/
│   │   └── api/
│   │       ├── copilotkit/route.ts
│   │       ├── hume-token/route.ts
│   │       ├── contact/route.ts        # NEW
│   │       └── agencies/route.ts       # NEW
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── voice/
│   │   ├── seo/                        # NEW
│   │   │   ├── WebPageSchema.tsx
│   │   │   ├── AgencySchema.tsx
│   │   │   └── BreadcrumbSchema.tsx
│   │   └── ui/                         # NEW
│   │       ├── AgencyCard.tsx
│   │       ├── AgencyGrid.tsx
│   │       └── ContactForm.tsx
│   │
│   └── lib/
│       ├── db.ts                       # NEW - Database connection
│       ├── agencies.ts                 # NEW - Agency queries
│       ├── articles.ts                 # NEW - Article queries
│       ├── design-tokens.ts            # NEW - Design system
│       └── types.ts
│
└── agent/
    └── src/
        └── agent.py                    # Add database tools
```

---

## Implementation Order

### Week 1: Database & Core Pages
1. [ ] Create schema in v2 database
2. [ ] Migrate companies and articles data
3. [ ] Build `/agency/[slug]` dynamic page
4. [ ] Build `/articles/[slug]` dynamic page
5. [ ] Create AgencyCard and AgencyGrid components

### Week 2: Location Pages & SEO
6. [ ] Create location page template
7. [ ] Generate top 10 location pages
8. [ ] Add JSON-LD schemas
9. [ ] Implement internal linking
10. [ ] Add sitemap generation

### Week 3: Agent Integration
11. [ ] Add database connection to agent
12. [ ] Create search_agencies tool
13. [ ] Create get_agency_details tool
14. [ ] Connect voice responses to real data
15. [ ] Test end-to-end flow

### Week 4: Polish & Launch
16. [ ] Design system refinement
17. [ ] Contact form implementation
18. [ ] Performance optimization
19. [ ] SEO audit and fixes
20. [ ] Launch and monitor rankings

---

## Environment Variables Needed

```env
# Already set
DATABASE_URL=postgresql://...@ep-wispy-violet-ab65vfgj...
GOOGLE_API_KEY=...
HUME_API_KEY=...
HUME_SECRET_KEY=...
NEXT_PUBLIC_HUME_CONFIG_ID=...
NEON_AUTH_BASE_URL=...
AGENT_URL=https://gtm-quest-agent-production.up.railway.app/

# May need for content generation
ANTHROPIC_API_KEY=...
CLOUDINARY_URL=...
```

---

## Success Metrics

1. **SEO**: Maintain or improve rankings for "GTM agency [location]" queries
2. **Engagement**: Voice conversations leading to agency recommendations
3. **Conversion**: Contact form submissions from qualified leads
4. **Content**: Article generation pipeline producing quality content

---

## Notes

- Original gtm.quest can remain live during migration
- Use v2 subdomain for testing before DNS switch
- Monitor Search Console for indexing issues
- Implement redirects if URLs change
