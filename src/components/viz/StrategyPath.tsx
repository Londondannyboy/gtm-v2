'use client';

import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';

interface PathNode {
  id: string;
  label: string;
  icon: string;
  value: string | null;
  completed: boolean;
}

export function StrategyPath() {
  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  const nodes = useMemo((): PathNode[] => [
    {
      id: 'company',
      label: 'Company',
      icon: '🏢',
      value: state?.company_name || null,
      completed: !!state?.company_name,
    },
    {
      id: 'industry',
      label: 'Industry',
      icon: '🎯',
      value: state?.industry || null,
      completed: !!state?.industry,
    },
    {
      id: 'stage',
      label: 'Stage',
      icon: '📈',
      value: state?.stage || null,
      completed: !!state?.stage,
    },
    {
      id: 'market',
      label: 'Market',
      icon: '🌍',
      value: state?.target_market || null,
      completed: !!state?.target_market,
    },
    {
      id: 'strategy',
      label: 'Strategy',
      icon: '⚡',
      value: state?.strategy?.name || null,
      completed: !!state?.strategy,
    },
    {
      id: 'agencies',
      label: 'Agencies',
      icon: '🤝',
      value: state?.recommended_providers?.length
        ? `${state.recommended_providers.length} matches`
        : null,
      completed: (state?.recommended_providers?.length || 0) > 0,
    },
  ], [state]);

  const completedCount = nodes.filter(n => n.completed).length;
  const progress = (completedCount / nodes.length) * 100;

  // Don't show if no data at all
  const hasAnyData = completedCount > 0;
  if (!hasAnyData) return null;

  return (
    <div className="w-full py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">Your GTM Journey</span>
          <span className="text-sm text-emerald-400 font-bold">{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Path Visualization */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10" />
        <motion.div
          className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400"
          initial={{ width: 0 }}
          animate={{ width: `${(completedCount / nodes.length) * 100}%` }}
          transition={{ duration: 0.8 }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {nodes.map((node, index) => (
            <PathNodeComponent
              key={node.id}
              node={node}
              index={index}
              isActive={index === completedCount}
            />
          ))}
        </div>
      </div>

      {/* Current Step Hint */}
      <AnimatePresence>
        {completedCount < nodes.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 text-center"
          >
            <p className="text-white/60 text-sm">
              Next: Tell me about your{' '}
              <span className="text-emerald-400 font-semibold">
                {nodes[completedCount]?.label.toLowerCase()}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {completedCount === nodes.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-4xl mb-2"
            >
              🎉
            </motion.div>
            <h3 className="text-xl font-bold text-white">Strategy Complete!</h3>
            <p className="text-white/70 mt-1">Your personalized GTM plan is ready</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PathNodeComponent({
  node,
  index,
  isActive,
}: {
  node: PathNode;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      {/* Node Circle */}
      <motion.div
        className={`relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
          node.completed
            ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
            : isActive
            ? 'bg-white/20 ring-2 ring-emerald-500 ring-offset-2 ring-offset-black'
            : 'bg-white/10'
        }`}
        whileHover={{ scale: 1.1 }}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={isActive ? { duration: 2, repeat: Infinity } : {}}
      >
        {node.icon}

        {/* Completion Check */}
        <AnimatePresence>
          {node.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse for active node */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-emerald-500/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Label */}
      <div className="mt-3 text-center">
        <div className={`text-sm font-medium ${node.completed ? 'text-white' : 'text-white/50'}`}>
          {node.label}
        </div>

        {/* Value */}
        <AnimatePresence>
          {node.value && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-emerald-400 mt-1 max-w-[80px] truncate"
            >
              {node.value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
