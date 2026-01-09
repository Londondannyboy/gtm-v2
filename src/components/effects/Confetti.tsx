'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

// Check if mobile for reduced effects
const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const hasTriggered = useRef(false);

  const fireConfetti = useCallback(() => {
    const mobile = isMobile();
    const multiplier = mobile ? 0.4 : 1; // 40% particles on mobile

    // Center burst
    confetti({
      particleCount: Math.round(100 * multiplier),
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#14B8A6', '#06B6D4', '#8B5CF6', '#F59E0B'],
    });

    // Skip side cannons on mobile
    if (!mobile) {
      // Left cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ['#10B981', '#14B8A6', '#06B6D4'],
        });
      }, 150);

      // Right cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ['#10B981', '#14B8A6', '#06B6D4'],
        });
      }, 300);
    }

    // Final burst (reduced on mobile)
    setTimeout(() => {
      confetti({
        particleCount: Math.round(150 * multiplier),
        spread: mobile ? 60 : 100,
        origin: { y: 0.5 },
        colors: ['#10B981', '#14B8A6', '#06B6D4', '#FBBF24', '#A78BFA'],
      });
      onComplete?.();
    }, mobile ? 200 : 500);
  }, [onComplete]);

  useEffect(() => {
    if (trigger && !hasTriggered.current) {
      hasTriggered.current = true;
      fireConfetti();
    }
  }, [trigger, fireConfetti]);

  // Reset when trigger becomes false
  useEffect(() => {
    if (!trigger) {
      hasTriggered.current = false;
    }
  }, [trigger]);

  return null;
}

// Mini confetti burst for node completions
export function useNodeConfetti() {
  const fire = useCallback((x: number, y: number) => {
    const mobile = isMobile();
    // Skip mini confetti on mobile to reduce jank
    if (mobile) return;

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ['#10B981', '#14B8A6', '#06B6D4'],
      ticks: 100,
      gravity: 1.2,
      scalar: 0.8,
    });
  }, []);

  return fire;
}
