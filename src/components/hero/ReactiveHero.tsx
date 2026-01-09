'use client';

import { useCoAgent } from '@copilotkit/react-core';
import { GTMState } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useMemo } from 'react';
import { FloatingTerms } from './FloatingTerms';
import { ScrambleText } from '@/components/effects/TypeWriter';

// Industry-specific gradients
const industryGradients: Record<string, string> = {
  'saas': 'from-blue-900/40 via-indigo-900/30 to-purple-900/40',
  'fintech': 'from-emerald-900/40 via-teal-900/30 to-cyan-900/40',
  'healthtech': 'from-red-900/40 via-rose-900/30 to-pink-900/40',
  'martech': 'from-orange-900/40 via-amber-900/30 to-yellow-900/40',
  'devtools': 'from-violet-900/40 via-purple-900/30 to-fuchsia-900/40',
  'ecommerce': 'from-green-900/40 via-emerald-900/30 to-teal-900/40',
  'ai': 'from-cyan-900/40 via-blue-900/30 to-indigo-900/40',
  'default': 'from-zinc-900/60 via-black/40 to-zinc-900/60',
};

// Headlines based on context
function getContextualHeadline(state: Partial<GTMState>): { main: string; sub: string } {
  if (state.company_name && state.industry) {
    return {
      main: `GTM Strategy for ${state.company_name}`,
      sub: `AI-powered go-to-market intelligence for ${state.industry}`,
    };
  }
  if (state.industry) {
    return {
      main: `GTM Strategy for ${state.industry}`,
      sub: 'AI-powered go-to-market intelligence',
    };
  }
  if (state.stage) {
    return {
      main: `GTM for ${state.stage} Companies`,
      sub: 'Find the perfect agencies and strategies',
    };
  }
  if (state.target_market) {
    return {
      main: `Dominate ${state.target_market}`,
      sub: 'AI-powered go-to-market strategy',
    };
  }
  return {
    main: 'Your AI GTM Strategist',
    sub: 'Speak or type to get personalized go-to-market recommendations',
  };
}

// Extract keywords from state for floating terms highlighting
function extractKeywords(state: Partial<GTMState>): string[] {
  const keywords: string[] = [];
  if (state.industry) keywords.push(state.industry);
  if (state.stage) keywords.push(state.stage);
  if (state.target_market) keywords.push(state.target_market);
  if (state.strategy?.type) keywords.push(state.strategy.type);
  if (state.strategy?.name) keywords.push(...state.strategy.name.split(' '));
  return keywords;
}

// Detect industry from state
function detectIndustry(state: Partial<GTMState>): string {
  const industry = state.industry?.toLowerCase() || '';
  if (industry.includes('saas') || industry.includes('software')) return 'saas';
  if (industry.includes('fintech') || industry.includes('finance')) return 'fintech';
  if (industry.includes('health') || industry.includes('medical')) return 'healthtech';
  if (industry.includes('marketing') || industry.includes('martech')) return 'martech';
  if (industry.includes('developer') || industry.includes('devtool')) return 'devtools';
  if (industry.includes('ecommerce') || industry.includes('retail')) return 'ecommerce';
  if (industry.includes('ai') || industry.includes('machine learning')) return 'ai';
  return 'default';
}

interface ReactiveHeroProps {
  videoSrc?: string;
  className?: string;
}

export function ReactiveHero({
  videoSrc = 'https://stream.mux.com/qIS6PGKxIZyzjrDBzxQuqPRBOhHofDnXq1chdsqAY9Y/high.mp4',
  className = ''
}: ReactiveHeroProps) {
  const { state } = useCoAgent<GTMState>({
    name: 'gtm_agent',
    initialState: {
      recommended_providers: [],
      use_cases: [],
      timeline_phases: [],
    },
  });

  const { main: headline, sub: subheadline } = useMemo(() =>
    getContextualHeadline(state || {}), [state]
  );

  const gradientClass = useMemo(() =>
    industryGradients[detectIndustry(state || {})] || industryGradients.default,
    [state]
  );

  const highlightKeywords = useMemo(() =>
    extractKeywords(state || {}), [state]
  );

  const hasContext = state?.company_name || state?.industry || state?.stage;

  return (
    <section className={`relative w-full h-screen bg-black overflow-hidden ${className}`}>
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Animated Gradient Overlay - Changes based on industry */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        key={gradientClass}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />

      {/* Floating Terms Background */}
      <FloatingTerms highlightTerms={highlightKeywords} />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        {/* Context indicator */}
        <AnimatePresence>
          {hasContext && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                Personalizing for you...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Headline - Scramble animation on change */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white text-center max-w-5xl leading-tight"
        >
          <ScrambleText text={headline} duration={800} />
        </motion.h1>

        {/* Subheadline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={subheadline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-xl md:text-2xl text-white/70 text-center max-w-2xl"
          >
            {subheadline}
          </motion.p>
        </AnimatePresence>

        {/* Live Stats - Contextual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex gap-8 md:gap-16"
        >
          <StatBox
            number="200+"
            label={state?.industry ? `${state.industry} Agencies` : 'GTM Agencies'}
          />
          <StatBox
            number="50+"
            label="Specializations"
          />
          <StatBox
            number="AI"
            label="Powered Matching"
          />
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50 text-sm flex flex-col items-center gap-2"
          >
            <span>Start talking or scroll</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      className="text-center"
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-3xl md:text-4xl font-black text-white">{number}</div>
      <div className="text-sm text-white/60">{label}</div>
    </motion.div>
  );
}
