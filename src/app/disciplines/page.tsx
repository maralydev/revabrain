import { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { getActieveDisciplineConfigs } from '@/modules/discipline-config/queries';
import { getPageContent } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';

export const metadata: Metadata = {
  title: 'Onze Disciplines | RevaBrain',
  description: 'Ontdek onze gespecialiseerde disciplines: neurologopedie, prelogopedie, kinesitherapie, ergotherapie en neuropsychologie. Multidisciplinaire zorg voor neurologische revalidatie.',
  keywords: ['disciplines', 'neurologopedie', 'prelogopedie', 'kinesitherapie', 'ergotherapie', 'neuropsychologie', 'revalidatie'],
  openGraph: {
    title: 'Onze Disciplines | RevaBrain',
    description: 'Gespecialiseerde disciplines voor neurologische revalidatie.',
    type: 'website',
  },
};

// Icons per discipline code
const DISCIPLINE_ICONS: Record<string, React.ReactNode> = {
  NEUROLOGOPEDIE: (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
  PRELOGOPEDIE: (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5z" />
    </svg>
  ),
  KINESITHERAPIE: (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
  ),
  ERGOTHERAPIE: (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 11c0-.55-.45-1-1-1s-1 .45-1 1v2h2v-2zm2-4V5h-6v2h4v2h-2c-1.1 0-2 .9-2 2v4h2v-2h2v2h2v-6c0-1.1-.9-2-2-2zM8 9H4c-1.1 0-2 .9-2 2v10h2v-4h4v4h2V11c0-1.1-.9-2-2-2zm-2 6H4v-4h4v4h-2z" />
    </svg>
  ),
  NEUROPSYCHOLOGIE: (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
    </svg>
  ),
};

// Default icon for unknown disciplines
const DEFAULT_ICON = (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default async function DisciplinesPage() {
  // Server-side data fetching voor SEO
  const [disciplines, content, footerData] = await Promise.all([
    getActieveDisciplineConfigs(),
    getPageContent('disciplines', 'nl'),
    getFooterData(),
  ]);

  // CMS content met defaults
  const heroTitle = content?.hero?.title || 'Onze Disciplines';
  const heroSubtitle = content?.hero?.content || 'Bij RevaBrain werken verschillende disciplines samen om u de beste zorg te bieden. Ontdek onze gespecialiseerde vakgebieden.';

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {heroTitle}
          </h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {disciplines.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              Geen disciplines gevonden.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {disciplines.map((discipline) => (
                <Link
                  key={discipline.id}
                  href={`/disciplines/${discipline.code.toLowerCase()}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-8">
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: 'var(--rb-primary)', color: 'white' }}
                    >
                      {DISCIPLINE_ICONS[discipline.code.toUpperCase()] || DEFAULT_ICON}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[var(--rb-primary)] transition-colors">
                      {discipline.naam}
                    </h2>

                    {discipline.beschrijving && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {discipline.beschrijving}
                      </p>
                    )}

                    <span className="inline-flex items-center text-[var(--rb-primary)] font-medium group-hover:translate-x-2 transition-transform">
                      Meer informatie
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {content?.cta?.title || 'Niet zeker welke discipline?'}
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            {content?.cta?.content || 'Neem contact met ons op. Wij helpen u graag om de juiste zorg te vinden voor uw situatie.'}
          </p>
          <Link
            href={content?.cta?.buttonUrl || '/contact'}
            className="inline-flex items-center justify-center px-8 py-4 bg-[var(--rb-primary)] text-white font-semibold rounded-lg hover:bg-[var(--rb-primary-dark)] transition-colors"
          >
            {content?.cta?.buttonText || 'Neem contact op'}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
