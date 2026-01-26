'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import Link from 'next/link';

// ==================== INTERSECTION OBSERVER HOOK ====================

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}

// ==================== FADE IN COMPONENT ====================

interface FadeInProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
}: FadeInProps) {
  const { ref, isInView } = useInView();

  const directionStyles = {
    up: 'translate-y-10',
    down: '-translate-y-10',
    left: 'translate-x-10',
    right: '-translate-x-10',
    none: '',
  };

  return (
    <div
      ref={ref}
      className={`transition-all ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translate(0, 0)' : undefined,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          transform: isInView ? 'none' : directionStyles[direction] ? `translateY(${direction === 'up' ? '40px' : direction === 'down' ? '-40px' : '0'}) translateX(${direction === 'left' ? '40px' : direction === 'right' ? '-40px' : '0'})` : 'none',
          transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ==================== STAGGER CHILDREN ====================

interface StaggerChildrenProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  className = '',
}: StaggerChildrenProps) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * staggerDelay}s`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

// ==================== PARALLAX SECTION ====================

interface ParallaxSectionProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxSection({
  children,
  speed = 0.5,
  className = '',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      setOffset(scrollProgress * 100 * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ==================== SCALE ON SCROLL ====================

interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
}

export function ScaleOnScroll({ children, className = '' }: ScaleOnScrollProps) {
  const { ref, isInView } = useInView();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'scale(1)' : 'scale(0.9)',
        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </div>
  );
}

// ==================== COUNTER ANIMATION ====================

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function Counter({ end, duration = 2, suffix = '', className = '' }: CounterProps) {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Ease out quad
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

// ==================== TEXT REVEAL ====================

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const { ref, isInView } = useInView();
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <span
            className="inline-block"
            style={{
              transform: isInView ? 'translateY(0)' : 'translateY(100%)',
              transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * 0.05}s`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

// ==================== MAGNETIC BUTTON ====================

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) * strength;
    const y = (e.clientY - centerY) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {children}
    </button>
  );
}

// ==================== FLOATING ELEMENT ====================

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 20,
  duration = 6,
}: FloatingElementProps) {
  return (
    <div
      className={className}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        ['--float-amplitude' as string]: `${amplitude}px`,
      }}
    >
      {children}
    </div>
  );
}

// ==================== GLOW CARD ====================

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'rgba(40, 121, 216, 0.4)',
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ==================== SECTION HEADING ====================

interface SectionHeadingProps {
  overline?: string;
  title: string;
  description?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  overline,
  title,
  description,
  centered = true,
  light = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <FadeIn className={`${centered ? 'text-center' : ''} ${className}`}>
      {overline && (
        <p className={`uppercase tracking-[0.2em] text-sm font-medium mb-4 ${light ? 'text-[var(--rb-accent)]' : 'text-[var(--rb-primary)]'}`}>
          {overline}
        </p>
      )}
      <h2 className={`text-3xl lg:text-5xl font-bold mb-6 leading-tight ${light ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
    </FadeIn>
  );
}

// ==================== ICONS ====================

export function ArrowIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

export function PhoneIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

// ==================== LINK WITH ARROW ====================

interface LinkWithArrowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function LinkWithArrow({ href, children, className = '' }: LinkWithArrowProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-3 text-[var(--rb-primary)] font-semibold hover:gap-4 transition-all group ${className}`}
    >
      <span>{children}</span>
      <span className="w-10 h-10 rounded-full bg-[var(--rb-light)] flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-all">
        <ArrowIcon />
      </span>
    </Link>
  );
}

// ==================== BRAIN VISUALIZATION ====================

export function BrainVisualization({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-accent)] opacity-20 blur-3xl animate-pulse-glow" />

      {/* Main brain container */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[var(--rb-dark-surface)] to-[var(--rb-dark)] border border-white/10 flex items-center justify-center animate-brain-pulse">
        {/* Brain SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-3/4 h-3/4 text-[var(--rb-accent)]"
          fill="currentColor"
        >
          <path
            d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z"
            className="animate-line-draw"
            style={{ strokeDasharray: 1000 }}
          />
        </svg>

        {/* Neural connection dots */}
        <div className="absolute w-3 h-3 rounded-full bg-[var(--rb-accent)] top-1/4 left-1/4 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute w-2 h-2 rounded-full bg-[var(--rb-primary)] top-1/3 right-1/4 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[var(--rb-accent)] bottom-1/3 left-1/3 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Orbiting elements */}
      <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '20s' }}>
        <div className="w-4 h-4 rounded-full bg-[var(--rb-accent)]/50 blur-sm" />
      </div>
      <div className="absolute inset-0 animate-orbit" style={{ animationDuration: '25s', animationDelay: '-5s' }}>
        <div className="w-3 h-3 rounded-full bg-[var(--rb-primary)]/50 blur-sm" />
      </div>
    </div>
  );
}
