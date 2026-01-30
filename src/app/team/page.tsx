import { Metadata } from 'next'
import PublicLayout from '@/components/public/PublicLayout'
import PageHero from '@/components/public/PageHero'
import PageCTA from '@/components/public/PageCTA'
import { getPublicTeamleden } from '@/modules/teamlid/queries'
import { getPageContent } from '@/modules/page-content/queries'
import { getFooterData } from '@/modules/footer/queries'
import TeamGrid from './TeamGrid'

export const metadata: Metadata = {
  title: 'Ons Team | RevaBrain',
  description: 'Ontmoet het multidisciplinaire team van RevaBrain. Gespecialiseerde zorgverleners in neurologische revalidatie.',
  keywords: ['team', 'neurologische revalidatie', 'logopedist', 'kinesitherapeut', 'ergotherapeut', 'neuropsycholoog', 'diëtist', 'RevaBrain'],
  openGraph: {
    title: 'Ons Team | RevaBrain',
    description: 'Ontmoet het multidisciplinaire team van RevaBrain.',
    type: 'website',
  },
}

const DISCIPLINE_LABELS: Record<string, string> = {
  'LOGOPEDIE': 'Logopedie',
  'KINESITHERAPIE': 'Kinesitherapie',
  'ERGOTHERAPIE': 'Ergotherapie',
  'NEUROPSYCHOLOGIE': 'Neuropsychologie',
  'DIETIEK': 'Diëtetiek',
}

const ROL_LABELS: Record<string, string> = {
  'ZORGVERLENER': 'Zorgverlener',
  'SECRETARIAAT': 'Medisch Secretariaat',
}

export default async function TeamPage() {
  const [teamleden, content, footerData] = await Promise.all([
    getPublicTeamleden(),
    getPageContent('team', 'nl'),
    getFooterData(),
  ])

  const heroTitle = content.hero?.title || 'Ons Team'
  const heroSubtitle = content.hero?.subtitle || 'Ontmoet de experts'
  const heroDescription = content.hero?.content || 'Ons multidisciplinair team van gespecialiseerde zorgverleners staat klaar om u te begeleiden op uw weg naar herstel.'

  const ctaTitle = content.cta?.title || 'Interesse om bij ons team te komen?'
  const ctaContent = content.cta?.content || 'We zijn altijd op zoek naar gepassioneerde zorgverleners die ons team willen versterken.'
  const ctaButtonText = content.cta?.buttonText || 'Solliciteer nu'
  const ctaButtonUrl = content.cta?.buttonUrl || '/contact'

  const activeDisciplines = [...new Set(teamleden.map(m => m.discipline).filter(Boolean))] as string[]

  return (
    <PublicLayout footerData={footerData}>
      <PageHero title={heroTitle} badge={heroSubtitle} description={heroDescription} />

      <TeamGrid
        teamleden={teamleden}
        activeDisciplines={activeDisciplines}
        disciplineLabels={DISCIPLINE_LABELS}
        rolLabels={ROL_LABELS}
      />

      <PageCTA title={ctaTitle} description={ctaContent}>
        <a
          href={ctaButtonUrl}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--rb-dark)] font-semibold rounded-xl hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20 transition-all duration-300"
        >
          {ctaButtonText}
        </a>
        <a
          href="mailto:jobs@revabrain.be"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
        >
          Mail ons direct
        </a>
      </PageCTA>
    </PublicLayout>
  )
}
