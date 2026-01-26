'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getPageContent, type PageContentData } from '@/modules/page-content/queries';
import { getAllBehandelingen, type BehandelingData } from '@/modules/behandeling/queries';
import {
  FadeIn,
  StaggerChildren,
  Counter,
  SectionHeading,
  BrainVisualization,
  GlowCard,
} from '@/components/public/AnimatedComponents';

// Fallback disciplines if database is empty
const FALLBACK_DISCIPLINES = [
  {
    id: 'neurologopedie',
    name: 'Neurologopedie',
    description: 'Spraak- en taalstoornissen bij volwassenen met hersenletsel',
    icon: 'brain',
  },
  {
    id: 'prelogopedie',
    name: 'Prelogopedie',
    description: 'Vroege interventie voor kinderen met taal- en ontwikkelingsproblemen',
    icon: 'child',
  },
  {
    id: 'kinesitherapie',
    name: 'Kinesitherapie',
    description: 'Motorische revalidatie en bewegingstherapie',
    icon: 'movement',
  },
  {
    id: 'neuropsychologie',
    name: 'Neuropsychologie',
    description: 'Cognitieve evaluatie en revalidatie',
    icon: 'mind',
  },
];

// Icons for disciplines
const DisciplineIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  const icons: Record<string, React.ReactNode> = {
    brain: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    child: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    movement: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    mind: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  };
  return icons[type] || icons.brain;
};

function HomeContent() {
  const { t, locale } = useI18n();
  const [content, setContent] = useState<Record<string, PageContentData>>({});
  const [behandelingen, setBehandelingen] = useState<BehandelingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const [pageContent, behandelingenData] = await Promise.all([
        getPageContent('home', locale),
        getAllBehandelingen(locale),
      ]);
      setContent(pageContent);
      setBehandelingen(behandelingenData);
      setLoading(false);
    }
    loadContent();
  }, [locale]);

  const getContent = (section: string, field: 'title' | 'subtitle' | 'content' | 'content2' | 'buttonText' | 'buttonUrl' | 'imageUrl', fallbackKey?: string) => {
    const sectionData = content[section];
    if (sectionData && sectionData[field]) {
      return sectionData[field];
    }
    if (fallbackKey) {
      return t(fallbackKey);
    }
    return null;
  };

  const disciplines = behandelingen.length > 0
    ? behandelingen.map((b, i) => ({
        id: b.slug,
        name: b.title,
        description: b.description,
        icon: ['brain', 'child', 'movement', 'mind'][i % 4],
      }))
    : FALLBACK_DISCIPLINES;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-mesh">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[var(--rb-accent)] border-t-transparent animate-spin" />
          <p className="text-white/60">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-mesh" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full decorative-gradient-1 blur-3xl opacity-30 animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full decorative-gradient-2 blur-3xl opacity-20 animate-float" style={{ animationDelay: '-3s' }} />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left: Text */}
            <div className="text-center lg:text-left">
              <FadeIn delay={0.1}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8">
                  <span className="w-2 h-2 rounded-full bg-[var(--rb-accent)] animate-pulse" />
                  <span className="text-sm text-white/80 font-medium">Neurologische Revalidatie</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-8 leading-[1.1]">
                  {getContent('hero', 'title', undefined) || (
                    <>
                      Herstel begint met{' '}
                      <span className="gradient-text-light">deskundige zorg</span>
                    </>
                  )}
                </h1>
              </FadeIn>

              <FadeIn delay={0.3}>
                <p className="text-lg lg:text-xl text-white/70 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {getContent('hero', 'content', 'home.hero.subtitle')}
                </p>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href={getContent('hero', 'buttonUrl', undefined) || '/contact'}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    {getContent('hero', 'buttonText', 'home.hero.cta')}
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
                    { value: 500, suffix: '+', label: 'Patiënten' },
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

            {/* Right: Brain Visualization */}
            <FadeIn delay={0.3} direction="left">
              <div className="hidden lg:block relative">
                <BrainVisualization className="w-[500px] h-[500px] mx-auto" />
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== VISION SECTION ==================== */}
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
                    src={getContent('vision', 'imageUrl', undefined) || '/images/onze-visie.jpg'}
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
                overline={getContent('vision', 'subtitle', undefined) || 'Over ons'}
                title={getContent('vision', 'title', 'home.vision.title') || 'Onze Visie'}
                centered={false}
              />

              <FadeIn delay={0.2}>
                <div className="space-y-6 mt-8">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {getContent('vision', 'content', 'home.vision.text1')}
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {getContent('vision', 'content2', 'home.vision.text2')}
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

      {/* ==================== TREATMENTS SECTION ==================== */}
      <section className="section-padding bg-[var(--gray-50)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            overline={getContent('disciplines', 'subtitle', undefined) || 'Wat we doen'}
            title={getContent('disciplines', 'title', undefined) || 'Onze Behandelingen'}
            description={getContent('disciplines', 'content', undefined) || 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.'}
          />

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StaggerChildren staggerDelay={0.1} className="contents">
              {disciplines.map((disc) => (
                <Link key={disc.id} href={`/treatments/${disc.id}`}>
                  <GlowCard className="premium-card h-full group cursor-pointer">
                    <div className="icon-container mb-6">
                      <DisciplineIcon type={disc.icon} className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--rb-primary)] transition-colors">
                      {disc.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {disc.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[var(--rb-primary)] text-sm font-medium group-hover:gap-3 transition-all">
                      Meer info
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </GlowCard>
                </Link>
              ))}
            </StaggerChildren>
          </div>

          <FadeIn delay={0.4}>
            <div className="text-center mt-12">
              <Link
                href="/treatments"
                className="inline-flex items-center gap-3 text-[var(--rb-primary)] font-semibold hover:gap-4 transition-all group"
              >
                <span>Bekijk alle behandelingen</span>
                <span className="w-10 h-10 rounded-full bg-[var(--rb-light)] flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==================== STORY SECTION ==================== */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <SectionHeading
                overline={getContent('story', 'title', 'home.story.title')}
                title={getContent('story', 'subtitle', undefined) || 'Ontstaan uit passie voor neurologische zorg'}
                centered={false}
              />

              <FadeIn delay={0.2}>
                <p className="text-lg text-gray-600 leading-relaxed mt-8 mb-8">
                  {getContent('story', 'content', 'home.story.text')}
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <Link
                  href="/team"
                  className="inline-flex items-center gap-3 text-[var(--rb-primary)] font-semibold hover:gap-4 transition-all group"
                >
                  <span>Ontmoet ons team</span>
                  <span className="w-10 h-10 rounded-full bg-[var(--rb-light)] flex items-center justify-center group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </FadeIn>
            </div>

            {/* Image */}
            <FadeIn direction="left" className="order-1 lg:order-2">
              <div className="relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={getContent('story', 'imageUrl', undefined) || '/images/profiel-imene.jpeg'}
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

      {/* ==================== CTA SECTION ==================== */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-mesh" />

        {/* Decorative circles */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full decorative-gradient-2 blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full decorative-gradient-1 blur-3xl opacity-20" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <FadeIn>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {getContent('cta', 'title', 'home.cta.title')}
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              {getContent('cta', 'content', 'home.cta.subtitle')}
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={getContent('cta', 'buttonUrl', undefined) || '/contact'}
                className="btn-accent text-lg px-10 py-4"
              >
                {getContent('cta', 'buttonText', 'home.cta.button')}
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
    </>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <HomeContent />
    </PublicLayout>
  );
}
