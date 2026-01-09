'use client';

import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useEffect, useRef } from 'react';
import { Confetti, useNodeConfetti } from '@/components/effects/Confetti';

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

  const fireNodeConfetti = useNodeConfetti();
  const prevCompletedRef = useRef<Set<string>>(new Set());

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
  const isComplete = completedCount === nodes.length;

  // Track newly completed nodes and fire mini confetti
  useEffect(() => {
    const currentCompleted = new Set(nodes.filter(n => n.completed).map(n => n.id));

    // Find newly completed nodes
    currentCompleted.forEach(id => {
      if (!prevCompletedRef.current.has(id)) {
        // This node just completed! Find its position and fire confetti
        const nodeIndex = nodes.findIndex(n => n.id === id);
        if (nodeIndex >= 0) {
          // Calculate approximate position (assuming evenly spaced)
          const containerWidth = window.innerWidth * 0.8; // max-w-5xl approximation
          const nodeX = (window.innerWidth - containerWidth) / 2 + (nodeIndex / (nodes.length - 1)) * containerWidth;
          const nodeY = 200; // Approximate Y position
          fireNodeConfetti(nodeX, nodeY);
        }
      }
    });

    prevCompletedRef.current = currentCompleted;
  }, [nodes, fireNodeConfetti]);

  // Don't show if no data at all
  const hasAnyData = completedCount > 0;
  if (!hasAnyData) return null;

  return (
    <div className="w-full py-8">
      {/* Big confetti when fully complete */}
      <Confetti trigger={isComplete} />

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
              justCompleted={prevCompletedRef.current.has(node.id) && node.completed}
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
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 text-center p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/30"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-5xl mb-2"
            >
              🎉
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-white"
            >
              Strategy Complete!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 mt-1"
            >
              Your personalized GTM plan is ready
            </motion.p>
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
  justCompleted,
}: {
  node: PathNode;
  index: number;
  isActive: boolean;
  justCompleted: boolean;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={nodeRef}
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
        animate={
          isActive
            ? { scale: [1, 1.05, 1] }
            : justCompleted
            ? { scale: [1, 1.2, 1] }
            : {}
        }
        transition={isActive ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
      >
        {node.icon}

        {/* Particle burst effect on completion */}
        <AnimatePresence>
          {node.completed && (
            <>
              {/* Ring burst */}
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full border-2 border-emerald-400"
              />
              {/* Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 40,
                    y: Math.sin((i * Math.PI * 2) / 8) * 40,
                  }}
                  transition={{ duration: 0.6, delay: i * 0.02 }}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Completion Check */}
        <AnimatePresence>
          {node.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="absolute -right-1 -top-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
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
