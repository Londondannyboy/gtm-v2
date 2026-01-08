"""
GTM.quest Agent - AI-Powered Go-To-Market Strategy Advisor

Built with Pydantic AI + AG-UI for CopilotKit integration.
"""
from textwrap import dedent
from typing import Optional
from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
from pydantic_ai.ag_ui import StateDeps
from pydantic_ai.models.google import GoogleModel
import os
import sys

from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Database connection
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Get a database connection."""
    return psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)


# =====
# State Models
# =====

class GTMStrategy(BaseModel):
    """Recommended go-to-market strategy."""
    name: str
    type: str  # 'plg', 'sales_led', 'hybrid'
    summary: str
    recommended_for: list[str] = Field(default_factory=list)
    action_items: list[str] = Field(default_factory=list)


class Provider(BaseModel):
    """GTM agency or tool recommendation."""
    id: str
    name: str
    slug: str
    type: str  # 'agency', 'tool', 'platform'
    specializations: list[str] = Field(default_factory=list)
    industries: list[str] = Field(default_factory=list)
    pricing_tier: str = "mid"  # 'budget', 'mid', 'premium'
    logo_url: Optional[str] = None
    website: Optional[str] = None
    description: str = ""
    rating: Optional[float] = None
    match_score: Optional[float] = None


class ROIProjection(BaseModel):
    """ROI projection for the GTM strategy."""
    estimated_cac: float
    estimated_ltv: float
    payback_months: int
    confidence: str = "medium"  # 'low', 'medium', 'high'
    notes: str = ""


class UseCase(BaseModel):
    """Success story / case study."""
    company_name: str
    industry: str
    company_stage: Optional[str] = None
    challenge: str
    solution: str
    results: dict = Field(default_factory=dict)
    logo_url: Optional[str] = None


class BudgetBreakdown(BaseModel):
    """Budget allocation breakdown."""
    total: float
    categories: list[dict] = Field(default_factory=list)


class Phase(BaseModel):
    """Timeline phase."""
    name: str
    duration: str
    activities: list[str] = Field(default_factory=list)
    milestones: list[str] = Field(default_factory=list)


class AppState(BaseModel):
    """Main state synced with frontend via useCoAgent."""
    # Company info gathered during conversation
    company_name: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    target_market: Optional[str] = None
    budget: Optional[float] = None

    # Generated outputs (populate main panel)
    strategy: Optional[GTMStrategy] = None
    recommended_providers: list[Provider] = Field(default_factory=list)
    roi_projection: Optional[ROIProjection] = None
    use_cases: list[UseCase] = Field(default_factory=list)
    budget_breakdown: Optional[BudgetBreakdown] = None
    timeline_phases: list[Phase] = Field(default_factory=list)


# =====
# Agent Definition
# =====

agent = Agent(
    model=GoogleModel('gemini-2.0-flash'),
    deps_type=StateDeps[AppState],
    system_prompt=dedent("""
        You are an expert Go-To-Market (GTM) strategist helping companies plan their market entry.

        ## Your Personality
        - Warm, knowledgeable, and consultative
        - Ask clarifying questions to understand the company better
        - Be specific with recommendations
        - Use data and benchmarks when possible

        ## Conversation Flow

        1. **Discovery Phase**: Ask about:
           - What product/service they're building
           - Target market and customer segment
           - Company stage (seed, Series A, growth, enterprise)
           - Budget and timeline
           - Current challenges

        2. **Strategy Phase**: Once you have enough info:
           - Recommend a GTM approach (PLG, Sales-Led, or Hybrid)
           - Explain why this approach fits their situation
           - Use the generate_strategy tool to populate the report

        3. **Recommendations Phase**:
           - Suggest relevant agencies and tools
           - Provide ROI projections
           - Share similar success stories

        ## Important
        - Don't overwhelm users with questions - ask 2-3 at a time
        - When you have enough information, USE YOUR TOOLS to generate recommendations
        - Be conversational, not robotic
        - If they share company details, acknowledge and reflect back

        Start by warmly greeting the user and asking what kind of company they're building.
    """),
)


# =====
# Agent Tools
# =====

@agent.tool
async def generate_strategy(
    ctx: RunContext[StateDeps[AppState]],
    strategy_type: str,
    strategy_name: str,
    summary: str,
    action_items: list[str],
    recommended_for: list[str],
) -> dict:
    """Generate a GTM strategy recommendation and update the frontend state.

    Args:
        strategy_type: One of 'plg' (Product-Led Growth), 'sales_led', or 'hybrid'
        strategy_name: Human-readable name like "Product-Led Growth"
        summary: 2-3 sentence summary of the strategy
        action_items: List of specific action items to implement
        recommended_for: List of company types this works best for
    """
    strategy = GTMStrategy(
        name=strategy_name,
        type=strategy_type,
        summary=summary,
        action_items=action_items,
        recommended_for=recommended_for,
    )

    # Update state to populate frontend
    ctx.deps.state.strategy = strategy

    print(f"[GTM] Generated strategy: {strategy_name}", file=sys.stderr)

    return {
        "success": True,
        "message": f"Strategy '{strategy_name}' has been generated and added to your report.",
    }


@agent.tool
async def add_provider_recommendation(
    ctx: RunContext[StateDeps[AppState]],
    name: str,
    provider_type: str,
    description: str,
    specializations: list[str],
    pricing_tier: str,
    match_score: float,
) -> dict:
    """Add a provider (agency/tool) recommendation to the report.

    Args:
        name: Name of the provider
        provider_type: One of 'agency', 'tool', 'platform'
        description: Brief description of what they do
        specializations: List of their specializations
        pricing_tier: One of 'budget', 'mid', 'premium'
        match_score: Score from 0-1 indicating fit with user's needs
    """
    import uuid

    provider = Provider(
        id=str(uuid.uuid4()),
        name=name,
        slug=name.lower().replace(" ", "-"),
        type=provider_type,
        description=description,
        specializations=specializations,
        pricing_tier=pricing_tier,
        match_score=match_score,
    )

    # Add to state
    if ctx.deps.state.recommended_providers is None:
        ctx.deps.state.recommended_providers = []
    ctx.deps.state.recommended_providers.append(provider)

    print(f"[GTM] Added provider: {name} ({match_score*100:.0f}% match)", file=sys.stderr)

    return {
        "success": True,
        "message": f"Added {name} to your recommended providers.",
    }


@agent.tool
async def generate_roi_projection(
    ctx: RunContext[StateDeps[AppState]],
    estimated_cac: float,
    estimated_ltv: float,
    payback_months: int,
    confidence: str,
    notes: str,
) -> dict:
    """Generate ROI projections for the GTM strategy.

    Args:
        estimated_cac: Estimated Customer Acquisition Cost in dollars
        estimated_ltv: Estimated Lifetime Value in dollars
        payback_months: Estimated months to payback CAC
        confidence: One of 'low', 'medium', 'high'
        notes: Explanatory notes about the projection
    """
    projection = ROIProjection(
        estimated_cac=estimated_cac,
        estimated_ltv=estimated_ltv,
        payback_months=payback_months,
        confidence=confidence,
        notes=notes,
    )

    ctx.deps.state.roi_projection = projection

    print(f"[GTM] Generated ROI projection: CAC=${estimated_cac}, LTV=${estimated_ltv}", file=sys.stderr)

    return {
        "success": True,
        "message": "ROI projection has been added to your report.",
    }


@agent.tool
async def add_use_case(
    ctx: RunContext[StateDeps[AppState]],
    company_name: str,
    industry: str,
    challenge: str,
    solution: str,
    results: dict,
) -> dict:
    """Add a similar company success story to the report.

    Args:
        company_name: Name of the company (can be anonymized)
        industry: Their industry
        challenge: What challenge they faced
        solution: How they solved it
        results: Dict of results like {"revenue_increase": "150%", "time_to_market": "3 months"}
    """
    use_case = UseCase(
        company_name=company_name,
        industry=industry,
        challenge=challenge,
        solution=solution,
        results=results,
    )

    if ctx.deps.state.use_cases is None:
        ctx.deps.state.use_cases = []
    ctx.deps.state.use_cases.append(use_case)

    print(f"[GTM] Added use case: {company_name}", file=sys.stderr)

    return {
        "success": True,
        "message": f"Added {company_name} case study to your report.",
    }


@agent.tool
async def update_company_info(
    ctx: RunContext[StateDeps[AppState]],
    company_name: Optional[str] = None,
    industry: Optional[str] = None,
    stage: Optional[str] = None,
    target_market: Optional[str] = None,
    budget: Optional[float] = None,
) -> dict:
    """Update the company information in the report.

    Call this when the user shares details about their company.

    Args:
        company_name: Name of the company
        industry: Industry/vertical they're in
        stage: Company stage (seed, series_a, series_b, growth, enterprise)
        target_market: Target market/customer segment
        budget: Budget in dollars (if shared)
    """
    if company_name:
        ctx.deps.state.company_name = company_name
    if industry:
        ctx.deps.state.industry = industry
    if stage:
        ctx.deps.state.stage = stage
    if target_market:
        ctx.deps.state.target_market = target_market
    if budget:
        ctx.deps.state.budget = budget

    updated = [k for k, v in {
        "company_name": company_name,
        "industry": industry,
        "stage": stage,
        "target_market": target_market,
        "budget": budget,
    }.items() if v]

    print(f"[GTM] Updated company info: {', '.join(updated)}", file=sys.stderr)

    return {
        "success": True,
        "message": f"Updated: {', '.join(updated)}",
    }


# =====
# Database Query Tools
# =====

@agent.tool
async def search_agencies(
    ctx: RunContext[StateDeps[AppState]],
    location: Optional[str] = None,
    specialization: Optional[str] = None,
    max_results: int = 5,
) -> dict:
    """Search for GTM agencies from our database.

    Args:
        location: Filter by location (e.g., 'London', 'New York', 'Remote')
        specialization: Filter by specialization (e.g., 'Demand Generation', 'ABM', 'PLG')
        max_results: Maximum number of agencies to return (default 5)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT id, slug, name, description, headquarters, logo_url,
                   specializations, service_areas, global_rank, website,
                   pricing_model, min_budget, avg_rating, review_count
            FROM companies
            WHERE app = 'gtm' AND status = 'published'
        """
        params = []

        if location:
            query += " AND (headquarters ILIKE %s OR %s = ANY(service_areas))"
            params.extend([f"%{location}%", location])

        if specialization:
            query += " AND %s = ANY(specializations)"
            params.append(specialization)

        query += " ORDER BY global_rank NULLS LAST LIMIT %s"
        params.append(max_results)

        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        agencies = []
        for row in results:
            agencies.append({
                "name": row["name"],
                "slug": row["slug"],
                "description": row["description"],
                "headquarters": row["headquarters"],
                "specializations": row["specializations"] or [],
                "global_rank": row["global_rank"],
                "website": row["website"],
                "pricing_model": row["pricing_model"],
                "min_budget": row["min_budget"],
            })

            # Also add to provider recommendations
            provider = Provider(
                id=str(row["id"]),
                name=row["name"],
                slug=row["slug"],
                type="agency",
                description=row["description"] or "",
                specializations=row["specializations"] or [],
                pricing_tier="mid" if not row["min_budget"] else ("budget" if row["min_budget"] < 5000 else ("premium" if row["min_budget"] > 15000 else "mid")),
                website=row["website"],
                logo_url=row["logo_url"],
                rating=float(row["avg_rating"]) if row["avg_rating"] else None,
                match_score=0.9 if row["global_rank"] and row["global_rank"] <= 10 else 0.7,
            )
            if provider not in ctx.deps.state.recommended_providers:
                ctx.deps.state.recommended_providers.append(provider)

        print(f"[GTM] Found {len(agencies)} agencies", file=sys.stderr)

        return {
            "success": True,
            "count": len(agencies),
            "agencies": agencies,
            "message": f"Found {len(agencies)} GTM agencies" + (f" in {location}" if location else "") + (f" specializing in {specialization}" if specialization else ""),
        }

    except Exception as e:
        print(f"[GTM] Database error: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e),
            "message": "Unable to search agencies at this time.",
        }


@agent.tool
async def get_agency_details(
    ctx: RunContext[StateDeps[AppState]],
    slug: str,
) -> dict:
    """Get detailed information about a specific agency.

    Args:
        slug: The agency slug (e.g., 'singlegrain', 'refinelabs')
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, slug, name, description, headquarters, logo_url, website,
                   specializations, service_areas, key_services, global_rank,
                   founded_year, employee_count, pricing_model, min_budget,
                   avg_rating, review_count, overview
            FROM companies
            WHERE app = 'gtm' AND status = 'published' AND slug = %s
            LIMIT 1
        """, [slug])

        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row:
            return {
                "success": False,
                "message": f"Agency '{slug}' not found.",
            }

        agency = {
            "name": row["name"],
            "slug": row["slug"],
            "description": row["description"],
            "overview": row["overview"],
            "headquarters": row["headquarters"],
            "website": row["website"],
            "specializations": row["specializations"] or [],
            "service_areas": row["service_areas"] or [],
            "key_services": row["key_services"] or [],
            "global_rank": row["global_rank"],
            "founded_year": row["founded_year"],
            "employee_count": row["employee_count"],
            "pricing_model": row["pricing_model"],
            "min_budget": row["min_budget"],
            "avg_rating": float(row["avg_rating"]) if row["avg_rating"] else None,
            "review_count": row["review_count"],
        }

        print(f"[GTM] Retrieved agency: {row['name']}", file=sys.stderr)

        return {
            "success": True,
            "agency": agency,
            "message": f"Here's information about {row['name']}.",
        }

    except Exception as e:
        print(f"[GTM] Database error: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e),
            "message": "Unable to retrieve agency details at this time.",
        }


@agent.tool
async def get_top_agencies(
    ctx: RunContext[StateDeps[AppState]],
    limit: int = 10,
) -> dict:
    """Get the top-ranked GTM agencies.

    Args:
        limit: Number of agencies to return (default 10)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, slug, name, description, headquarters, logo_url,
                   specializations, global_rank, website, pricing_model, min_budget
            FROM companies
            WHERE app = 'gtm' AND status = 'published' AND global_rank IS NOT NULL
            ORDER BY global_rank ASC
            LIMIT %s
        """, [limit])

        results = cursor.fetchall()
        cursor.close()
        conn.close()

        agencies = []
        for row in results:
            agencies.append({
                "rank": row["global_rank"],
                "name": row["name"],
                "slug": row["slug"],
                "description": row["description"],
                "headquarters": row["headquarters"],
                "specializations": row["specializations"] or [],
                "website": row["website"],
            })

        print(f"[GTM] Retrieved top {len(agencies)} agencies", file=sys.stderr)

        return {
            "success": True,
            "count": len(agencies),
            "agencies": agencies,
            "message": f"Here are the top {len(agencies)} ranked GTM agencies.",
        }

    except Exception as e:
        print(f"[GTM] Database error: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e),
            "message": "Unable to retrieve top agencies at this time.",
        }


@agent.tool
async def generate_budget_breakdown(
    ctx: RunContext[StateDeps[AppState]],
    total_budget: float,
    categories: list[dict],
) -> dict:
    """Generate a budget breakdown for the GTM strategy.

    Args:
        total_budget: Total monthly budget in dollars
        categories: List of budget categories with name, amount, and percentage
                   Example: [{"name": "Paid Ads", "amount": 5000, "percentage": 50}]
    """
    from pydantic import BaseModel

    class BudgetCategory(BaseModel):
        name: str
        amount: float
        percentage: float

    class BudgetBreakdown(BaseModel):
        total: float
        categories: list[BudgetCategory]

    breakdown = BudgetBreakdown(
        total=total_budget,
        categories=[BudgetCategory(**cat) for cat in categories]
    )

    ctx.deps.state.budget_breakdown = breakdown
    ctx.deps.state.budget = total_budget

    print(f"[GTM] Generated budget breakdown: ${total_budget} across {len(categories)} categories", file=sys.stderr)

    return {
        "success": True,
        "message": f"Budget breakdown of ${total_budget:,.0f}/mo has been added to the report.",
    }


@agent.tool
async def generate_timeline(
    ctx: RunContext[StateDeps[AppState]],
    phases: list[dict],
) -> dict:
    """Generate implementation timeline phases for the GTM strategy.

    Args:
        phases: List of phases with name, duration, activities, and milestones
                Example: [{"name": "Foundation", "duration": "Month 1-2",
                          "activities": ["Set up CRM", "Define ICP"],
                          "milestones": ["CRM live", "ICP documented"]}]
    """
    from pydantic import BaseModel

    class Phase(BaseModel):
        name: str
        duration: str
        activities: list[str]
        milestones: list[str]

    timeline = [Phase(**phase) for phase in phases]
    ctx.deps.state.timeline_phases = timeline

    print(f"[GTM] Generated timeline with {len(phases)} phases", file=sys.stderr)

    return {
        "success": True,
        "message": f"Implementation timeline with {len(phases)} phases has been added to your report.",
    }


@agent.tool
async def save_contact_request(
    ctx: RunContext[StateDeps[AppState]],
    full_name: str,
    email: str,
    company_name: Optional[str] = None,
    message: Optional[str] = None,
) -> dict:
    """Save a contact request when user wants to connect with an agency or get more help.

    Args:
        full_name: User's full name
        email: User's email address
        company_name: Optional company name
        message: Optional message or notes
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO contact_submissions
            (submission_type, full_name, email, company_name, message, site, created_at)
            VALUES ('gtm_consultation', %s, %s, %s, %s, 'gtm', NOW())
            RETURNING id
        """, [full_name, email, company_name, message])

        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        print(f"[GTM] Saved contact request from {email}", file=sys.stderr)

        return {
            "success": True,
            "contact_id": result["id"] if result else None,
            "message": f"Thanks {full_name}! Your contact request has been saved. An agency will reach out to {email} soon.",
        }

    except Exception as e:
        print(f"[GTM] Error saving contact: {e}", file=sys.stderr)
        return {
            "success": False,
            "error": str(e),
            "message": "There was an issue saving your contact info. Please try again.",
        }


# =====
# FastAPI App with AG-UI + CLM
# =====

import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
import google.generativeai as genai

# Configure Google AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create AG-UI app from agent
ag_ui_app = agent.to_ag_ui(deps=StateDeps(AppState()))

# Main FastAPI app
main_app = FastAPI(
    title="GTM.quest Agent",
    description="AI-Powered Go-To-Market Strategy Advisor",
)

# CORS for cross-origin requests
main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@main_app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "agent": "gtm_agent"}


# =====
# CLM Endpoint for Hume Voice
# =====

GTM_VOICE_SYSTEM_PROMPT = """You are a friendly AI GTM (Go-To-Market) strategist having a voice conversation.

Your expertise:
- Go-to-market strategy (PLG, Sales-Led, Hybrid approaches)
- Startup and scale-up growth strategies
- Agency and tool recommendations
- ROI projections and benchmarks

Voice guidelines:
- Keep responses SHORT (1-2 sentences) for natural conversation
- Ask follow-up questions to understand their needs
- Be warm, consultative, and specific
- When you have enough info, summarize their GTM approach
"""


async def stream_sse_response(content: str, msg_id: str):
    """Stream OpenAI-compatible SSE chunks for Hume EVI."""
    words = content.split(' ')
    for i, word in enumerate(words):
        chunk = {
            "id": msg_id,
            "object": "chat.completion.chunk",
            "choices": [{
                "index": 0,
                "delta": {"content": word + (' ' if i < len(words) - 1 else '')},
                "finish_reason": None
            }]
        }
        yield f"data: {json.dumps(chunk)}\n\n"

    # Send finish chunk
    yield f"data: {json.dumps({'choices': [{'delta': {}, 'finish_reason': 'stop'}]})}\n\n"
    yield "data: [DONE]\n\n"


@main_app.post("/chat/completions")
async def clm_endpoint(request: Request):
    """OpenAI-compatible CLM endpoint for Hume EVI voice."""
    try:
        body = await request.json()
        messages = body.get("messages", [])

        # Extract user message
        user_msg = ""
        system_prompt = GTM_VOICE_SYSTEM_PROMPT

        for msg in messages:
            if msg.get("role") == "system":
                # Use Hume's system prompt if provided (contains user context)
                system_prompt = msg.get("content", GTM_VOICE_SYSTEM_PROMPT)
            elif msg.get("role") == "user":
                user_msg = msg.get("content", "")

        if not user_msg:
            user_msg = "Hello"

        # Call Google Gemini for response
        model = genai.GenerativeModel('gemini-2.0-flash-exp')

        # Build conversation history for context
        history = []
        for msg in messages:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role == "user":
                history.append({"role": "user", "parts": [content]})
            elif role == "assistant":
                history.append({"role": "model", "parts": [content]})

        # Create chat with history
        chat = model.start_chat(history=history[:-1] if history else [])

        # Add system prompt to the user message for context
        full_prompt = f"{system_prompt}\n\nUser: {user_msg}\n\nRespond naturally and concisely (1-2 sentences for voice):"

        response = chat.send_message(full_prompt)
        response_text = response.text.strip()

        # Generate message ID
        msg_id = f"clm-{hash(user_msg) % 100000}"

        print(f"[CLM] User: {user_msg[:50]}... -> Response: {response_text[:50]}...", file=sys.stderr)

        return StreamingResponse(
            stream_sse_response(response_text, msg_id),
            media_type="text/event-stream"
        )

    except Exception as e:
        print(f"[CLM] Error: {e}", file=sys.stderr)
        error_msg = "I'm having trouble responding right now. Could you try again?"
        return StreamingResponse(
            stream_sse_response(error_msg, "clm-error"),
            media_type="text/event-stream"
        )


# Mount AG-UI app at root for CopilotKit
main_app.mount("/", ag_ui_app)

# Export for uvicorn
app = main_app
