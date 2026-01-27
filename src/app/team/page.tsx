import { Metadata } from 'next';
import PublicLayout from '@/components/public/PublicLayout';
import { getPublicTeamleden, PublicTeamlid } from '@/modules/teamlid/queries';
import { getActieveDisciplineConfigs, DisciplineConfigData } from '@/modules/discipline-config/queries';
import { getPageContent, PageContentData } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';
import TeamGrid from './TeamGrid';

export const metadata: Metadata = {
  title: 'Ons Team | RevaBrain',
  description: 'Ontmoet het multidisciplinaire team van RevaBrain. Gespecialiseerde zorgverleners in neurologische revalidatie: logopedie, kinesitherapie, ergotherapie, neuropsychologie en diëtetiek.',
  keywords: ['team', 'neurologische revalidatie', 'logopedist', 'kinesitherapeut', 'ergotherapeut', 'neuropsycholoog', 'diëtist', 'RevaBrain'],
  openGraph: {
    title: 'Ons Team | RevaBrain',
    description: 'Ontmoet het multidisciplinaire team van RevaBrain - gespecialiseerde zorgverleners in neurologische revalidatie.',
    type: 'website',
  },
};

// Discipline display names mapping
const DISCIPLINE_LABELS: Record<string, string> = {
  'LOGOPEDIE': 'Logopedie',
  'KINESITHERAPIE': 'Kinesitherapie',
  'ERGOTHERAPIE': 'Ergotherapie',
  'NEUROPSYCHOLOGIE': 'Neuropsychologie',
  'DIETIEK': 'Diëtetiek',
};

// Role display names
const ROL_LABELS: Record<string, string> = {
  'ZORGVERLENER': 'Zorgverlener',
  'SECRETARIAAT': 'Medisch Secretariaat',
};

export default async function TeamPage() {
  // Server-side data fetching voor SEO
  const [teamleden, disciplines, content, footerData] = await Promise.all([
    getPublicTeamleden(),
    getActieveDisciplineConfigs(),
    getPageContent('team', 'nl'),
    getFooterData(),
  ]);

  // CMS content met defaults
  const heroTitle = content.hero?.title || 'Ons Team';
  const heroSubtitle = content.hero?.subtitle || 'Ontmoet de experts';
  const heroDescription = content.hero?.content || 'Ons multidisciplinair team van gespecialiseerde zorgverleners staat klaar om u te begeleiden op uw weg naar herstel.';

  const ctaTitle = content.cta?.title || 'Interesse om bij ons team te komen?';
  const ctaContent = content.cta?.content || 'We zijn altijd op zoek naar gepassioneerde zorgverleners die ons team willen versterken. Werk in een dynamische omgeving met de nieuwste inzichten in neurologische revalidatie.';
  const ctaButtonText = content.cta?.buttonText || 'Solliciteer nu';
  const ctaButtonUrl = content.cta?.buttonUrl || '/contact';

  // Haal unieke disciplines uit teamleden voor filter tabs
  const activeDisciplines = [...new Set(teamleden.map(m => m.discipline).filter(Boolean))] as string[];

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section - Server rendered voor SEO */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-sm text-white/90 font-medium">{heroSubtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
          </h1>

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Team Grid met Filter - Client Component voor interactiviteit */}
      <TeamGrid
        teamleden={teamleden}
        activeDisciplines={activeDisciplines}
        disciplineLabels={DISCIPLINE_LABELS}
        rolLabels={ROL_LABELS}
      />

      {/* Join Our Team CTA - Server rendered */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-sm text-white/90 font-medium">Word deel van ons team</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {ctaTitle}
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {ctaContent}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={ctaButtonUrl}
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--rb-accent)] text-[var(--rb-dark)] font-semibold rounded-lg hover:bg-[var(--rb-accent-dark)] transition-colors"
            >
              {ctaButtonText}
            </a>
            <a
              href="mailto:jobs@revabrain.be"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Mail ons direct
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
