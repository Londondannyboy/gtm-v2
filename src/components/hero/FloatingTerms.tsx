'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// GTM-related terms with their filter categories
const GTM_TERMS: { text: string; filter: string }[] = [
  // Strategies
  { text: 'Product-Led Growth', filter: 'plg' },
  { text: 'Sales-Led', filter: 'sales' },
  { text: 'ABM', filter: 'abm' },
  { text: 'Demand Gen', filter: 'demand-generation' },
  { text: 'Inbound Marketing', filter: 'inbound' },
  { text: 'Content Marketing', filter: 'content' },
  { text: 'SEO', filter: 'seo' },
  { text: 'Paid Media', filter: 'paid-media' },
  { text: 'Brand Awareness', filter: 'branding' },
  { text: 'Lead Generation', filter: 'lead-gen' },
  // Stages
  { text: 'Series A', filter: 'series-a' },
  { text: 'Series B', filter: 'series-b' },
  { text: 'Seed', filter: 'seed' },
  { text: 'Growth Stage', filter: 'growth' },
  { text: 'Enterprise', filter: 'enterprise' },
  // Markets
  { text: 'B2B SaaS', filter: 'saas' },
  { text: 'FinTech', filter: 'fintech' },
  { text: 'HealthTech', filter: 'healthtech' },
  { text: 'MarTech', filter: 'martech' },
  { text: 'DevTools', filter: 'devtools' },
  // Metrics
  { text: 'CAC', filter: 'cac-optimization' },
  { text: 'LTV', filter: 'retention' },
  { text: 'MRR', filter: 'revenue' },
  { text: 'ARR', filter: 'revenue' },
  { text: 'Pipeline', filter: 'pipeline' },
  { text: 'Conversion', filter: 'cro' },
  // Tactics
  { text: 'Cold Outreach', filter: 'outbound' },
  { text: 'Events', filter: 'events' },
  { text: 'Webinars', filter: 'webinars' },
  { text: 'Partnerships', filter: 'partnerships' },
  { text: 'Referrals', filter: 'referral' },
  // Agencies
  { text: 'GTM Strategy', filter: 'strategy' },
  { text: 'Revenue Operations', filter: 'revops' },
  { text: 'Growth Marketing', filter: 'growth' },
  { text: 'Digital PR', filter: 'pr' },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  text: string;
  filter: string;
  opacity: number;
  size: number;
  targetOpacity: number;
  highlighted: boolean;
  depth: number; // For parallax effect (0-1)
  baseY: number; // Original Y position for parallax calculation
}

interface FloatingTermsProps {
  highlightTerms?: string[];
  className?: string;
  onTermClick?: (filter: string) => void;
}

export function FloatingTerms({ highlightTerms = [], className = '', onTermClick }: FloatingTermsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, clicked: false });
  const scrollRef = useRef(0);
  const router = useRouter();

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const numParticles = Math.min(GTM_TERMS.length, 30);

    for (let i = 0; i < numParticles; i++) {
      const y = Math.random() * height;
      particles.push({
        x: Math.random() * width,
        y,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2,
        text: GTM_TERMS[i].text,
        filter: GTM_TERMS[i].filter,
        opacity: 0.1 + Math.random() * 0.15,
        size: 12 + Math.random() * 6,
        targetOpacity: 0.1 + Math.random() * 0.15,
        highlighted: false,
        depth: Math.random(), // Random depth for parallax
      });
    }

    return particles;
  }, []);

  // Handle click on particle
  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if click is on a particle
    for (const particle of particlesRef.current) {
      ctx.font = `${particle.highlighted ? 'bold' : 'normal'} ${particle.size}px Inter, system-ui, sans-serif`;
      const textWidth = ctx.measureText(particle.text).width;
      const textHeight = particle.size;

      if (
        x >= particle.x &&
        x <= particle.x + textWidth &&
        y >= particle.y - textHeight &&
        y <= particle.y
      ) {
        // Clicked on this particle!
        if (onTermClick) {
          onTermClick(particle.filter);
        } else {
          router.push(`/agencies?search=${encodeURIComponent(particle.text)}`);
        }
        break;
      }
    }
  }, [router, onTermClick]);

  // Handle scroll for parallax
  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
        clicked: false,
      };

      // Check if hovering over a particle and change cursor
      let isOverParticle = false;
      for (const particle of particlesRef.current) {
        ctx.font = `${particle.highlighted ? 'bold' : 'normal'} ${particle.size}px Inter, system-ui, sans-serif`;
        const textWidth = ctx.measureText(particle.text).width;
        const textHeight = particle.size;

        if (
          mouseRef.current.x >= particle.x &&
          mouseRef.current.x <= particle.x + textWidth &&
          mouseRef.current.y >= particle.y - textHeight &&
          mouseRef.current.y <= particle.y
        ) {
          isOverParticle = true;
          break;
        }
      }
      canvas.style.cursor = isOverParticle ? 'pointer' : 'default';
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

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

        // Parallax effect based on scroll and depth
        const parallaxOffset = scrollRef.current * particle.depth * 0.3;
        const displayY = particle.y - parallaxOffset;

        // Wrap around edges (using displayY for bounds check)
        if (particle.x < -100) particle.x = rect.width + 100;
        if (particle.x > rect.width + 100) particle.x = -100;
        if (displayY < -50) particle.y += rect.height + 100;
        if (displayY > rect.height + 50) particle.y -= rect.height + 100;

        // Scale based on depth (closer = larger)
        const depthScale = 0.8 + particle.depth * 0.4;
        const adjustedSize = particle.size * depthScale;

        // Draw text
        ctx.font = `${particle.highlighted ? 'bold' : 'normal'} ${adjustedSize}px Inter, system-ui, sans-serif`;

        if (particle.highlighted) {
          // Glow effect for highlighted terms
          ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
          ctx.shadowBlur = 20;
          ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        } else {
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          // Depth affects opacity too - closer = more visible
          const depthOpacity = particle.opacity * (0.5 + particle.depth * 0.5);
          ctx.fillStyle = `rgba(255, 255, 255, ${depthOpacity})`;
        }

        ctx.fillText(particle.text, particle.x, displayY);
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
            ctx.moveTo(p1.x, p1.y - scrollRef.current * p1.depth * 0.3);
            ctx.lineTo(p2.x, p2.y - scrollRef.current * p2.depth * 0.3);
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
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [highlightTerms, initParticles, handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
