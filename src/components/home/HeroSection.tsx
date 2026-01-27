'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FadeIn, Counter } from '@/components/public/AnimatedComponents';

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  t?: (key: string) => string;
}

// Default translations for server-side rendering
const DEFAULT_TEXT = {
  'home.hero.subtitle': 'Welkom bij RevaBrain, een multidisciplinaire groepspraktijk voor neuro- en kinderrevalidatie.',
  'home.hero.cta': 'Maak een afspraak',
};

export default function HeroSection({ title, subtitle, buttonText, buttonUrl, t }: HeroSectionProps) {
  const getText = (key: string) => t ? t(key) : DEFAULT_TEXT[key as keyof typeof DEFAULT_TEXT] || key;
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Hero image with overlay - Mayo Clinic / Cleveland Clinic style */}
      <div className="relative min-h-[60vh] lg:min-h-[70vh]">
        <Image
          src="/images/onze-visie.jpg"
          alt="Neurologische zorg bij RevaBrain"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--rb-dark)]/85 via-[var(--rb-dark)]/60 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6 leading-[1.15] tracking-tight">
                  {title}
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-lg lg:text-xl text-white/85 mb-8 leading-relaxed max-w-xl">
                  {subtitle || getText('home.hero.subtitle')}
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={buttonUrl || '/contact'}
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--rb-primary)] font-semibold rounded hover:bg-gray-100 transition-colors"
                  >
                    {buttonText || getText('home.hero.cta')}
                  </Link>
                  <Link
                    href="/treatments"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded hover:bg-white/10 transition-colors"
                  >
                    Onze behandelingen
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Inspired by Mayo/Cleveland/Hopkins */}
      <div className="bg-[var(--gray-50)] py-12 lg:py-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                ),
                label: 'Ons Team',
                href: '/team'
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                ),
                label: 'Locatie',
                href: '/contact'
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                ),
                label: 'Afspraak maken',
                href: '/contact'
              },
              {
                icon: (
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                ),
                label: 'Bel ons',
                href: 'tel:+32498686842'
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <Link
                  href={item.href}
                  className="group flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-[var(--rb-primary)] hover:shadow-md transition-all"
                >
                  <div className="text-[var(--rb-primary)] mb-3 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-gray-900 font-medium text-center">{item.label}</span>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-[var(--rb-primary)] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: 10, suffix: '+', label: 'Jaar ervaring' },
              { value: 500, suffix: '+', label: 'Patienten geholpen' },
              { value: 5, suffix: '', label: 'Specialisaties' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white/80 text-sm lg:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
