'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/public/AnimatedComponents'

interface CTASectionProps {
  title: string | null
  content: string | null
  buttonText: string | null
  buttonUrl: string | null
  t?: (key: string) => string
}

const DEFAULT_TEXT = {
  'home.cta.title': 'Klaar om te Beginnen?',
  'home.cta.subtitle': 'Neem contact op voor een vrijblijvend gesprek over uw situatie.',
  'home.cta.button': 'Neem Contact Op',
}

export default function CTASection({ title, content, buttonText, buttonUrl, t }: CTASectionProps) {
  const getText = (key: string) => t ? t(key) : DEFAULT_TEXT[key as keyof typeof DEFAULT_TEXT] || key

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--rb-dark)] via-[var(--rb-primary)] to-[var(--rb-dark)]" />
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(89,236,183,0.1),transparent_70%)]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <FadeIn>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {title || getText('home.cta.title')}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="text-lg text-white/75 mb-12 max-w-2xl mx-auto leading-relaxed">
            {content || getText('home.cta.subtitle')}
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={buttonUrl || '/contact'}
              className="
                inline-flex items-center justify-center gap-2 px-8 py-4
                bg-white text-[var(--rb-dark)] font-semibold rounded-xl
                hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20
                transition-all duration-300
              "
            >
              {buttonText || getText('home.cta.button')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a
              href="tel:+32498686842"
              className="
                inline-flex items-center justify-center gap-2 px-8 py-4
                border-2 border-white/30 text-white font-semibold rounded-xl
                hover:bg-white/10 hover:border-white/50
                transition-all duration-300
              "
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Bel ons direct
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
