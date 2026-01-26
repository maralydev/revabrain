'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getPageContent, type PageContentData } from '@/modules/page-content/queries';
import { getAllBehandelingen, type BehandelingData } from '@/modules/behandeling/queries';
import {
  HeroSection,
  VisionSection,
  TreatmentsSection,
  StorySection,
  CTASection,
} from '@/components/home';

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

  // Prepare hero title
  const heroTitle = getContent('hero', 'title', undefined) || (
    <>
      Herstel begint met{' '}
      <span className="gradient-text-light">deskundige zorg</span>
    </>
  );

  return (
    <>
      <HeroSection
        title={heroTitle}
        subtitle={getContent('hero', 'content', 'home.hero.subtitle')}
        buttonText={getContent('hero', 'buttonText', 'home.hero.cta')}
        buttonUrl={getContent('hero', 'buttonUrl', undefined)}
        t={t}
      />

      <VisionSection
        overline={getContent('vision', 'subtitle', undefined) ?? 'Over ons'}
        title={getContent('vision', 'title', 'home.vision.title') || 'Onze Visie'}
        content={getContent('vision', 'content', 'home.vision.text1')}
        content2={getContent('vision', 'content2', 'home.vision.text2')}
        imageUrl={getContent('vision', 'imageUrl', undefined)}
        t={t}
      />

      <TreatmentsSection
        overline={getContent('disciplines', 'subtitle', undefined) ?? 'Wat we doen'}
        title={getContent('disciplines', 'title', undefined) || 'Onze Behandelingen'}
        description={getContent('disciplines', 'content', undefined) || 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.'}
        disciplines={disciplines}
      />

      <StorySection
        overline={getContent('story', 'title', 'home.story.title') ?? undefined}
        title={getContent('story', 'subtitle', undefined) || 'Ontstaan uit passie voor neurologische zorg'}
        content={getContent('story', 'content', 'home.story.text')}
        imageUrl={getContent('story', 'imageUrl', undefined)}
        t={t}
      />

      <CTASection
        title={getContent('cta', 'title', 'home.cta.title')}
        content={getContent('cta', 'content', 'home.cta.subtitle')}
        buttonText={getContent('cta', 'buttonText', 'home.cta.button')}
        buttonUrl={getContent('cta', 'buttonUrl', undefined)}
        t={t}
      />
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
