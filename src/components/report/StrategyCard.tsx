'use client';

interface GTMStrategy {
  name: string;
  type: string;
  summary: string;
  recommended_for: string[];
  action_items: string[];
}

interface Props {
  strategy: GTMStrategy;
}

const strategyIcons: Record<string, string> = {
  plg: '🚀',
  sales_led: '🤝',
  hybrid: '⚡',
};

const strategyColors: Record<string, { bg: string; border: string; accent: string }> = {
  plg: {
    bg: 'from-violet-50 to-purple-100',
    border: 'border-violet-200',
    accent: 'text-violet-600 bg-violet-100',
  },
  sales_led: {
    bg: 'from-blue-50 to-indigo-100',
    border: 'border-blue-200',
    accent: 'text-blue-600 bg-blue-100',
  },
  hybrid: {
    bg: 'from-emerald-50 to-teal-100',
    border: 'border-emerald-200',
    accent: 'text-emerald-600 bg-emerald-100',
  },
};

export function StrategyCard({ strategy }: Props) {
  const colors = strategyColors[strategy.type] || strategyColors.hybrid;
  const icon = strategyIcons[strategy.type] || '📊';

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border ${colors.border} animate-in fade-in slide-in-from-top duration-500`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{icon}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.accent}`}>
              Recommended Strategy
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{strategy.name}</h2>
        </div>
      </div>

      {/* Summary */}
      <p className="text-gray-700 mb-6 leading-relaxed">
        {strategy.summary}
      </p>

      {/* Recommended For */}
      {strategy.recommended_for.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Best For</h4>
          <div className="flex flex-wrap gap-2">
            {strategy.recommended_for.map((item) => (
              <span
                key={item}
                className="text-sm px-3 py-1.5 bg-white/60 rounded-lg text-gray-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {strategy.action_items.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">Action Items</h4>
          <div className="space-y-2">
            {strategy.action_items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/50 rounded-lg p-3 animate-in slide-in-from-left duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-6 h-6 rounded-full ${colors.accent} flex items-center justify-center text-sm font-bold shrink-0`}>
                  {i + 1}
                </div>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
