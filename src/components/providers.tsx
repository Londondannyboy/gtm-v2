'use client';

import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react/ui';
import { CopilotKit } from '@copilotkit/react-core';
import { authClient } from '@/lib/auth/client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/"
      social={{ providers: ['google'] }}
    >
      <CopilotKit runtimeUrl="/api/copilotkit" agent="gtm_agent">
        {children}
      </CopilotKit>
    </NeonAuthUIProvider>
  );
}
