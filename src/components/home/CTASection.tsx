'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/public/AnimatedComponents';

interface CTASectionProps {
  title: string | null;
  content: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  t: (key: string) => string;
}

export default function CTASection({ title, content, buttonText, buttonUrl, t }: CTASectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-mesh" />

      {/* Decorative circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full decorative-gradient-2 blur-3xl opacity-20" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full decorative-gradient-1 blur-3xl opacity-20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <FadeIn>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {title || t('home.cta.title')}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {content || t('home.cta.subtitle')}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={buttonUrl || '/contact'}
              className="btn-accent text-lg px-10 py-4"
            >
              {buttonText || t('home.cta.button')}
            </Link>
            <a
              href="tel:+32498686842"
              className="btn-secondary text-lg px-10 py-4 inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel ons direct
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
