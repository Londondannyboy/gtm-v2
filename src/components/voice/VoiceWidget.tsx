'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';

interface VoiceWidgetProps {
  onMessage?: (text: string, role: 'user' | 'assistant') => void;
  userName?: string | null;
  userId?: string | null;
}

// Inner component that uses the voice hook
function VoiceButton({ onMessage, userName, userId }: VoiceWidgetProps) {
  const { connect, disconnect, status, messages, sendUserInput } = useVoice();
  const [isPending, setIsPending] = useState(false);
  const lastSentMsgId = useRef<string | null>(null);
  const hasGreeted = useRef(false);

  // Forward messages to parent (for CopilotKit sync)
  useEffect(() => {
    const conversationMsgs = messages.filter(
      (m) =>
        (m.type === 'user_message' || m.type === 'assistant_message') &&
        (m as { message?: { content?: string } }).message?.content
    );

    if (conversationMsgs.length > 0 && onMessage) {
      const lastMsg = conversationMsgs[conversationMsgs.length - 1] as {
        type: string;
        message?: { content?: string };
        id?: string;
      };
      const msgId =
        lastMsg?.id ||
        `${conversationMsgs.length}-${lastMsg?.message?.content?.slice(0, 20)}`;

      if (lastMsg?.message?.content && msgId !== lastSentMsgId.current) {
        const isUser = lastMsg.type === 'user_message';
        lastSentMsgId.current = msgId;
        onMessage(lastMsg.message.content, isUser ? 'user' : 'assistant');
      }
    }
  }, [messages, onMessage]);

  const handleToggle = useCallback(async () => {
    if (status.value === 'connected') {
      disconnect();
      return;
    }

    setIsPending(true);
    try {
      // Get Hume access token
      const res = await fetch('/api/hume-token');
      const { accessToken, error } = await res.json();

      if (error || !accessToken) {
        console.error('Failed to get Hume token:', error);
        return;
      }

      // Build GTM-focused system prompt
      const systemPrompt = `## YOUR ROLE
You are a friendly AI GTM (Go-To-Market) strategist helping companies plan their market entry.

## USER CONTEXT
${userName ? `Name: ${userName}` : 'Guest user'}
${userId ? `User ID: ${userId}` : ''}

## GREETING
${
  userName && !hasGreeted.current
    ? `Greet the user: "Hi ${userName.split(' ')[0]}! I'm your GTM strategist. What kind of company are you building?"`
    : hasGreeted.current
    ? 'Do NOT re-greet. Continue the conversation naturally.'
    : 'Give a brief greeting: "Hi! I\'m your GTM strategist. What kind of company are you building?"'
}

## YOUR EXPERTISE
- Go-to-market strategy (PLG, Sales-Led, Hybrid approaches)
- Startup and scale-up growth strategies
- Agency and tool recommendations for GTM
- ROI projections and benchmarks
- Industry-specific GTM tactics

## VOICE GUIDELINES
- Keep responses SHORT (1-2 sentences) for natural conversation
- Ask follow-up questions to understand their needs
- Be warm, consultative, and specific
- When you have enough info, summarize their GTM approach`;

      // Generate stable session ID
      const sessionId = userId
        ? `gtm_${userId}`
        : `gtm_anon_${Math.random().toString(36).slice(2, 10)}`;

      // Connect to Hume EVI
      await connect({
        auth: { type: 'accessToken', value: accessToken },
        configId: process.env.NEXT_PUBLIC_HUME_CONFIG_ID || '',
        sessionSettings: {
          type: 'session_settings',
          systemPrompt: systemPrompt,
          customSessionId: userName ? `${userName}|${sessionId}` : sessionId,
        },
      });

      // Trigger initial greeting for first-time users
      if (userName && !hasGreeted.current) {
        setTimeout(() => {
          hasGreeted.current = true;
          sendUserInput(`Hello, my name is ${userName}`);
        }, 500);
      } else if (!hasGreeted.current) {
        setTimeout(() => {
          hasGreeted.current = true;
          sendUserInput('Hello');
        }, 500);
      }
    } catch (e) {
      console.error('Voice connect error:', e);
    } finally {
      setIsPending(false);
    }
  }, [connect, disconnect, status.value, userName, userId, sendUserInput]);

  const isConnected = status.value === 'connected';

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
        isConnected
          ? 'bg-red-500 hover:bg-red-600 animate-pulse'
          : isPending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 hover:bg-emerald-700'
      }`}
      title={isConnected ? 'Stop voice' : 'Start voice conversation'}
    >
      {isPending ? (
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isConnected ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10h6v4H9z"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          )}
        </svg>
      )}
    </button>
  );
}

// Error and connection handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (err: any) => console.error('Hume Error:', err?.message || err);
const handleOpen = () => console.log('Hume connected');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleClose = (e: any) => console.log('Hume closed:', e?.code, e?.reason);

// Exported component with VoiceProvider wrapper
export function VoiceWidget({ onMessage, userName, userId }: VoiceWidgetProps) {
  return (
    <VoiceProvider onError={handleError} onOpen={handleOpen} onClose={handleClose}>
      <VoiceButton onMessage={onMessage} userName={userName} userId={userId} />
    </VoiceProvider>
  );
}
