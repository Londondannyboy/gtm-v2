'use client';

import { useCopilotAction } from '@copilotkit/react-core';
import Link from 'next/link';

/**
 * This component registers useCopilotAction hooks that render
 * rich inline components directly in the chat when the agent
 * performs certain actions.
 */
export function InlineChatActions() {
  // Render agency cards inline when agent finds agencies
  useCopilotAction({
    name: 'showAgencyPreview',
    description: 'Show a preview card for an agency inline in the chat',
    parameters: [
      { name: 'name', type: 'string', description: 'Agency name', required: true },
      { name: 'slug', type: 'string', description: 'Agency slug', required: true },
      { name: 'description', type: 'string', description: 'Brief description' },
      { name: 'headquarters', type: 'string', description: 'Location' },
      { name: 'matchScore', type: 'number', description: 'Match score 0-100' },
      { name: 'specializations', type: 'string[]', description: 'Specializations' },
    ],
    render: ({ args, status }) => {
      if (status === 'executing') {
        return <div className="animate-pulse bg-gray-100 rounded-lg h-24" />;
      }

      const { name, slug, description, headquarters, matchScore, specializations } = args;

      return (
        <div className="bg-white border rounded-xl p-4 my-2 shadow-sm hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">{name}</h4>
              {headquarters && (
                <p className="text-sm text-gray-500">{headquarters}</p>
              )}
            </div>
            {matchScore && (
              <div className="bg-emerald-100 text-emerald-700 text-sm font-bold px-2 py-1 rounded-full">
                {matchScore}% match
              </div>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
          )}
          {specializations && specializations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {specializations.slice(0, 3).map((spec: string) => (
                <span key={spec} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  {spec}
                </span>
              ))}
            </div>
          )}
          <Link
            href={`/agency/${slug}`}
            className="inline-block mt-3 text-sm text-emerald-600 hover:underline"
          >
            View full profile →
          </Link>
        </div>
      );
    },
  });

  // Render ROI calculator inline
  useCopilotAction({
    name: 'showROICalculation',
    description: 'Show an ROI calculation card inline in the chat',
    parameters: [
      { name: 'cac', type: 'number', description: 'Customer Acquisition Cost', required: true },
      { name: 'ltv', type: 'number', description: 'Lifetime Value', required: true },
      { name: 'paybackMonths', type: 'number', description: 'Payback period in months', required: true },
      { name: 'confidence', type: 'string', description: 'Confidence level' },
    ],
    render: ({ args, status }) => {
      if (status === 'executing') {
        return <div className="animate-pulse bg-gray-100 rounded-lg h-32" />;
      }

      const { cac, ltv, paybackMonths, confidence } = args;
      const ratio = (ltv && cac) ? ltv / cac : 0;

      return (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 rounded-xl p-4 my-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <span className="font-semibold text-gray-900">ROI Projection</span>
            {confidence && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                confidence === 'high' ? 'bg-emerald-200 text-emerald-700' :
                confidence === 'medium' ? 'bg-amber-200 text-amber-700' :
                'bg-gray-200 text-gray-700'
              }`}>
                {confidence} confidence
              </span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">${cac?.toLocaleString()}</div>
              <div className="text-xs text-gray-500">CAC</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${ltv?.toLocaleString()}</div>
              <div className="text-xs text-gray-500">LTV</div>
            </div>
            <div>
              <div className={`text-2xl font-bold ${ratio >= 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {ratio?.toFixed(1)}x
              </div>
              <div className="text-xs text-gray-500">LTV:CAC</div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600 text-center">
            Expected payback: <strong>{paybackMonths} months</strong>
          </div>
        </div>
      );
    },
  });

  // Render strategy recommendation inline
  useCopilotAction({
    name: 'showStrategyRecommendation',
    description: 'Show a strategy recommendation card inline in the chat',
    parameters: [
      { name: 'strategyType', type: 'string', description: 'plg, sales_led, or hybrid', required: true },
      { name: 'strategyName', type: 'string', description: 'Human readable name', required: true },
      { name: 'summary', type: 'string', description: 'Brief summary', required: true },
      { name: 'keyActions', type: 'string[]', description: 'Key action items' },
    ],
    render: ({ args, status }) => {
      if (status === 'executing') {
        return <div className="animate-pulse bg-gray-100 rounded-lg h-40" />;
      }

      const { strategyType, strategyName, summary, keyActions } = args;

      const icons: Record<string, string> = {
        plg: '🚀',
        sales_led: '🤝',
        hybrid: '⚡',
      };

      const colors: Record<string, string> = {
        plg: 'from-violet-50 to-purple-100 border-violet-200',
        sales_led: 'from-blue-50 to-indigo-100 border-blue-200',
        hybrid: 'from-emerald-50 to-teal-100 border-emerald-200',
      };

      const colorClass = strategyType ? colors[strategyType] || colors.hybrid : colors.hybrid;

      return (
        <div className={`bg-gradient-to-br ${colorClass} border rounded-xl p-4 my-2`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{strategyType ? icons[strategyType] || '📊' : '📊'}</span>
            <span className="font-bold text-gray-900">{strategyName}</span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{summary}</p>
          {keyActions && keyActions.length > 0 && (
            <div className="space-y-1">
              {keyActions.slice(0, 3).map((action: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-emerald-500">✓</span>
                  {action}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  });

  // Render contact form inline
  useCopilotAction({
    name: 'showContactForm',
    description: 'Show a contact form inline when user wants to get in touch',
    parameters: [
      { name: 'prefilledName', type: 'string', description: 'Prefilled name' },
      { name: 'prefilledEmail', type: 'string', description: 'Prefilled email' },
      { name: 'agencyName', type: 'string', description: 'Agency they want to contact' },
    ],
    render: ({ args }) => {
      return (
        <div className="bg-white border rounded-xl p-4 my-2 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-3">
            {args.agencyName ? `Contact ${args.agencyName}` : 'Get in Touch'}
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              defaultValue={args.prefilledName}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="email"
              placeholder="Your email"
              defaultValue={args.prefilledEmail}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <textarea
              placeholder="Tell us about your GTM needs..."
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition">
              Send Request
            </button>
          </div>
        </div>
      );
    },
  });

  // This component doesn't render anything visible - it just registers the actions
  return null;
}
