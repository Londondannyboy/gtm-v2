'use client';

interface Category {
  name: string;
  amount: number;
  percentage: number;
}

interface Props {
  categories: Category[];
  total: number;
}

const COLORS = [
  '#10B981', // emerald
  '#6366F1', // indigo
  '#F59E0B', // amber
  '#EC4899', // pink
  '#8B5CF6', // violet
  '#14B8A6', // teal
];

export function BudgetPieChart({ categories, total }: Props) {
  let cumulativePercentage = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex items-center gap-8">
      {/* Pie Chart */}
      <div className="relative">
        <svg width="180" height="180" viewBox="-1 -1 2 2" className="transform -rotate-90">
          {categories.map((cat, i) => {
            const [startX, startY] = getCoordinatesForPercent(cumulativePercentage);
            cumulativePercentage += cat.percentage / 100;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercentage);
            const largeArcFlag = cat.percentage > 50 ? 1 : 0;

            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ');

            return (
              <path
                key={cat.name}
                d={pathData}
                fill={COLORS[i % COLORS.length]}
                className="transition-all duration-500 hover:opacity-80"
              />
            );
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">
            ${(total / 1000).toFixed(0)}k
          </span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {categories.map((cat, i) => (
          <div key={cat.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-sm text-gray-700">{cat.name}</span>
            <span className="text-sm text-gray-500 ml-auto">
              ${(cat.amount / 1000).toFixed(0)}k
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
