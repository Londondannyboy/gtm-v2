'use client';

interface Benchmark {
  metric: string;
  yourValue: number;
  industryAvg: number;
  topPerformer: number;
  unit?: string;
  lowerIsBetter?: boolean;
}

interface Props {
  benchmarks: Benchmark[];
  industry?: string;
}

export function BenchmarkComparison({ benchmarks, industry }: Props) {
  return (
    <div className="space-y-4">
      {industry && (
        <div className="text-sm text-gray-500 mb-4">
          Compared to <span className="font-medium text-gray-700">{industry}</span> industry benchmarks
        </div>
      )}

      {benchmarks.map((bench, i) => {
        const max = Math.max(bench.yourValue, bench.industryAvg, bench.topPerformer);
        const yourWidth = (bench.yourValue / max) * 100;
        const avgWidth = (bench.industryAvg / max) * 100;
        const topWidth = (bench.topPerformer / max) * 100;

        // Determine if your value is good
        const isGood = bench.lowerIsBetter
          ? bench.yourValue <= bench.industryAvg
          : bench.yourValue >= bench.industryAvg;

        return (
          <div
            key={bench.metric}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{bench.metric}</span>
              <span className={`text-sm font-bold ${isGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                {bench.yourValue.toLocaleString()}{bench.unit || ''}
              </span>
            </div>

            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
              {/* Top performer marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 z-10"
                style={{ left: `${topWidth}%` }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-emerald-600 whitespace-nowrap">
                  Top
                </div>
              </div>

              {/* Industry average marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                style={{ left: `${avgWidth}%` }}
              >
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 whitespace-nowrap">
                  Avg
                </div>
              </div>

              {/* Your value bar */}
              <div
                className={`h-full rounded-full transition-all duration-700 ${isGood ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${yourWidth}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mt-4 pt-4 border-t">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>Your metrics</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-gray-400" />
          <span>Industry avg</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-0.5 bg-emerald-400" />
          <span>Top performer</span>
        </div>
      </div>
    </div>
  );
}
