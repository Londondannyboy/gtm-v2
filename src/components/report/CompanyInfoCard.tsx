'use client';

interface Props {
  companyName?: string;
  industry?: string;
  stage?: string;
  targetMarket?: string;
  budget?: number;
}

const stageLabels: Record<string, { label: string; color: string }> = {
  seed: { label: 'Seed', color: 'bg-purple-100 text-purple-700' },
  series_a: { label: 'Series A', color: 'bg-blue-100 text-blue-700' },
  series_b: { label: 'Series B', color: 'bg-indigo-100 text-indigo-700' },
  growth: { label: 'Growth', color: 'bg-emerald-100 text-emerald-700' },
  enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700' },
};

export function CompanyInfoCard({ companyName, industry, stage, targetMarket, budget }: Props) {
  const stageInfo = stage ? stageLabels[stage] : null;
  const hasAnyData = companyName || industry || stage || targetMarket || budget;

  if (!hasAnyData) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🏢</span>
        <h3 className="font-semibold text-gray-900">Company Profile</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {companyName && (
          <div className="col-span-2 md:col-span-1">
            <div className="text-xs text-gray-500 mb-1">Company</div>
            <div className="font-semibold text-gray-900">{companyName}</div>
          </div>
        )}

        {industry && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Industry</div>
            <div className="font-medium text-gray-700">{industry}</div>
          </div>
        )}

        {stageInfo && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Stage</div>
            <span className={`inline-block text-sm px-2 py-1 rounded-full ${stageInfo.color}`}>
              {stageInfo.label}
            </span>
          </div>
        )}

        {targetMarket && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Target Market</div>
            <div className="font-medium text-gray-700">{targetMarket}</div>
          </div>
        )}

        {budget && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Budget</div>
            <div className="font-semibold text-emerald-600">
              ${budget.toLocaleString()}/mo
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
