'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceWaveformProps {
  isListening: boolean;
  className?: string;
  barCount?: number;
  color?: string;
}

export function VoiceWaveform({
  isListening,
  className = '',
  barCount = 20,
  color = '#10B981',
}: VoiceWaveformProps) {
  const [levels, setLevels] = useState<number[]>(Array(barCount).fill(0.1));
  const animationRef = useRef<number | undefined>(undefined);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);

  useEffect(() => {
    if (!isListening) {
      // Reset levels when not listening
      setLevels(Array(barCount).fill(0.1));
      return;
    }

    // Try to get microphone access for real waveform
    let audioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;

    const setupAudio = async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(mediaStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;
        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount) as Uint8Array<ArrayBuffer>;

        const animate = () => {
          if (analyserRef.current && dataArrayRef.current) {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);

            // Map frequency data to bar levels
            const dataArray = dataArrayRef.current;
            const newLevels = Array(barCount).fill(0).map((_, i) => {
              const index = Math.floor((i / barCount) * dataArray.length);
              return Math.max(0.1, dataArray[index] / 255);
            });

            setLevels(newLevels);
          }
          animationRef.current = requestAnimationFrame(animate);
        };

        animate();
      } catch {
        // If microphone access denied, use simulated waveform
        console.log('Microphone access denied, using simulated waveform');
        simulateWaveform();
      }
    };

    const simulateWaveform = () => {
      let phase = 0;
      const animate = () => {
        phase += 0.1;
        const newLevels = Array(barCount).fill(0).map((_, i) => {
          const wave1 = Math.sin(phase + i * 0.3) * 0.3;
          const wave2 = Math.sin(phase * 1.5 + i * 0.5) * 0.2;
          const noise = Math.random() * 0.2;
          return Math.max(0.15, Math.min(1, 0.4 + wave1 + wave2 + noise));
        });
        setLevels(newLevels);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    setupAudio();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContext) {
        audioContext.close();
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening, barCount]);

  return (
    <AnimatePresence>
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`flex items-center justify-center gap-[2px] ${className}`}
        >
          {levels.map((level, i) => (
            <motion.div
              key={i}
              className="w-1 rounded-full"
              style={{ backgroundColor: color }}
              animate={{
                height: `${level * 40}px`,
              }}
              transition={{
                duration: 0.05,
                ease: 'linear',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Compact circular waveform for the voice button
export function CircularWaveform({
  isListening,
  size = 60,
  color = '#10B981',
}: {
  isListening: boolean;
  size?: number;
  color?: string;
}) {
  const [amplitude, setAmplitude] = useState(0);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isListening) {
      setAmplitude(0);
      return;
    }

    let phase = 0;
    const animate = () => {
      phase += 0.15;
      const newAmplitude = 0.5 + Math.sin(phase) * 0.3 + Math.random() * 0.2;
      setAmplitude(newAmplitude);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening]);

  const rings = [1, 1.3, 1.6, 1.9];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Pulsing rings */}
      <AnimatePresence>
        {isListening && rings.map((scale, i) => (
          <motion.div
            key={i}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{
              scale: 1 + amplitude * scale * 0.3,
              opacity: 0.6 - i * 0.15,
            }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 rounded-full"
            style={{
              border: `2px solid ${color}`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Center dot */}
      <motion.div
        animate={{
          scale: isListening ? 1 + amplitude * 0.2 : 1,
        }}
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: size * 0.4,
          height: size * 0.4,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

// Simple bars that fit in a small container
export function MiniWaveform({
  isActive,
  barCount = 5,
  color = '#10B981',
  className = '',
}: {
  isActive: boolean;
  barCount?: number;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {Array(barCount).fill(0).map((_, i) => (
        <motion.div
          key={i}
          className="w-0.5 rounded-full"
          style={{ backgroundColor: color }}
          animate={isActive ? {
            height: ['8px', '16px', '8px'],
          } : {
            height: '4px',
          }}
          transition={isActive ? {
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          } : {}}
        />
      ))}
    </div>
  );
}
