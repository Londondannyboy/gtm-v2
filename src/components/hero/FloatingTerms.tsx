'use client';

import { useEffect, useRef, useCallback } from 'react';

// GTM-related terms that float in the background
const GTM_TERMS = [
  // Strategies
  'Product-Led Growth', 'Sales-Led', 'ABM', 'Demand Gen', 'Inbound Marketing',
  'Content Marketing', 'SEO', 'Paid Media', 'Brand Awareness', 'Lead Generation',
  // Stages
  'Series A', 'Series B', 'Seed', 'Growth Stage', 'Enterprise',
  // Markets
  'B2B SaaS', 'FinTech', 'HealthTech', 'MarTech', 'DevTools',
  // Metrics
  'CAC', 'LTV', 'MRR', 'ARR', 'Pipeline', 'Conversion',
  // Tactics
  'Cold Outreach', 'Events', 'Webinars', 'Partnerships', 'Referrals',
  // Agencies
  'GTM Strategy', 'Revenue Operations', 'Growth Marketing', 'Digital PR',
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  opacity: number;
  size: number;
  targetOpacity: number;
  highlighted: boolean;
}

interface FloatingTermsProps {
  highlightTerms?: string[];
  className?: string;
}

export function FloatingTerms({ highlightTerms = [], className = '' }: FloatingTermsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const numParticles = Math.min(GTM_TERMS.length, 25); // Limit for performance

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        text: GTM_TERMS[i],
        opacity: 0.1 + Math.random() * 0.15,
        size: 12 + Math.random() * 6,
        targetOpacity: 0.1 + Math.random() * 0.15,
        highlighted: false,
      });
    }

    return particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      if (particlesRef.current.length === 0) {
        particlesRef.current = initParticles(rect.width, rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Check if this term should be highlighted
        const shouldHighlight = highlightTerms.some(term =>
          particle.text.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(particle.text.toLowerCase())
        );

        // Update highlight state
        particle.highlighted = shouldHighlight;
        particle.targetOpacity = shouldHighlight ? 0.8 : 0.1 + Math.random() * 0.1;

        // Smooth opacity transition
        particle.opacity += (particle.targetOpacity - particle.opacity) * 0.05;

        // Mouse repulsion
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          particle.vx += (dx / dist) * force * 0.1;
          particle.vy += (dy / dist) * force * 0.1;
        }

        // Apply velocity with damping
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Wrap around edges
        if (particle.x < -100) particle.x = rect.width + 100;
        if (particle.x > rect.width + 100) particle.x = -100;
        if (particle.y < -50) particle.y = rect.height + 50;
        if (particle.y > rect.height + 50) particle.y = -50;

        // Draw text
        ctx.font = `${particle.highlighted ? 'bold' : 'normal'} ${particle.size}px Inter, system-ui, sans-serif`;

        if (particle.highlighted) {
          // Glow effect for highlighted terms
          ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
          ctx.shadowBlur = 20;
          ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        }

        ctx.fillText(particle.text, particle.x, particle.y);
      });

      // Draw connecting lines between nearby highlighted particles
      const highlighted = particlesRef.current.filter(p => p.highlighted);
      highlighted.forEach((p1, i) => {
        highlighted.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 * (1 - dist / 200)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [highlightTerms, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
