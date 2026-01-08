// GTM Agent State - synced between frontend and Pydantic AI backend

export interface GTMStrategy {
  name: string;
  type: 'plg' | 'sales_led' | 'hybrid';
  summary: string;
  recommended_for: string[];
  action_items: string[];
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  type: 'agency' | 'tool' | 'platform';
  specializations: string[];
  industries: string[];
  pricing_tier: 'budget' | 'mid' | 'premium';
  logo_url?: string;
  website?: string;
  description: string;
  rating?: number;
  match_score?: number;
}

export interface ROIProjection {
  estimated_cac: number;
  estimated_ltv: number;
  payback_months: number;
  confidence: 'low' | 'medium' | 'high';
  notes: string;
}

export interface UseCase {
  company_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results: Record<string, string>;
  logo_url?: string;
}

export interface BudgetBreakdown {
  total: number;
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}

export interface Phase {
  name: string;
  duration: string;
  activities: string[];
  milestones: string[];
}

// Main state synced via useCoAgent
export interface GTMState {
  // Company info (populated during conversation)
  company_name?: string;
  industry?: string;
  stage?: string;
  target_market?: string;

  // Generated outputs (populate main panel)
  strategy?: GTMStrategy;
  recommended_providers: Provider[];
  roi_projection?: ROIProjection;
  use_cases: UseCase[];
  budget_breakdown?: BudgetBreakdown;
  timeline_phases: Phase[];
}

// User type for auth
export interface User {
  id: string;
  email?: string;
  name?: string;
}
