'use client';

import { useState } from 'react';
import { CopilotPopup } from '@copilotkit/react-ui';

interface Props {
  instructions: string;
  userName?: string;
}

export function FloatingChat({ instructions, userName }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-800 hover:bg-gray-700 rotate-45'
            : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-110'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <CopilotPopup
            instructions={instructions}
            labels={{
              title: 'GTM Advisor',
              initial: userName
                ? `Hey ${userName}! 👋 How can I help with your GTM strategy today?`
                : "Hey! 👋 I'm your GTM advisor. What can I help you with?",
              placeholder: 'Ask about GTM strategies, agencies...',
            }}
            className="h-full"
          />
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
