'use client'

import Image from 'next/image'
import { FadeIn, SectionHeading } from '@/components/public/AnimatedComponents'

interface VisionSectionProps {
  overline: string
  title: string
  content: string | null
  content2: string | null
  imageUrl: string | null
  t?: (key: string) => string
}

const DEFAULT_TEXT = {
  'home.vision.text1': 'RevaBrain is een jonge praktijk in volle ontwikkeling tot een gespecialiseerde groepspraktijk waar u gericht volgens de wetenschappelijke evidentie wordt verder geholpen.',
  'home.vision.text2': 'Wij streven ernaar op één locatie gerichte zorg te bieden, dit zowel voor personen met neurogene aandoeningen als kinderen met taal/ leer en ontwikkelingsproblemen.',
}

export default function VisionSection({ overline, title, content, content2, imageUrl, t }: VisionSectionProps) {
  const getText = (key: string) => t ? t(key) : DEFAULT_TEXT[key as keyof typeof DEFAULT_TEXT] || key

  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--rb-light)]/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={imageUrl || '/images/onze-visie.jpg'}
                  alt="Zorgverlening bij RevaBrain"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Accent bar */}
              <div className="absolute -bottom-3 left-8 right-8 h-1.5 rounded-full bg-gradient-to-r from-[var(--rb-primary)] to-[var(--rb-accent)]" />
            </div>
          </FadeIn>

          {/* Content */}
          <div>
            <SectionHeading
              overline={overline}
              title={title}
              centered={false}
            />

            <FadeIn delay={0.2}>
              <div className="space-y-5 mt-8">
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                  {content || getText('home.vision.text1')}
                </p>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed">
                  {content2 || getText('home.vision.text2')}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Persoonlijke aanpak', 'Multidisciplinair', 'Evidence-based'].map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-xl bg-[var(--rb-light)] text-[var(--rb-primary)] text-sm font-medium border border-[var(--rb-primary)]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
