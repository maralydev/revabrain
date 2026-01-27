import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { getAllBehandelingen, BehandelingData } from '@/modules/behandeling/queries';
import { getPageContent, PageContentData } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';

export const metadata: Metadata = {
  title: 'Behandelingen | RevaBrain',
  description: 'Ontdek onze gespecialiseerde behandelingen: neurologopedie, prelogopedie en meer. Persoonlijke zorg voor neurologische revalidatie en spraak-taalproblemen.',
  keywords: ['neurologopedie', 'prelogopedie', 'logopedie', 'neurologische revalidatie', 'spraaktherapie', 'RevaBrain'],
  openGraph: {
    title: 'Behandelingen | RevaBrain',
    description: 'Gespecialiseerde behandelingen voor neurologische revalidatie en spraak-taalproblemen.',
    type: 'website',
  },
};

// Default icons for treatments if none in DB
const DEFAULT_ICONS: Record<string, ReactNode> = {
  neurologopedie: (
    <svg viewBox="0 0 100 100" className="w-16 h-16" fill="currentColor">
      <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
    </svg>
  ),
  prelogopedie: (
    <svg viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5zm-2 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  ),
};

export default async function TreatmentsPage() {
  // Server-side data fetching voor SEO
  const [behandelingen, content, footerData] = await Promise.all([
    getAllBehandelingen('nl'),
    getPageContent('treatments', 'nl'),
    getFooterData(),
  ]);

  // CMS content met defaults
  const heroTitle = content.hero?.title || 'Onze Behandelingen';
  const heroSubtitle = content.hero?.subtitle || 'Gespecialiseerde zorg';
  const heroDescription = content.hero?.content || 'Ontdek ons aanbod van gespecialiseerde behandelingen voor neurologische revalidatie en spraak-taalproblemen.';
  const heroIntro = content.hero?.content2 || 'Bij RevaBrain bieden we een breed scala aan behandelingen, elk afgestemd op de individuele noden van onze patiënten.';

  const whyTitle = content.why?.title || 'Waarom RevaBrain?';
  const whySubtitle = content.why?.subtitle || 'Gespecialiseerde zorg met aandacht voor elke patiënt';

  const ctaTitle = content.cta?.title || 'Vragen over onze behandelingen?';
  const ctaContent = content.cta?.content || 'Neem vrijblijvend contact op voor meer informatie of om een afspraak te maken.';
  const ctaButtonText = content.cta?.buttonText || 'Neem contact op';
  const ctaButtonUrl = content.cta?.buttonUrl || '/contact';

  // Features via CMS of defaults
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      title: content.feature1?.title || 'Gespecialiseerde expertise',
      description: content.feature1?.content || 'Focus op neurologische revalidatie en kinderlogopedie met jarenlange ervaring.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      ),
      title: content.feature2?.title || 'Persoonlijke aanpak',
      description: content.feature2?.content || 'Elke behandeling wordt afgestemd op de individuele noden en doelen van de patiënt.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
        </svg>
      ),
      title: content.feature3?.title || 'Evidence-based',
      description: content.feature3?.content || 'Behandelingen gebaseerd op de nieuwste wetenschappelijke inzichten.',
    },
  ];

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section - Server rendered voor SEO */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-sm text-white/90 font-medium">{heroSubtitle}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
          </h1>

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-4">
            {heroDescription}
          </p>

          <p className="text-white/70 max-w-3xl mx-auto">
            {heroIntro}
          </p>
        </div>
      </section>

      {/* Treatments Grid - Server rendered met alle behandelingen */}
      <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {behandelingen.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nog geen behandelingen</h3>
              <p className="text-gray-500">Er zijn nog geen behandelingen toegevoegd.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {behandelingen.map((behandeling) => (
                <Link
                  key={behandeling.slug}
                  href={`/treatments/${behandeling.slug}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 group"
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div
                      className="mb-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: behandeling.color || 'var(--rb-accent)' }}
                    >
                      {behandeling.iconSvg ? (
                        <div dangerouslySetInnerHTML={{ __html: behandeling.iconSvg }} />
                      ) : (
                        DEFAULT_ICONS[behandeling.slug] || (
                          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        )
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--rb-primary)] transition-colors">
                      {behandeling.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {behandeling.description}
                    </p>

                    {/* Aandoeningen preview - Server rendered voor SEO */}
                    {behandeling.aandoeningen.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {behandeling.aandoeningen.slice(0, 4).map((aandoening) => (
                          <span
                            key={aandoening.naam}
                            className="px-3 py-1 bg-[var(--rb-light)] text-[var(--rb-primary)] rounded-full text-xs font-medium"
                          >
                            {aandoening.naam}
                          </span>
                        ))}
                        {behandeling.aandoeningen.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            +{behandeling.aandoeningen.length - 4} meer
                          </span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <span className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-semibold group-hover:gap-3 transition-all">
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

      {/* Why RevaBrain Section - Server rendered */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {whyTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {whySubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-[var(--rb-light)] rounded-2xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Server rendered */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {ctaTitle}
          </h2>

          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {ctaContent}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ctaButtonUrl}
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--rb-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {ctaButtonText}
            </Link>
            <Link
              href="/verwijzers"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Info voor verwijzers
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
