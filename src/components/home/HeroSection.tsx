'use client';

import Link from 'next/link';
import {
  FadeIn,
  Counter,
  BrainVisualization,
} from '@/components/public/AnimatedComponents';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  t: (key: string) => string;
}

export default function HeroSection({ title, subtitle, buttonText, buttonUrl, t }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 rounded-full decorative-gradient-1 blur-3xl opacity-30 animate-float-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full decorative-gradient-2 blur-3xl opacity-20 animate-float" style={{ animationDelay: '-3s' }} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--rb-accent)] animate-pulse" />
                <span className="text-sm text-white/80 font-medium">Neurologische Revalidatie</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1]">
                {title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {subtitle || t('home.hero.subtitle')}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href={buttonUrl || '/contact'}
                  className="btn-primary text-lg px-8 py-4"
                >
                  {buttonText || t('home.hero.cta')}
                </Link>
                <Link
                  href="/treatments"
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Onze behandelingen
                </Link>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.6}>
              <div className="mt-16 grid grid-cols-3 gap-8">
                {[
                  { value: 10, suffix: '+', label: 'Jaar ervaring' },
                  { value: 500, suffix: '+', label: 'Patienten' },
                  { value: 5, suffix: '', label: 'Disciplines' },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <div className="stat-number mb-1">
                      <Counter end={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-white/50 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right: Brain Visualization */}
          <FadeIn delay={0.3} direction="left">
            <div className="hidden lg:block relative">
              <BrainVisualization className="w-[500px] h-[500px] mx-auto" />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
