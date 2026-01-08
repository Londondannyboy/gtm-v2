'use client';

import { AnimatedNumber } from './AnimatedNumber';

interface ROIProjection {
  estimated_cac: number;
  estimated_ltv: number;
  payback_months: number;
  confidence: string;
  notes: string;
}

interface Props {
  projection: ROIProjection;
}

export function ROICard({ projection }: Props) {
  const ltvCacRatio = projection.estimated_ltv / projection.estimated_cac;

  const getConfidenceColor = () => {
    switch (projection.confidence) {
      case 'high': return 'text-emerald-600 bg-emerald-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatioColor = () => {
    if (ltvCacRatio >= 3) return 'text-emerald-600';
    if (ltvCacRatio >= 2) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 rounded-2xl p-6 border border-emerald-200 animate-in fade-in slide-in-from-bottom duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📈</span>
          <h2 className="text-xl font-bold text-gray-900">ROI Projection</h2>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getConfidenceColor()}`}>
          {projection.confidence} confidence
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* CAC */}
        <div className="bg-white/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            <AnimatedNumber value={projection.estimated_cac} prefix="$" />
          </div>
          <div className="text-sm text-gray-500 mt-1">Est. CAC</div>
        </div>

        {/* LTV */}
        <div className="bg-white/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            <AnimatedNumber value={projection.estimated_ltv} prefix="$" />
          </div>
          <div className="text-sm text-gray-500 mt-1">Est. LTV</div>
        </div>

        {/* Payback */}
        <div className="bg-white/60 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">
            <AnimatedNumber value={projection.payback_months} suffix=" mo" />
          </div>
          <div className="text-sm text-gray-500 mt-1">Payback</div>
        </div>

        {/* LTV:CAC Ratio */}
        <div className="bg-white/60 rounded-xl p-4 text-center">
          <div className={`text-3xl font-bold ${getRatioColor()}`}>
            <AnimatedNumber value={ltvCacRatio} suffix="x" decimals={1} />
          </div>
          <div className="text-sm text-gray-500 mt-1">LTV:CAC</div>
        </div>
      </div>

      {/* Visual Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>CAC Recovery Timeline</span>
          <span>{projection.payback_months} months</span>
        </div>
        <div className="h-4 bg-white/60 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((12 / projection.payback_months) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>6 mo</span>
          <span>12 mo</span>
        </div>
      </div>

      {/* Notes */}
      {projection.notes && (
        <div className="bg-white/40 rounded-lg p-3 text-sm text-gray-600">
          💡 {projection.notes}
        </div>
      )}
    </div>
  );
}
