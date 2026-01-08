'use client';

import { CopilotChat } from '@copilotkit/react-ui';
import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';

// Report Components
import { StrategyCard } from '@/components/report/StrategyCard';
import { AgencyMatchCard } from '@/components/report/AgencyMatchCard';
import { ROICard } from '@/components/report/ROICard';
import { CompanyInfoCard } from '@/components/report/CompanyInfoCard';
import { FunnelChart } from '@/components/report/FunnelChart';

const CONSULT_INSTRUCTIONS = `You are a focused GTM consultant in a dedicated consultation session.

## Your Goal
Help the user build a complete GTM strategy as efficiently as possible.

## Session Flow
1. **Quick Discovery** (2-3 questions max):
   - What are you building?
   - Who's your target customer?
   - What's your stage/budget?

2. **Strategy Generation**:
   - Immediately use generate_strategy tool
   - Use search_agencies to find matches
   - Use generate_roi_projection for metrics

3. **Refinement**:
   - Ask if they want to focus on specific areas
   - Suggest budget breakdown if relevant
   - Offer to connect with agencies

## Tools to Use Aggressively
- update_company_info - Call immediately when you learn anything
- generate_strategy - Call as soon as you have enough context
- search_agencies - Search our 200+ real agencies
- generate_roi_projection - Always provide ROI estimates

Be concise. This is a focused consultation, not a casual chat.`;

export default function ConsultPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  const hasData = state?.strategy || state?.recommended_providers?.length > 0;

  // Demo funnel when strategy exists
  const funnel = state?.strategy ? [
    { name: 'Visitors', value: 10000 },
    { name: 'Leads', value: 1500 },
    { name: 'Qualified', value: 450 },
    { name: 'Deals', value: 135 },
    { name: 'Won', value: 40 },
  ] : null;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Panel - Chat */}
      <div className="w-1/2 flex flex-col border-r border-gray-800">
        {/* Header */}
        <header className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-emerald-400 transition">
            <span className="text-xl">←</span>
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">●</span>
            <span className="text-white text-sm font-medium">GTM Consultation</span>
          </div>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <CopilotChat
            instructions={CONSULT_INSTRUCTIONS}
            labels={{
              title: 'GTM Consultant',
              initial: user
                ? `Hi ${user.name?.split(' ')[0]}! Let's build your GTM strategy. What are you working on?`
                : "Welcome! Let's build your GTM strategy. What product or service are you taking to market?",
              placeholder: 'Tell me about your business...',
            }}
            className="h-full bg-gray-900 text-white"
          />
        </div>
      </div>

      {/* Right Panel - Live Report */}
      <div className="w-1/2 bg-gray-950 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Live Report</h1>
            {hasData && (
              <button className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <span>Export PDF</span>
                <span>↓</span>
              </button>
            )}
          </div>

          {/* Empty State */}
          {!hasData && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-50">📊</div>
              <h2 className="text-xl text-gray-400 mb-2">Your strategy is building...</h2>
              <p className="text-gray-500 text-sm">
                As you chat, your GTM report will appear here in real-time.
              </p>
            </div>
          )}

          {/* Company Info */}
          {(state?.company_name || state?.industry) && (
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <CompanyInfoCard
                companyName={state?.company_name}
                industry={state?.industry}
                stage={state?.stage}
                targetMarket={state?.target_market}
                budget={state?.budget}
              />
            </div>
          )}

          {/* Strategy */}
          {state?.strategy && (
            <div className="animate-in fade-in slide-in-from-right duration-500">
              <StrategyCard strategy={state.strategy} />
            </div>
          )}

          {/* ROI */}
          {state?.roi_projection && (
            <div className="animate-in fade-in slide-in-from-right duration-500" style={{ animationDelay: '100ms' }}>
              <ROICard projection={state.roi_projection} />
            </div>
          )}

          {/* Funnel */}
          {funnel && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔻</span> Expected Funnel
              </h3>
              <FunnelChart stages={funnel} />
            </div>
          )}

          {/* Agencies */}
          {state?.recommended_providers && state.recommended_providers.length > 0 && (
            <div className="animate-in fade-in slide-in-from-right duration-500" style={{ animationDelay: '300ms' }}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🤝</span> Matched Agencies
              </h3>
              <div className="space-y-3">
                {state.recommended_providers.slice(0, 5).map((provider, i) => (
                  <AgencyMatchCard key={provider.id} provider={provider} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {hasData && (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 text-white animate-in fade-in duration-500" style={{ animationDelay: '400ms' }}>
              <h3 className="font-bold text-lg mb-2">Ready to execute?</h3>
              <p className="text-sm text-white/80 mb-4">
                Connect with your top-matched agencies to start implementing your GTM strategy.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 bg-white text-emerald-600 font-medium py-2 rounded-lg hover:bg-gray-100 transition">
                  Contact Agencies
                </button>
                <Link
                  href="/agencies"
                  className="flex-1 text-center bg-white/20 text-white font-medium py-2 rounded-lg hover:bg-white/30 transition"
                >
                  Browse All
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
