'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FadeIn, Counter } from '@/components/public/AnimatedComponents'

interface HeroSectionProps {
  title: React.ReactNode
  subtitle: string | null
  buttonText: string | null
  buttonUrl: string | null
}

export default function HeroSection({ title, subtitle, buttonText, buttonUrl }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Full-screen hero */}
      <div className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center">
        <Image
          src="/images/onze-visie.jpg"
          alt="Neurologische zorg bij RevaBrain"
          fill
          className="object-cover"
          priority
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--rb-dark)]/90 via-[var(--rb-dark)]/70 to-[var(--rb-primary)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--rb-dark)]/60 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--rb-accent)] animate-pulse" />
                <span className="text-sm font-medium text-white/90">Centrum voor Neurologische Revalidatie</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                {title}
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-lg lg:text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
                {subtitle || 'Multidisciplinaire groepspraktijk voor neuro- en kinderrevalidatie. Deskundige zorg, persoonlijke aanpak.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={buttonUrl || '/contact'}
                  className="
                    inline-flex items-center justify-center gap-2 px-8 py-4
                    bg-white text-[var(--rb-dark)] font-semibold rounded-xl
                    hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20
                    transition-all duration-300
                  "
                >
                  {buttonText || 'Maak een afspraak'}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/treatments"
                  className="
                    inline-flex items-center justify-center gap-2 px-8 py-4
                    border-2 border-white/30 text-white font-semibold rounded-xl
                    hover:bg-white/10 hover:border-white/50
                    transition-all duration-300
                  "
                >
                  Onze behandelingen
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--rb-primary)] via-[var(--rb-accent)] to-[var(--rb-primary)]" />
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 10, suffix: '+', label: 'Jaar ervaring', sublabel: 'in neurologische zorg' },
              { value: 500, suffix: '+', label: 'Patienten', sublabel: 'succesvol geholpen' },
              { value: 5, suffix: '', label: 'Disciplines', sublabel: 'onder een dak' },
              { value: 98, suffix: '%', label: 'Tevredenheid', sublabel: 'van onze patienten' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={0.1 * i}>
                <div className="text-center lg:text-left">
                  <div className="text-3xl lg:text-4xl font-bold text-[var(--rb-primary)] mb-1">
                    <Counter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">{stat.label}</p>
                  <p className="text-xs text-slate-500">{stat.sublabel}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
