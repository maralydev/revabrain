'use client';

import Image from 'next/image';
import { FadeIn, SectionHeading, LinkWithArrow } from '@/components/public/AnimatedComponents';

interface StorySectionProps {
  overline: string | undefined;
  title: string;
  content: string | null;
  imageUrl: string | null;
  t: (key: string) => string;
}

export default function StorySection({ overline, title, content, imageUrl, t }: StorySectionProps) {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <SectionHeading
              overline={overline}
              title={title}
              centered={false}
            />

            <FadeIn delay={0.2}>
              <p className="text-lg text-gray-600 leading-relaxed mt-8 mb-8">
                {content || t('home.story.text')}
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <LinkWithArrow href="/team">Ontmoet ons team</LinkWithArrow>
            </FadeIn>
          </div>

          {/* Image */}
          <FadeIn direction="left" className="order-1 lg:order-2">
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl || '/images/profiel-imene.jpeg'}
                  alt="Imene Chetti - Oprichter RevaBrain"
                  width={500}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Name badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 glass-card px-6 py-3 rounded-2xl">
                <p className="font-semibold text-gray-900">Imene Chetti</p>
                <p className="text-sm text-[var(--rb-primary)]">Oprichter & Logopedist</p>
              </div>
              {/* Decorative */}
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl bg-[var(--rb-primary)] -z-10" />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
