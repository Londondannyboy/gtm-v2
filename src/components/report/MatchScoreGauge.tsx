'use client';

interface Props {
  score: number; // 0-1
  size?: number;
  label?: string;
}

export function MatchScoreGauge({ score, size = 80, label }: Props) {
  const percentage = Math.round(score * 100);
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (score * circumference);

  // Color based on score
  const getColor = () => {
    if (score >= 0.8) return '#10B981'; // emerald
    if (score >= 0.6) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={36}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={36}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-xl font-bold" style={{ color: getColor() }}>
          {percentage}%
        </span>
      </div>
      {label && (
        <span className="text-xs text-gray-500 mt-1">{label}</span>
      )}
    </div>
  );
}
