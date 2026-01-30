'use client'

import Image from 'next/image'
import { FadeIn, SectionHeading, LinkWithArrow } from '@/components/public/AnimatedComponents'

interface StorySectionProps {
  overline: string | undefined
  title: string
  content: string | null
  imageUrl: string | null
  t?: (key: string) => string
}

const DEFAULT_TEXT = {
  'home.story.text': 'Nadat ik 5 mooie jaren ervaring mocht opdoen in een groepspraktijk en diverse ziekenhuizen en revalidatiecentra, besloot ik mijn eigen praktijk op te starten. Verschillende disciplines onder een dak, waarbij zorg voor u gecentraliseerd kan worden is het ultieme doel.',
}

export default function StorySection({ overline, title, content, imageUrl, t }: StorySectionProps) {
  const getText = (key: string) => t ? t(key) : DEFAULT_TEXT[key as keyof typeof DEFAULT_TEXT] || key

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--rb-light)]/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <SectionHeading
              overline={overline}
              title={title}
              centered={false}
            />

            <FadeIn delay={0.2}>
              <p className="text-base lg:text-lg text-slate-600 leading-relaxed mt-8 mb-8">
                {content || getText('home.story.text')}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <LinkWithArrow href="/team">Ontmoet ons team</LinkWithArrow>
            </FadeIn>
          </div>

          {/* Image */}
          <FadeIn direction="left" className="order-1 lg:order-2">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={imageUrl || '/images/profiel-imene.jpeg'}
                  alt="Imene Chetti - Oprichter RevaBrain"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Name badge */}
              <div className="absolute -bottom-5 left-6 right-6 z-20 bg-white/90 backdrop-blur-sm border border-slate-100 px-6 py-4 rounded-xl shadow-lg">
                <p className="font-bold text-slate-900">Imene Chetti</p>
                <p className="text-sm text-[var(--rb-primary)] font-medium">Oprichter & Logopedist</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
