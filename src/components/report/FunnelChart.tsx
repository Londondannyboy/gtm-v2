'use client';

interface FunnelStage {
  name: string;
  value: number;
  conversionRate?: number;
}

interface Props {
  stages: FunnelStage[];
}

export function FunnelChart({ stages }: Props) {
  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className="space-y-2">
      {stages.map((stage, i) => {
        const width = (stage.value / maxValue) * 100;
        const nextStage = stages[i + 1];
        const conversionRate = nextStage
          ? ((nextStage.value / stage.value) * 100).toFixed(0)
          : null;

        return (
          <div key={stage.name} className="relative">
            {/* Bar */}
            <div
              className="h-12 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-r-lg flex items-center px-4 transition-all duration-700"
              style={{
                width: `${width}%`,
                marginLeft: `${(100 - width) / 2}%`,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <span className="text-white font-medium text-sm truncate">
                {stage.name}
              </span>
              <span className="text-white/80 text-sm ml-auto">
                {stage.value.toLocaleString()}
              </span>
            </div>

            {/* Conversion arrow */}
            {conversionRate && (
              <div className="flex justify-center my-1">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>↓</span>
                  <span>{conversionRate}%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
