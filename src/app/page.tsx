'use client';

import { CopilotSidebar } from '@copilotkit/react-ui';
import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';

// Instructions for the GTM advisor agent
const GTM_INSTRUCTIONS = `You are an expert Go-To-Market (GTM) strategist helping companies plan their market entry.

Your role:
- Ask about the user's company, product, target market, and goals
- Recommend a GTM strategy (Product-Led Growth, Sales-Led, or Hybrid)
- Suggest relevant agencies and tools from our database
- Provide ROI projections based on industry benchmarks
- Share relevant case studies from similar companies

Always be conversational and helpful. Ask follow-up questions to understand their needs.
When you have enough information, use your tools to generate recommendations.

Start by greeting the user and asking what kind of company they're building.`;

export default function Home() {
  // Sync state with the Pydantic AI agent
  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  return (
    <CopilotSidebar
      defaultOpen={true}
      instructions={GTM_INSTRUCTIONS}
      labels={{
        title: 'GTM Strategist',
        initial: "Hi! I'm your AI GTM strategist. Tell me about your company and I'll help you build a go-to-market plan.",
      }}
      className="h-screen"
    >
      <main className="min-h-screen p-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-4xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
            GTM.quest
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            AI-Powered Go-To-Market Strategy
          </p>
        </div>

        {/* Report Panel - Populated via useCoAgent state */}
        <div className="max-w-6xl mx-auto">
          {/* Empty state */}
          {!state?.strategy && !state?.recommended_providers?.length && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">&#127919;</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Your GTM Strategy Report
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Start a conversation with our AI strategist. As you chat, your personalized GTM report will appear here.
              </p>
            </div>
          )}

          {/* Strategy Card */}
          {state?.strategy && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Recommended Strategy: {state.strategy.name}
              </h2>
              <p className="text-gray-600 mb-4">{state.strategy.summary}</p>
              <div className="flex flex-wrap gap-2">
                {state.strategy.action_items.map((item, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/70 rounded-full text-sm text-gray-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Providers Grid */}
          {state?.recommended_providers && state.recommended_providers.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recommended Providers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.recommended_providers.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {provider.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {provider.description}
                    </p>
                    {provider.match_score && (
                      <div className="mt-2 text-sm text-indigo-600 font-medium">
                        {Math.round(provider.match_score * 100)}% match
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROI Card */}
          {state?.roi_projection && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                ROI Projection
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">
                    ${state.roi_projection.estimated_cac.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Est. CAC</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">
                    ${state.roi_projection.estimated_ltv.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Est. LTV</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">
                    {state.roi_projection.payback_months}mo
                  </div>
                  <div className="text-sm text-gray-600">Payback</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">
                {state.roi_projection.notes}
              </p>
            </div>
          )}

          {/* Use Cases */}
          {state?.use_cases && state.use_cases.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Similar Success Stories
              </h2>
              <div className="space-y-4">
                {state.use_cases.map((useCase, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="font-semibold text-gray-800">
                        {useCase.company_name}
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
                        {useCase.industry}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Challenge:</strong> {useCase.challenge}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Solution:</strong> {useCase.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </CopilotSidebar>
  );
}
