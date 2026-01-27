import { Metadata } from 'next';
import PublicLayout from '@/components/public/PublicLayout';
import { getPageContent } from '@/modules/page-content/queries';
import { getAllBehandelingen } from '@/modules/behandeling/queries';
import { getFooterData } from '@/modules/footer/queries';
import {
  HeroSection,
  VisionSection,
  TreatmentsSection,
  StorySection,
  CTASection,
} from '@/components/home';

export const metadata: Metadata = {
  title: 'RevaBrain | Centrum voor Neurologische Revalidatie',
  description: 'RevaBrain is een multidisciplinaire groepspraktijk voor neurologische revalidatie en kinderrevalidatie. Gespecialiseerd in neurologopedie, prelogopedie, kinesitherapie en neuropsychologie.',
  keywords: ['neurologische revalidatie', 'logopedie', 'neurologopedie', 'prelogopedie', 'kinesitherapie', 'neuropsychologie', 'hersenletsel', 'Tubeke', 'België'],
  openGraph: {
    title: 'RevaBrain | Centrum voor Neurologische Revalidatie',
    description: 'Multidisciplinaire groepspraktijk voor neurologische revalidatie en kinderrevalidatie.',
    type: 'website',
  },
};

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

export default async function HomePage() {
  // Server-side data fetching voor SEO
  const [content, behandelingen, footerData] = await Promise.all([
    getPageContent('home', 'nl'),
    getAllBehandelingen('nl'),
    getFooterData(),
  ]);

  // Helper to get content with defaults
  const getContent = (
    section: string,
    field: 'title' | 'subtitle' | 'content' | 'content2' | 'buttonText' | 'buttonUrl' | 'imageUrl'
  ): string | null => {
    const sectionData = content[section];
    if (sectionData && sectionData[field]) {
      return sectionData[field] as string;
    }
    return null;
  };

  // Build disciplines from behandelingen or use fallback
  const disciplines = behandelingen.length > 0
    ? behandelingen.map((b, i) => ({
        id: b.slug,
        name: b.title,
        description: b.description,
        icon: ['brain', 'child', 'movement', 'mind'][i % 4],
      }))
    : FALLBACK_DISCIPLINES;

  // Prepare content for sections - all editable via CMS
  const heroTitle = getContent('hero', 'title') || 'Herstel begint met deskundige zorg';
  const heroSubtitle = getContent('hero', 'content');
  const heroButtonText = getContent('hero', 'buttonText');
  const heroButtonUrl = getContent('hero', 'buttonUrl');

  const visionOverline = getContent('vision', 'subtitle') ?? 'Over ons';
  const visionTitle = getContent('vision', 'title') || 'Onze Visie';
  const visionContent = getContent('vision', 'content');
  const visionContent2 = getContent('vision', 'content2');
  const visionImageUrl = getContent('vision', 'imageUrl');

  const disciplinesOverline = getContent('disciplines', 'subtitle') ?? 'Wat we doen';
  const disciplinesTitle = getContent('disciplines', 'title') || 'Onze Behandelingen';
  const disciplinesDescription = getContent('disciplines', 'content') || 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.';

  const storyOverline = getContent('story', 'title') ?? undefined;
  const storyTitle = getContent('story', 'subtitle') || 'Ontstaan uit passie voor neurologische zorg';
  const storyContent = getContent('story', 'content');
  const storyImageUrl = getContent('story', 'imageUrl');

  const ctaTitle = getContent('cta', 'title');
  const ctaContent = getContent('cta', 'content');
  const ctaButtonText = getContent('cta', 'buttonText');
  const ctaButtonUrl = getContent('cta', 'buttonUrl');

  return (
    <PublicLayout footerData={footerData}>
      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        buttonText={heroButtonText}
        buttonUrl={heroButtonUrl}
      />

      <VisionSection
        overline={visionOverline}
        title={visionTitle}
        content={visionContent}
        content2={visionContent2}
        imageUrl={visionImageUrl}
      />

      <TreatmentsSection
        overline={disciplinesOverline}
        title={disciplinesTitle}
        description={disciplinesDescription}
        disciplines={disciplines}
      />

      <StorySection
        overline={storyOverline}
        title={storyTitle}
        content={storyContent}
        imageUrl={storyImageUrl}
      />

      <CTASection
        title={ctaTitle}
        content={ctaContent}
        buttonText={ctaButtonText}
        buttonUrl={ctaButtonUrl}
      />
    </PublicLayout>
  );
}
