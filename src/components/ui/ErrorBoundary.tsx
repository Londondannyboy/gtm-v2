'use client';

import { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

// Default error fallback UI
function DefaultErrorFallback({ error }: { error: Error | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center"
    >
      <div className="text-3xl mb-3">⚠️</div>
      <h3 className="text-lg font-semibold text-white mb-2">Something went wrong</h3>
      <p className="text-white/60 text-sm mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition"
      >
        Refresh Page
      </button>
    </motion.div>
  );
}

// Agent-specific error fallback
export function AgentErrorFallback({ onRetry }: { onRetry?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 text-center"
    >
      <div className="text-3xl mb-3">🔌</div>
      <h3 className="text-lg font-semibold text-white mb-2">AI Agent Unavailable</h3>
      <p className="text-white/60 text-sm mb-4">
        Unable to connect to the GTM strategist. You can still browse agencies and resources.
      </p>
      <div className="flex gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition"
          >
            Try Again
          </button>
        )}
        <a
          href="/agencies"
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition"
        >
          Browse Agencies
        </a>
      </div>
    </motion.div>
  );
}

// Connection status indicator
export function ConnectionStatus({
  status
}: {
  status: 'connecting' | 'connected' | 'disconnected' | 'error'
}) {
  const statusConfig = {
    connecting: {
      color: 'bg-yellow-400',
      text: 'Connecting...',
      pulse: true,
    },
    connected: {
      color: 'bg-emerald-400',
      text: 'Connected',
      pulse: false,
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Disconnected',
      pulse: false,
    },
    error: {
      color: 'bg-red-400',
      text: 'Connection Error',
      pulse: true,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.color} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.color}`} />
      </span>
      <span className="text-white/60">{config.text}</span>
    </div>
  );
}
