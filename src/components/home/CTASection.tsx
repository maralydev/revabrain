'use client';

import Link from 'next/link';
import { FadeIn, PhoneIcon } from '@/components/public/AnimatedComponents';

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
              <PhoneIcon />
              Bel ons direct
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
