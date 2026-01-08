'use client';

import { useCoAgent, useCoAgentStateRender } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Animated card wrapper
const DashboardCard = ({
  children,
  title,
  icon,
  delay = 0,
  color = 'emerald'
}: {
  children: React.ReactNode;
  title: string;
  icon: string;
  delay?: number;
  color?: 'emerald' | 'blue' | 'purple' | 'orange' | 'cyan';
}) => {
  const colors = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`bg-gradient-to-br ${colors[color]} backdrop-blur-sm rounded-2xl p-6 border`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
};

// Animated metric display
const AnimatedMetric = ({ value, label, prefix = '', suffix = '' }: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center"
    >
      <motion.div
        className="text-3xl font-black text-white"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {prefix}{value.toLocaleString()}{suffix}
      </motion.div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  );
};

// Progress ring component
const ProgressRing = ({ progress, size = 80, color = '#10B981' }: {
  progress: number;
  size?: number;
  color?: string;
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
};

// Match score bar
const MatchBar = ({ score, name }: { score: number; name: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-white/80 truncate">{name}</span>
      <span className="text-emerald-400 font-bold">{Math.round(score * 100)}%</span>
    </div>
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${score * 100}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  </div>
);

export function LiveDashboard() {
  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  // Register state renderer for real-time updates
  useCoAgentStateRender({
    name: 'gtm_agent',
    render: () => {
      // This triggers re-renders when agent state changes
      return null; // We render in the main component
    },
  });

  // Calculate what sections to show based on available data
  const hasCompanyInfo = state?.company_name || state?.industry || state?.stage;
  const hasStrategy = !!state?.strategy;
  const hasAgencies = state?.recommended_providers && state.recommended_providers.length > 0;
  const hasROI = !!state?.roi_projection;
  const hasTimeline = state?.timeline_phases && state.timeline_phases.length > 0;
  const hasBudget = !!state?.budget_breakdown;

  // Calculate completion progress
  const sections = [hasCompanyInfo, hasStrategy, hasAgencies, hasROI, hasTimeline, hasBudget];
  const completedSections = sections.filter(Boolean).length;
  const progress = Math.round((completedSections / sections.length) * 100);

  // Don't render if no data
  if (!hasCompanyInfo && !hasStrategy && !hasAgencies && !hasROI) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-black text-white">
            {state?.company_name ? `${state.company_name}'s GTM Dashboard` : 'Your GTM Dashboard'}
          </h2>
          <p className="text-white/60">Building in real-time as you chat...</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <ProgressRing progress={progress} />
            <div className="text-xs text-white/60 mt-1">{progress}% Complete</div>
          </div>
        </div>
      </motion.div>

      {/* Live Building Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-emerald-400 text-sm"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        Live Dashboard - Updates as AI builds your strategy
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {/* Company Profile Card */}
          {hasCompanyInfo && (
            <DashboardCard title="Company Profile" icon="🏢" color="blue" delay={0}>
              <div className="space-y-3">
                {state?.company_name && (
                  <div>
                    <div className="text-xs text-white/50 uppercase">Company</div>
                    <div className="text-white font-semibold">{state.company_name}</div>
                  </div>
                )}
                {state?.industry && (
                  <div>
                    <div className="text-xs text-white/50 uppercase">Industry</div>
                    <div className="text-white">{state.industry}</div>
                  </div>
                )}
                {state?.stage && (
                  <div>
                    <div className="text-xs text-white/50 uppercase">Stage</div>
                    <div className="text-white">{state.stage}</div>
                  </div>
                )}
                {state?.target_market && (
                  <div>
                    <div className="text-xs text-white/50 uppercase">Target Market</div>
                    <div className="text-white">{state.target_market}</div>
                  </div>
                )}
                {state?.budget && (
                  <div>
                    <div className="text-xs text-white/50 uppercase">Monthly Budget</div>
                    <div className="text-emerald-400 font-bold">${state.budget.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </DashboardCard>
          )}

          {/* Strategy Card */}
          {hasStrategy && state?.strategy && (
            <DashboardCard title="Recommended Strategy" icon="🎯" color="emerald" delay={0.1}>
              <div className="space-y-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    state.strategy.type === 'plg' ? 'bg-purple-500/30 text-purple-300' :
                    state.strategy.type === 'sales_led' ? 'bg-blue-500/30 text-blue-300' :
                    'bg-orange-500/30 text-orange-300'
                  }`}>
                    {state.strategy.type.toUpperCase().replace('_', '-')}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-white">{state.strategy.name}</h4>
                <p className="text-white/70 text-sm line-clamp-3">{state.strategy.summary}</p>
                {state.strategy.action_items.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs text-white/50 uppercase mb-2">Next Steps</div>
                    <ul className="space-y-1">
                      {state.strategy.action_items.slice(0, 3).map((item, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                          <span className="text-emerald-400">→</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </DashboardCard>
          )}

          {/* ROI Projection Card */}
          {hasROI && state?.roi_projection && (
            <DashboardCard title="ROI Projection" icon="📈" color="purple" delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                <AnimatedMetric
                  value={state.roi_projection.estimated_cac}
                  label="Est. CAC"
                  prefix="$"
                />
                <AnimatedMetric
                  value={state.roi_projection.estimated_ltv}
                  label="Est. LTV"
                  prefix="$"
                />
                <AnimatedMetric
                  value={Math.round(state.roi_projection.estimated_ltv / state.roi_projection.estimated_cac * 10) / 10}
                  label="LTV:CAC"
                  suffix="x"
                />
                <AnimatedMetric
                  value={state.roi_projection.payback_months}
                  label="Payback"
                  suffix=" mo"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Confidence</span>
                  <span className={`font-bold ${
                    state.roi_projection.confidence === 'high' ? 'text-emerald-400' :
                    state.roi_projection.confidence === 'medium' ? 'text-yellow-400' :
                    'text-orange-400'
                  }`}>
                    {state.roi_projection.confidence.toUpperCase()}
                  </span>
                </div>
              </div>
            </DashboardCard>
          )}

          {/* Agency Matches Card */}
          {hasAgencies && state?.recommended_providers && (
            <DashboardCard title="Agency Matches" icon="🤝" color="cyan" delay={0.3}>
              <div className="space-y-3">
                {state.recommended_providers.slice(0, 4).map((provider, i) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <MatchBar
                      score={provider.match_score || 0.85 - (i * 0.1)}
                      name={provider.name}
                    />
                  </motion.div>
                ))}
              </div>
              <Link
                href="/agencies"
                className="mt-4 block text-center text-sm text-cyan-400 hover:text-cyan-300 transition"
              >
                View all {state.recommended_providers.length} matches →
              </Link>
            </DashboardCard>
          )}

          {/* Timeline Card */}
          {hasTimeline && state?.timeline_phases && (
            <DashboardCard title="Implementation Timeline" icon="📅" color="orange" delay={0.4}>
              <div className="space-y-3">
                {state.timeline_phases.slice(0, 4).map((phase, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/60'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{phase.name}</div>
                      <div className="text-white/50 text-xs">{phase.duration}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Budget Breakdown Card */}
          {hasBudget && state?.budget_breakdown && (
            <DashboardCard title="Budget Allocation" icon="💰" color="emerald" delay={0.5}>
              <div className="space-y-3">
                {state.budget_breakdown.categories.slice(0, 4).map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * i }}
                    className="space-y-1"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">{cat.name}</span>
                      <span className="text-white font-medium">${cat.amount.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.6, delay: 0.2 + (0.1 * i) }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-center">
                <div className="text-2xl font-black text-white">
                  ${state.budget_breakdown.total.toLocaleString()}
                </div>
                <div className="text-xs text-white/50">Total Monthly Budget</div>
              </div>
            </DashboardCard>
          )}
        </AnimatePresence>
      </div>

      {/* Export Actions */}
      {completedSections >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4 pt-6"
        >
          <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
            Export Dashboard
          </button>
          <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition">
            Share Results
          </button>
        </motion.div>
      )}
    </div>
  );
}
