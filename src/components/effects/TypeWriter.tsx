'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  cursor?: boolean;
}

export function TypeWriter({
  text,
  speed = 50,
  className = '',
  onComplete,
  cursor = true,
}: TypeWriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const previousText = useRef('');

  useEffect(() => {
    // If text changed, start typing animation
    if (text !== previousText.current) {
      previousText.current = text;
      setIsTyping(true);
      setDisplayedText('');

      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      <AnimatePresence>
        {cursor && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: isTyping ? [1, 0, 1] : 0 }}
            transition={{ duration: 0.8, repeat: isTyping ? Infinity : 0 }}
            className="inline-block ml-1 w-[3px] h-[1em] bg-emerald-400 align-middle"
          />
        )}
      </AnimatePresence>
    </span>
  );
}

// Scramble text effect - letters scramble then resolve
interface ScrambleTextProps {
  text: string;
  className?: string;
  duration?: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function ScrambleText({ text, className = '', duration = 1000 }: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState(text);
  const previousText = useRef(text);

  useEffect(() => {
    if (text !== previousText.current) {
      previousText.current = text;
      const startTime = Date.now();
      const iterations = Math.max(text.length, displayedText.length);

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const newText = text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            const charProgress = Math.min((progress * text.length - i) / 3, 1);
            if (charProgress >= 1) return char;
            if (charProgress <= 0) return chars[Math.floor(Math.random() * chars.length)];
            return Math.random() > charProgress
              ? chars[Math.floor(Math.random() * chars.length)]
              : char;
          })
          .join('');

        setDisplayedText(newText.slice(0, Math.ceil(progress * text.length) + iterations));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayedText(text);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [text, duration, displayedText.length]);

  return <span className={className}>{displayedText}</span>;
}
