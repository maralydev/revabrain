import Link from 'next/link';
import { Metadata } from 'next';
import PublicLayout from '@/components/public/PublicLayout';
import { getPageContent } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';
import { prisma } from '@/shared/lib/prisma';
import VerwijzersFAQ from './VerwijzersFAQ';

export const metadata: Metadata = {
  title: 'Voor Verwijzers | RevaBrain',
  description: 'Informatie voor artsen en zorgprofessionals over doorverwijzing naar RevaBrain voor neurologische revalidatie en kinderlogopedie.',
};

// Haal behandelingen met aandoeningen op voor de specialisaties sectie
async function getBehandelingenMetAandoeningen() {
  return prisma.behandeling.findMany({
    where: { actief: true, locale: 'nl' },
    include: {
      aandoeningen: { orderBy: { volgorde: 'asc' } },
    },
    orderBy: { volgorde: 'asc' },
  });
}

export default async function VerwijzersPage() {
  // Server-side data ophalen (goed voor SEO)
  const [content, behandelingen, footerData] = await Promise.all([
    getPageContent('verwijzers', 'nl'),
    getBehandelingenMetAandoeningen(),
    getFooterData(),
  ]);

  // Default values met CMS override
  const heroTitle = content.hero?.title || 'Informatie voor verwijzers';
  const heroSubtitle = content.hero?.content || 'RevaBrain is gespecialiseerd in neurologische revalidatie en kinderlogopedie. Wij bieden snelle intake en evidence-based behandeling voor uw patiënten.';
  const heroLabel = content.hero?.subtitle || 'Voor zorgprofessionals';

  const specTitle = content.specialisaties?.title || 'Onze specialisaties';
  const specSubtitle = content.specialisaties?.content || 'Overzicht van indicaties waarvoor u patiënten kunt doorverwijzen naar RevaBrain.';

  const howTitle = content.doorverwijzen?.title || 'Hoe doorverwijzen?';
  const howContent = content.doorverwijzen?.content || 'Doorverwijzen naar RevaBrain kan eenvoudig via verschillende kanalen. Wij zorgen voor een vlotte opvolging en houden u op de hoogte van het verloop.';

  const step1Title = content.stap1?.title || 'Stuur een verwijzing';
  const step1Content = content.stap1?.content || 'Per e-mail, telefoon of via ons verwijsformulier. Gelieve relevante medische informatie mee te sturen.';

  const step2Title = content.stap2?.title || 'Intake en evaluatie';
  const step2Content = content.stap2?.content || 'Wij contacteren de patiënt voor een intake binnen 2 weken. Een uitgebreide evaluatie volgt indien nodig.';

  const step3Title = content.stap3?.title || 'Behandeling en terugkoppeling';
  const step3Content = content.stap3?.content || 'Na de behandelperiode ontvangt u een schriftelijk verslag met bevindingen en aanbevelingen.';

  const ctaTitle = content.cta?.title || 'Vragen over doorverwijzing?';
  const ctaContent = content.cta?.content || 'Neem gerust contact met ons op voor overleg over specifieke patiënten of vragen over onze behandelmogelijkheden.';

  // Quick info cards (aanpasbaar via CMS)
  const card1Title = content.card1?.title || 'Snelle intake';
  const card1Content = content.card1?.content || 'Intake binnen 2 weken na verwijzing';

  const card2Title = content.card2?.title || 'Terugkoppeling';
  const card2Content = content.card2?.content || 'Schriftelijk verslag na evaluatie en behandeling';

  const card3Title = content.card3?.title || 'Gespecialiseerd';
  const card3Content = content.card3?.content || 'Focus op neurologische revalidatie en kinderlogopedie';

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <span className="text-sm text-white/90 font-medium">{heroLabel}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {heroTitle}
            </h1>

            <p className="text-lg lg:text-xl text-white/80 mb-8">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="tel:+32498686842"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[var(--rb-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Direct contact
              </a>
              <a
                href="mailto:verwijzers@revabrain.be"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                E-mail verwijzing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Cards */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-[var(--gray-50)] rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{card1Title}</h3>
                <p className="text-sm text-gray-600">{card1Content}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[var(--gray-50)] rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{card2Title}</h3>
                <p className="text-sm text-gray-600">{card2Content}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-[var(--gray-50)] rounded-xl">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{card3Title}</h3>
                <p className="text-sm text-gray-600">{card3Content}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialisaties Section - Data uit database */}
      <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {specTitle}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {specSubtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {behandelingen.map((behandeling) => (
              <div key={behandeling.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {behandeling.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {behandeling.description}
                  </p>
                </div>

                {behandeling.aandoeningen.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Indicaties voor doorverwijzing
                    </h4>
                    <ul className="space-y-2">
                      {behandeling.aandoeningen.map((aandoening) => (
                        <li key={aandoening.id} className="flex items-start gap-2 text-gray-700">
                          <svg className="w-5 h-5 text-[var(--rb-accent)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <span>{aandoening.naam}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href={`/treatments/${behandeling.slug}`}
                  className="inline-flex items-center gap-2 text-[var(--rb-primary)] font-semibold hover:underline"
                >
                  Meer informatie
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Refer Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                {howTitle}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {howContent}
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--rb-primary)] rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step1Title}</h3>
                    <p className="text-gray-600">{step1Content}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--rb-primary)] rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step2Title}</h3>
                    <p className="text-gray-600">{step2Content}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[var(--rb-primary)] rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{step3Title}</h3>
                    <p className="text-gray-600">{step3Content}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[var(--gray-50)] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Contact voor verwijzers
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefoon</p>
                    <a href="tel:+32498686842" className="font-semibold text-gray-900 hover:text-[var(--rb-primary)]">
                      +32 498 68 68 42
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-mail verwijzingen</p>
                    <a href="mailto:verwijzers@revabrain.be" className="font-semibold text-gray-900 hover:text-[var(--rb-primary)]">
                      verwijzers@revabrain.be
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--rb-primary)]/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Adres</p>
                    <p className="font-semibold text-gray-900">
                      Rue Des Freres Lefort 171, bus 003<br />
                      1840 Tubeke
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">
                  RIZIV-nummer: 5-69050-10-001
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-[var(--rb-primary)] text-white font-semibold rounded-lg hover:bg-[var(--rb-primary-dark)] transition-colors"
                >
                  Contactformulier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Client Component voor interactiviteit */}
      <VerwijzersFAQ content={content} />

      {/* CTA Section */}
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
            <a
              href="tel:+32498686842"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--rb-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              +32 498 68 68 42
            </a>
            <a
              href="mailto:verwijzers@revabrain.be"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              verwijzers@revabrain.be
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
