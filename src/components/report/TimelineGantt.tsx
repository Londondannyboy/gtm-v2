'use client';

interface Phase {
  name: string;
  duration: string;
  activities: string[];
  milestones: string[];
}

interface Props {
  phases: Phase[];
}

const PHASE_COLORS = [
  'bg-emerald-500',
  'bg-indigo-500',
  'bg-amber-500',
  'bg-pink-500',
];

export function TimelineGantt({ phases }: Props) {
  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Timeline</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map((phase, i) => (
          <div
            key={phase.name}
            className="relative animate-in slide-in-from-left duration-500"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            {/* Phase bar */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${PHASE_COLORS[i % PHASE_COLORS.length]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">{phase.name}</span>
                  <span className="text-sm text-gray-500">{phase.duration}</span>
                </div>
                {/* Progress bar */}
                <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div
                    className={`h-full ${PHASE_COLORS[i % PHASE_COLORS.length]} opacity-20 transition-all duration-1000`}
                    style={{ width: '100%' }}
                  />
                  {/* Activities */}
                  <div className="absolute inset-0 flex items-center px-3">
                    <div className="flex gap-2 overflow-x-auto">
                      {phase.activities.slice(0, 3).map((activity, j) => (
                        <span
                          key={j}
                          className="text-xs bg-white/80 px-2 py-1 rounded shadow-sm whitespace-nowrap"
                        >
                          {activity}
                        </span>
                      ))}
                      {phase.activities.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">
                          +{phase.activities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            {phase.milestones.length > 0 && (
              <div className="ml-6 mt-2 flex flex-wrap gap-2">
                {phase.milestones.map((milestone, j) => (
                  <span
                    key={j}
                    className="text-xs flex items-center gap-1 text-gray-600"
                  >
                    <span className="text-emerald-500">◆</span>
                    {milestone}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
