'use client';

import { motion } from 'framer-motion';

// Base skeleton with shimmer effect
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// Dashboard card skeleton
export function DashboardCardSkeleton() {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

// Strategy path skeleton
export function StrategyPathSkeleton() {
  return (
    <div className="w-full py-8">
      {/* Progress bar skeleton */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Nodes skeleton */}
      <div className="relative">
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10" />
        <div className="relative flex justify-between">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-16 mt-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Live dashboard loading state
export function LiveDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="w-20 h-20 rounded-full" />
      </div>

      {/* Grid skeleton */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>
    </div>
  );
}

// Agent connecting state
export function AgentConnectingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full mb-4"
      />
      <h3 className="text-lg font-semibold text-white mb-2">Connecting to AI Strategist</h3>
      <p className="text-white/60 text-sm">Setting up your personalized GTM experience...</p>
    </motion.div>
  );
}

// Pulsing dot indicator
export function PulsingDot({ color = 'emerald' }: { color?: string }) {
  const colorClasses = {
    emerald: 'bg-emerald-400',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
  };

  return (
    <span className="relative flex h-3 w-3">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${colorClasses[color as keyof typeof colorClasses] || colorClasses.emerald}`} />
    </span>
  );
}
