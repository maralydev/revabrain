'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FadeIn, Counter } from '@/components/public/AnimatedComponents';

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

      {/* Subtle decorative elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-[var(--rb-primary)]/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Text */}
          <div className="text-center lg:text-left">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--rb-accent)]" />
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

          {/* Right: Professional Image */}
          <FadeIn delay={0.3} direction="left">
            <div className="hidden lg:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/onze-visie.jpg"
                  alt="Neurologische zorg bij RevaBrain"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--rb-dark)]/40 to-transparent" />
              </div>
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl bg-[var(--rb-accent)]/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-xl border-2 border-[var(--rb-primary)]/30 -z-10" />
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
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
