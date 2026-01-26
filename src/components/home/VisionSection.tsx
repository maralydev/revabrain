'use client';

import Image from 'next/image';
import { FadeIn, SectionHeading } from '@/components/public/AnimatedComponents';

interface VisionSectionProps {
  overline: string;
  title: string;
  content: string | null;
  content2: string | null;
  imageUrl: string | null;
  t: (key: string) => string;
}

export default function VisionSection({ overline, title, content, content2, imageUrl, t }: VisionSectionProps) {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--rb-light)]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={imageUrl || '/images/onze-visie.jpg'}
                  alt="Zorgverlening bij RevaBrain"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--rb-dark)]/30 to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-[var(--rb-accent)] -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-4 border-[var(--rb-primary)] -z-10" />
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
              <div className="space-y-6 mt-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  {content || t('home.vision.text1')}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {content2 || t('home.vision.text2')}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="mt-10 flex flex-wrap gap-4">
                {['Persoonlijke aanpak', 'Multidisciplinair', 'Evidence-based'].map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-[var(--rb-light)] text-[var(--rb-primary)] text-sm font-medium"
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
  );
}
