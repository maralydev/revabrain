import { Metadata } from 'next'
import Link from 'next/link'
import PublicLayout from '@/components/public/PublicLayout'
import PageHero from '@/components/public/PageHero'
import PageCTA from '@/components/public/PageCTA'
import { getActieveDisciplineConfigs } from '@/modules/discipline-config/queries'
import { getPageContent } from '@/modules/page-content/queries'
import { getFooterData } from '@/modules/footer/queries'

export const metadata: Metadata = {
  title: 'Onze Disciplines | RevaBrain',
  description: 'Ontdek onze gespecialiseerde disciplines: neurologopedie, prelogopedie, kinesitherapie, ergotherapie en neuropsychologie.',
  keywords: ['disciplines', 'neurologopedie', 'prelogopedie', 'kinesitherapie', 'ergotherapie', 'neuropsychologie', 'revalidatie'],
  openGraph: {
    title: 'Onze Disciplines | RevaBrain',
    description: 'Gespecialiseerde disciplines voor neurologische revalidatie.',
    type: 'website',
  },
}

const DISCIPLINE_ICONS: Record<string, React.ReactNode> = {
  NEUROLOGOPEDIE: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  PRELOGOPEDIE: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  KINESITHERAPIE: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  ERGOTHERAPIE: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.648-3.014A2.25 2.25 0 014.25 10.09V5.25a2.25 2.25 0 012.25-2.25h11a2.25 2.25 0 012.25 2.25v4.84a2.25 2.25 0 01-1.522 2.067l-5.648 3.013a2.25 2.25 0 01-2.11 0z" />
    </svg>
  ),
  NEUROPSYCHOLOGIE: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
}

const DEFAULT_ICON = (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)

export default async function DisciplinesPage() {
  const [disciplines, content, footerData] = await Promise.all([
    getActieveDisciplineConfigs(),
    getPageContent('disciplines', 'nl'),
    getFooterData(),
  ])

  const heroTitle = content?.hero?.title || 'Onze Disciplines'
  const heroSubtitle = content?.hero?.content || 'Bij RevaBrain werken verschillende disciplines samen om u de beste zorg te bieden.'

  return (
    <PublicLayout footerData={footerData}>
      <PageHero title={heroTitle} description={heroSubtitle} />

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {disciplines.length === 0 ? (
            <div className="text-center text-slate-500 py-12">Geen disciplines gevonden.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline.id}
                  href={`/disciplines/${discipline.code.toLowerCase()}`}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/5 transition-all duration-300"
                >
                  <div className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-[var(--rb-light)] flex items-center justify-center text-[var(--rb-primary)] mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors duration-300">
                      {DISCIPLINE_ICONS[discipline.code.toUpperCase()] || DEFAULT_ICON}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[var(--rb-primary)] transition-colors">
                      {discipline.naam}
                    </h2>
                    {discipline.beschrijving && (
                      <p className="text-slate-500 mb-4 line-clamp-3 text-sm leading-relaxed">{discipline.beschrijving}</p>
                    )}
                    <span className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-medium text-sm group-hover:gap-3 transition-all">
                      Meer informatie
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PageCTA
        title={content?.cta?.title || 'Niet zeker welke discipline?'}
        description={content?.cta?.content || 'Neem contact met ons op. Wij helpen u graag om de juiste zorg te vinden.'}
      >
        <Link
          href={content?.cta?.buttonUrl || '/contact'}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--rb-dark)] font-semibold rounded-xl hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20 transition-all duration-300"
        >
          {content?.cta?.buttonText || 'Neem contact op'}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </PageCTA>
    </PublicLayout>
  )
}
