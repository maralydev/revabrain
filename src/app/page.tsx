'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getPageContent, type PageContentData } from '@/modules/page-content/queries';
import { getAllBehandelingen, type BehandelingData } from '@/modules/behandeling/queries';

// Fallback disciplines if database is empty
const FALLBACK_DISCIPLINES = [
  {
    id: 'logopedie',
    name: 'Logopedie',
    description: 'Neurologopedie en prelogopedie voor spraak- en taalstoornissen',
  },
  {
    id: 'kinesitherapie',
    name: 'Kinesitherapie',
    description: 'Motorische revalidatie en bewegingstherapie',
  },
  {
    id: 'ergotherapie',
    name: 'Ergotherapie',
    description: 'Dagelijkse activiteiten en zelfstandigheid',
  },
  {
    id: 'neuropsychologie',
    name: 'Neuropsychologie',
    description: 'Cognitieve evaluatie en revalidatie',
  },
];

// SVG icons for disciplines
const DISCIPLINE_ICONS: Record<string, React.ReactNode> = {
  logopedie: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  kinesitherapie: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  ergotherapie: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002" />
    </svg>
  ),
  neuropsychologie: (
    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
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

  // Helper to get content with fallback to i18n
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

  // Use behandelingen from DB or fallback to static disciplines
  const disciplines = behandelingen.length > 0
    ? behandelingen.map((b) => ({
        id: b.slug,
        name: b.title,
        description: b.description,
      }))
    : FALLBACK_DISCIPLINES;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section
        className="min-h-[80vh] flex items-center relative"
        style={{ background: 'linear-gradient(135deg, var(--rb-primary) 0%, #5BA3E8 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-white/80 uppercase tracking-widest text-sm mb-4">
                {getContent('hero', 'subtitle', undefined) || 'Neurologische Revalidatie'}
              </p>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                {getContent('hero', 'title', 'home.hero.title')}
              </h1>
              <p className="text-lg text-white/90 mb-10 leading-relaxed">
                {getContent('hero', 'content', 'home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={getContent('hero', 'buttonUrl', undefined) || '/contact'}
                  className="inline-block px-8 py-4 bg-white text-[var(--rb-primary)] rounded-full font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  {getContent('hero', 'buttonText', 'home.hero.cta')}
                </Link>
                <Link
                  href="/treatments"
                  className="inline-block px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors text-lg"
                >
                  Onze behandelingen
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              {/* Brain illustration with accent color */}
              <div className="relative">
                <div className="w-96 h-96 rounded-full bg-white/10 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-72 h-72 text-[var(--rb-accent)]" fill="currentColor">
                    <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z"/>
                  </svg>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-[var(--rb-accent)]/20" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onze Visie Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[var(--rb-primary)] uppercase tracking-widest text-sm mb-4">
              {getContent('vision', 'subtitle', undefined) || 'Over ons'}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {getContent('vision', 'title', 'home.vision.title')}
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-600 leading-relaxed">
                {getContent('vision', 'content', 'home.vision.text1')}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                {getContent('vision', 'content2', 'home.vision.text2')}
              </p>
            </div>
            <div className="flex justify-center">
              {/* Team/care image */}
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[var(--rb-accent)] shadow-xl">
                <img
                  src={getContent('vision', 'imageUrl', undefined) || '/images/onze-visie.jpg'}
                  alt="Zorgverlening bij RevaBrain"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disciplines/Behandelingen Section */}
      <section className="py-24 lg:py-32 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-[var(--rb-primary)] uppercase tracking-widest text-sm mb-4">
              {getContent('disciplines', 'subtitle', undefined) || 'Wat we doen'}
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              {getContent('disciplines', 'title', undefined) || 'Onze Behandelingen'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getContent('disciplines', 'content', undefined) || 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplines.map((disc) => (
              <Link
                key={disc.id}
                href={`/treatments/${disc.id}`}
                className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 rounded-xl bg-[var(--rb-light)] flex items-center justify-center text-[var(--rb-primary)] mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors">
                  {DISCIPLINE_ICONS[disc.id] || DISCIPLINE_ICONS['logopedie']}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--rb-primary)] transition-colors">
                  {disc.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {disc.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/treatments"
              className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-medium hover:gap-3 transition-all"
            >
              Bekijk alle behandelingen
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Ons Verhaal Section */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 flex justify-center">
              {/* Founder photo */}
              <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-[var(--rb-primary)] shadow-xl">
                <img
                  src={getContent('story', 'imageUrl', undefined) || '/images/profiel-imene.jpeg'}
                  alt="Imene Chetti - Oprichter RevaBrain"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[var(--rb-primary)] uppercase tracking-widest text-sm mb-4">
                {getContent('story', 'title', 'home.story.title')}
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {getContent('story', 'subtitle', undefined) || 'Ontstaan uit passie'}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {getContent('story', 'content', 'home.story.text')}
              </p>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-medium hover:gap-3 transition-all"
              >
                Ontmoet ons team
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-24 lg:py-32"
        style={{ background: 'linear-gradient(135deg, var(--rb-primary) 0%, #5BA3E8 100%)' }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {getContent('cta', 'title', 'home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {getContent('cta', 'content', 'home.cta.subtitle')}
          </p>
          <Link
            href={getContent('cta', 'buttonUrl', undefined) || '/contact'}
            className="inline-block px-10 py-4 bg-white text-[var(--rb-primary)] rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {getContent('cta', 'buttonText', 'home.cta.button')}
          </Link>
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
