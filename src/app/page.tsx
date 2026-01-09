'use client';

import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import { AuthButton } from '@/components/auth/AuthButton';
import { authClient } from '@/lib/auth/client';
import { VoiceWidget } from '@/components/voice/VoiceWidget';
import Link from 'next/link';

// Report Components
import { StrategyCard } from '@/components/report/StrategyCard';
import { AgencyMatchCard } from '@/components/report/AgencyMatchCard';
import { ROICard } from '@/components/report/ROICard';
import { CompanyInfoCard } from '@/components/report/CompanyInfoCard';
import { UseCaseCarousel } from '@/components/report/UseCaseCarousel';
import { TimelineGantt } from '@/components/report/TimelineGantt';
import { BudgetPieChart } from '@/components/report/BudgetPieChart';
import { BenchmarkComparison } from '@/components/report/BenchmarkComparison';
import { FunnelChart } from '@/components/report/FunnelChart';
import { ContactForm } from '@/components/report/ContactForm';
import { downloadReport, copyReportToClipboard } from '@/lib/export';

// Dynamic imports to avoid SSR issues
import dynamic from 'next/dynamic';
const InlineChatActions = dynamic(
  () => import('@/components/chat/InlineChatActions').then(mod => mod.InlineChatActions),
  { ssr: false }
);
const LiveDashboard = dynamic(
  () => import('@/components/dashboard/LiveDashboard').then(mod => mod.LiveDashboard),
  { ssr: false }
);

// Wow Factor Components - React to user input
const ReactiveHero = dynamic(
  () => import('@/components/hero/ReactiveHero').then(mod => mod.ReactiveHero),
  { ssr: false }
);
const StrategyPath = dynamic(
  () => import('@/components/viz/StrategyPath').then(mod => mod.StrategyPath),
  { ssr: false }
);

// Instructions for the GTM advisor agent
const AGENT_INSTRUCTIONS = `You are an expert Go-To-Market (GTM) strategist helping companies plan their market entry.

## Your Personality
- Warm, knowledgeable, and consultative
- Ask clarifying questions to understand the company better
- Be specific with recommendations backed by data

## Conversation Flow

1. **Discovery Phase**: Ask about:
   - What product/service they're building
   - Target market and customer segment
   - Company stage (seed, Series A, growth, enterprise)
   - Budget and timeline expectations
   - Current GTM challenges

   **USE update_company_info tool** as soon as you learn any company details!

2. **Strategy Phase**: Once you have enough context:
   - Recommend a GTM approach (PLG, Sales-Led, or Hybrid)
   - **USE generate_strategy tool** to populate their report
   - Explain why this approach fits their situation

3. **Recommendations Phase**:
   - **USE search_agencies tool** to find matching agencies from our database
   - The agencies will automatically appear in their report with match scores
   - **USE generate_roi_projection tool** to show expected metrics
   - **USE add_use_case tool** to share relevant success stories

## Important Tool Usage
- ALWAYS use tools to populate the visual report - don't just describe things in text
- Use update_company_info IMMEDIATELY when you learn company details
- Use search_agencies with location/specialization filters based on their needs
- The visual report updates in real-time as you use tools - this is the "wow" factor!

## Database Tools Available
- search_agencies(location?, specialization?) - Searches 200+ real GTM agencies
- get_agency_details(slug) - Gets full agency profile
- get_top_agencies(limit) - Gets top-ranked agencies

Start by warmly greeting the user and asking what kind of company they're building.`;

export default function Home() {
  // Get user session
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Sync state with the Pydantic AI agent via AG-UI protocol
  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  // Build instructions with user context
  const instructions = user
    ? `${AGENT_INSTRUCTIONS}

## USER CONTEXT (Logged In)
- User Name: ${user.name || 'Unknown'}
- User ID: ${user.id}
- User Email: ${user.email || 'Not provided'}

Address them by name. Start by greeting ${user.name?.split(' ')[0] || 'them'}.`
    : AGENT_INSTRUCTIONS;

  const initialMessage = user
    ? `Hi ${user.name?.split(' ')[0] || 'there'}! I'm your AI GTM strategist. Tell me about your company and I'll help you build a personalized go-to-market plan. What are you building?`
    : "Hi there! I'm your AI GTM strategist. Tell me about your company and I'll help you create a data-driven go-to-market plan. What kind of product or service are you building?";

  // Check if we have any report data
  const hasReportData = state?.strategy ||
    (state?.recommended_providers && state.recommended_providers.length > 0) ||
    state?.roi_projection ||
    state?.company_name;

  // Demo benchmarks (in real app, agent would populate these)
  const demoBenchmarks = state?.industry ? [
    { metric: 'CAC', yourValue: state.roi_projection?.estimated_cac || 500, industryAvg: 800, topPerformer: 300, unit: '', lowerIsBetter: true },
    { metric: 'LTV:CAC Ratio', yourValue: state.roi_projection ? state.roi_projection.estimated_ltv / state.roi_projection.estimated_cac : 3, industryAvg: 3, topPerformer: 5 },
    { metric: 'Payback (months)', yourValue: state.roi_projection?.payback_months || 12, industryAvg: 18, topPerformer: 6, lowerIsBetter: true },
  ] : null;

  // Demo funnel data
  const demoFunnel = state?.strategy ? [
    { name: 'Website Visitors', value: 10000 },
    { name: 'Signups / Leads', value: 1500 },
    { name: 'Qualified Leads', value: 450 },
    { name: 'Opportunities', value: 135 },
    { name: 'Customers', value: 40 },
  ] : null;

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={instructions}
      labels={{
        title: 'GTM Strategist',
        initial: initialMessage,
      }}
      className="h-screen"
    >
      {/* Register inline chat actions for rich renders */}
      <InlineChatActions />

      <div className="flex flex-col bg-black text-white min-h-screen">
        {/* Header - Fixed */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  <h1 className="text-2xl font-black text-white">
                    GTM.quest
                  </h1>
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/agencies"
                  className="text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition hidden md:block"
                >
                  Browse Agencies
                </Link>
                <Link
                  href="/articles"
                  className="text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition hidden md:block"
                >
                  Resources
                </Link>
                <VoiceWidget userName={user?.name} userId={user?.id} />
                <AuthButton />
              </div>
            </div>
          </div>
        </header>

        {/* Reactive Hero - Transforms based on user input */}
        <ReactiveHero />

        {/* Strategy Path - Shows user's GTM journey building */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-zinc-950 border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6">
            <StrategyPath />
          </div>
        </section>

        {/* Content Below Video */}
        <section className="py-16 md:py-24 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-lg md:text-2xl text-white/80 mb-10 leading-relaxed font-light">
              Start speaking or typing to build your personalized GTM strategy.
              Watch your dashboard come alive as our AI learns about your company.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl font-black rounded-xl bg-white text-black hover:bg-gray-200 transition-all duration-200 shadow-2xl"
              >
                Work with us
              </Link>
              <Link
                href="/agencies"
                className="inline-flex items-center justify-center px-6 md:px-10 py-4 text-base font-medium rounded-xl bg-white/10 backdrop-blur border border-white/30 text-white hover:bg-white/20 transition-all duration-200"
              >
                Browse 200+ GTM Agencies
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-20 bg-black border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-white mb-2">200+</div>
                <div className="text-white/60 font-light">GTM Agencies</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-white mb-2">45+</div>
                <div className="text-white/60 font-light">Strategy Guides</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-emerald-400 mb-2">Free</div>
                <div className="text-white/60 font-light">AI Consultation</div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black text-white mb-2">5 min</div>
                <div className="text-white/60 font-light">To Full Strategy</div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section className="py-16 md:py-24 bg-zinc-950 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-16">
              Our Go-To-Market Solutions
            </h2>

            <div className="space-y-12">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">AI-Powered Strategy</h3>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  Chat with our AI strategist to generate comprehensive GTM plans in minutes.
                  Get personalized recommendations for your industry, stage, and target market.
                </p>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Agency Matching</h3>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  Find the perfect GTM agency from our database of 200+ vetted partners.
                  Filter by location, specialization, budget, and get AI-powered match scores.
                </p>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4">ROI Projections</h3>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  See estimated CAC, LTV, payback periods, and industry benchmarks.
                  Make data-driven decisions about your go-to-market investment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 md:py-24 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-16">
              Why Use GTM.quest?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-zinc-900 border-2 border-white/20 p-10 md:p-14 rounded-3xl hover:border-emerald-500/50 transition-all">
                <div className="text-white text-5xl md:text-6xl font-black mb-4">2-3x</div>
                <h3 className="text-2xl font-bold text-white mb-4">Faster Strategy Development</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  AI-powered frameworks accelerate planning from months to minutes.
                </p>
              </div>

              <div className="bg-zinc-900 border-2 border-white/20 p-10 md:p-14 rounded-3xl hover:border-emerald-500/50 transition-all">
                <div className="text-white text-5xl md:text-6xl font-black mb-4">200+</div>
                <h3 className="text-2xl font-bold text-white mb-4">Vetted Agency Partners</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  Find the perfect match from our curated database of GTM specialists.
                </p>
              </div>

              <div className="bg-zinc-900 border-2 border-white/20 p-10 md:p-14 rounded-3xl hover:border-emerald-500/50 transition-all">
                <div className="text-emerald-400 text-5xl md:text-6xl font-black mb-4">Free</div>
                <h3 className="text-2xl font-bold text-white mb-4">AI Strategy Tools</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  No cost to chat with our AI and generate your GTM plan.
                </p>
              </div>

              <div className="bg-zinc-900 border-2 border-white/20 p-10 md:p-14 rounded-3xl hover:border-emerald-500/50 transition-all">
                <div className="text-white text-5xl md:text-6xl font-black mb-4">Real</div>
                <h3 className="text-2xl font-bold text-white mb-4">Data-Driven Insights</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-light">
                  ROI projections and benchmarks based on actual market data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE DASHBOARD - Shows and builds in real-time as user chats */}
        {hasReportData && (
          <section className="py-16 md:py-24 bg-gradient-to-b from-zinc-950 to-black border-t border-emerald-500/20">
            <div className="max-w-7xl mx-auto px-6">
              <LiveDashboard />
            </div>
          </section>
        )}

        {/* CTA Section - Shows when no report data */}
        {!hasReportData && (
        <section className="py-16 md:py-24 bg-gradient-to-b from-black to-zinc-900 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Build Your GTM Strategy?
            </h2>
            <p className="text-xl text-white/70 mb-10 font-light">
              Start chatting with our AI strategist or browse our agency directory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agencies"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-black rounded-xl bg-white text-black hover:bg-gray-200 transition-all shadow-2xl"
              >
                Browse Agencies
              </Link>
              <Link
                href="/compare"
                className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-xl bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
              >
                Compare Top Agencies
              </Link>
            </div>
          </div>
        </section>
        )}

        {/* Detailed Report Content - Shows below dashboard when user has data */}
        {hasReportData && (
          <section className="py-16 md:py-24 bg-zinc-950 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-12 text-center">
                Your GTM Strategy Report
              </h2>

              <div className="space-y-8">
                {/* Company Info Bar */}
                <CompanyInfoCard
                  companyName={state?.company_name}
                  industry={state?.industry}
                  stage={state?.stage}
                  targetMarket={state?.target_market}
                  budget={state?.budget}
                />

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column - Strategy & ROI */}
                  <div className="lg:col-span-2 space-y-6">
                    {state?.strategy && <StrategyCard strategy={state.strategy} />}
                    {state?.roi_projection && <ROICard projection={state.roi_projection} />}

                    {demoFunnel && (
                      <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-2xl">🔻</span>
                          <h3 className="text-xl font-bold text-white">Expected Funnel</h3>
                        </div>
                        <FunnelChart stages={demoFunnel} />
                      </div>
                    )}

                    {demoBenchmarks && (
                      <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">📊</span>
                          <h3 className="text-xl font-bold text-white">Industry Benchmarks</h3>
                        </div>
                        <BenchmarkComparison benchmarks={demoBenchmarks} industry={state?.industry} />
                      </div>
                    )}

                    {state?.timeline_phases && state.timeline_phases.length > 0 && (
                      <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-2xl">📅</span>
                          <h3 className="text-xl font-bold text-white">Implementation Timeline</h3>
                        </div>
                        <TimelineGantt phases={state.timeline_phases} />
                      </div>
                    )}

                    {state?.budget_breakdown && (
                      <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center gap-2 mb-6">
                          <span className="text-2xl">💰</span>
                          <h3 className="text-xl font-bold text-white">Budget Allocation</h3>
                        </div>
                        <BudgetPieChart
                          categories={state.budget_breakdown.categories}
                          total={state.budget_breakdown.total}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Agencies & Use Cases */}
                  <div className="space-y-6">
                    {state?.recommended_providers && state.recommended_providers.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <span>🤝</span> Top Matches
                          </h3>
                          <Link href="/agencies" className="text-sm text-emerald-400 hover:underline">
                            View all →
                          </Link>
                        </div>
                        <div className="space-y-4">
                          {state.recommended_providers.slice(0, 5).map((provider, i) => (
                            <AgencyMatchCard key={provider.id} provider={provider} index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {state?.use_cases && state.use_cases.length > 0 && (
                      <UseCaseCarousel useCases={state.use_cases} />
                    )}

                    {/* Contact Form */}
                    <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">📬</span>
                        <h3 className="font-bold text-white">Get Connected</h3>
                      </div>
                      <ContactForm prefilledCompany={state?.company_name} />
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
                      <h3 className="font-bold text-lg mb-2">Ready to take action?</h3>
                      <p className="text-sm text-white/80 mb-4">
                        Connect with your top-matched agencies or export your GTM report.
                      </p>
                      <div className="space-y-2">
                        <button className="w-full bg-white text-emerald-700 font-medium py-2.5 rounded-lg hover:bg-gray-100 transition">
                          Contact Top Agency
                        </button>
                        <button
                          onClick={() => state && downloadReport(state)}
                          className="w-full bg-white/20 text-white font-medium py-2.5 rounded-lg hover:bg-white/30 transition"
                        >
                          Download Report
                        </button>
                        <button
                          onClick={async () => {
                            if (state) {
                              const success = await copyReportToClipboard(state);
                              if (success) alert('Report copied to clipboard!');
                            }
                          }}
                          className="w-full bg-white/10 text-white/90 font-medium py-2 rounded-lg hover:bg-white/20 transition text-sm"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-black border-t border-white/10 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span className="font-black text-white">GTM.quest</span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-white/60">
                <Link href="/agencies" className="hover:text-white transition">Agencies</Link>
                <Link href="/articles" className="hover:text-white transition">Resources</Link>
                <Link href="/compare" className="hover:text-white transition">Compare</Link>
                <Link href="/gtm-agencies-london" className="hover:text-white transition">London</Link>
                <Link href="/gtm-agencies-new-york" className="hover:text-white transition">New York</Link>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
              © {new Date().getFullYear()} GTM.quest. AI-powered go-to-market strategy.
            </div>
          </div>
        </footer>
      </div>
    </CopilotSidebar>
  );
}
