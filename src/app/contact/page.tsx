import { Metadata } from 'next';
import PublicLayout from '@/components/public/PublicLayout';
import { getContactInfo, type ContactInfoData } from '@/modules/contact-config/actions';
import { getPageContent } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';

export const metadata: Metadata = {
  title: 'Contact | RevaBrain',
  description: 'Neem contact op met RevaBrain voor vragen over neurologische revalidatie en logopedie. Telefoon, email en adres in Tubeke.',
  keywords: ['contact', 'RevaBrain', 'Tubeke', 'logopedie', 'afspraak maken', 'neurologische revalidatie'],
  openGraph: {
    title: 'Contact | RevaBrain',
    description: 'Neem contact op met RevaBrain voor vragen over neurologische revalidatie en logopedie.',
    type: 'website',
  },
};

const DAG_LABELS: Record<string, string> = {
  ma: 'Maandag',
  di: 'Dinsdag',
  wo: 'Woensdag',
  do: 'Donderdag',
  vr: 'Vrijdag',
  za: 'Zaterdag',
  zo: 'Zondag',
};

const DEFAULT_OPENINGSTIJDEN: Record<string, string> = {
  ma: '09:00-18:00',
  di: '09:00-18:00',
  wo: '09:00-18:00',
  do: '09:00-18:00',
  vr: '09:00-18:00',
  za: 'Gesloten',
  zo: 'Gesloten',
};

export default async function ContactPage() {
  // Server-side data fetching voor SEO
  const [contactInfo, content, footerData] = await Promise.all([
    getContactInfo(),
    getPageContent('contact', 'nl'),
    getFooterData(),
  ]);

  // Parse openingstijden
  let openingstijden = DEFAULT_OPENINGSTIJDEN;
  if (contactInfo?.openingstijden) {
    try {
      openingstijden = JSON.parse(contactInfo.openingstijden);
    } catch (e) {
      // Keep defaults
    }
  }

  // Contact info met fallbacks
  const telefoon = contactInfo?.telefoon || '+32 498 68 68 42';
  const email = contactInfo?.email || 'info@revabrain.be';
  const straat = contactInfo?.adresStraat || 'Rue Des Frères Lefort';
  const nummer = contactInfo?.adresNummer || '171, bus 003';
  const postcode = contactInfo?.adresPostcode || '1840';
  const gemeente = contactInfo?.adresGemeente || 'Tubeke';
  const latitude = contactInfo?.latitude || 50.6912;
  const longitude = contactInfo?.longitude || 4.2078;

  // CMS content met defaults
  const heroTitle = content.hero?.title || 'Contactgegevens';
  const heroSubtitle = content.hero?.subtitle || 'Neem contact op';
  const heroDescription = content.hero?.content || 'Neem contact met ons op voor vragen of om een afspraak te maken';

  const homeVisitsTitle = content.homevisits?.title || 'Huisbezoeken';
  const homeVisitsContent = content.homevisits?.content || 'Momenteel zijn enkel huisbezoeken mogelijk in Tubeke, Halle, Sint-Pieters-Leeuw, Beersel, en omliggende gemeenten. Wij streven ernaar u ook zo snel mogelijk in de praktijk te verwelkomen.';

  const ctaTitle = content.cta?.title || 'Klaar om te beginnen?';
  const ctaContent = content.cta?.content || 'Neem vandaag nog contact op en ontdek hoe we u kunnen helpen met uw revalidatietraject.';

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
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

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Phone Card */}
            <a
              href={`tel:${telefoon}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 text-center group"
            >
              <div className="w-16 h-16 bg-[var(--rb-light)] rounded-2xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefoon</h3>
              <p className="text-[var(--rb-primary)] font-medium text-lg group-hover:underline">
                {telefoon}
              </p>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${email}`}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 text-center group"
            >
              <div className="w-16 h-16 bg-[var(--rb-light)] rounded-2xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-[var(--rb-primary)] font-medium text-lg group-hover:underline">
                {email}
              </p>
            </a>

            {/* Address Card */}
            <a
              href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 text-center group"
            >
              <div className="w-16 h-16 bg-[var(--rb-light)] rounded-2xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adres</h3>
              <address className="not-italic text-gray-600">
                {straat} {nummer}<br />
                {postcode} {gemeente}
              </address>
            </a>
          </div>

          {/* Opening Hours & Map Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Opening Hours */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Openingstijden
              </h2>

              <div className="space-y-4">
                {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((dag) => {
                  const uren = openingstijden[dag] || '-';
                  const isOpen = uren.toLowerCase() !== 'gesloten';

                  return (
                    <div
                      key={dag}
                      className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                        isOpen ? 'bg-[var(--rb-light)]' : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-medium text-gray-900">{DAG_LABELS[dag]}</span>
                      <span className={isOpen ? 'text-[var(--rb-primary)] font-medium' : 'text-gray-400'}>
                        {uren}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map & Directions */}
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                Locatie
              </h2>

              {/* Map Preview */}
              <div className="flex-1 bg-gradient-to-br from-[var(--rb-light)] to-[var(--rb-primary)]/10 rounded-2xl mb-6 min-h-[200px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" className="text-[var(--rb-primary)]" />
                    <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" className="text-[var(--rb-primary)]" />
                    <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.5" className="text-[var(--rb-primary)]" />
                  </svg>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--rb-primary)] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <p className="text-[var(--rb-primary)] font-medium">{gemeente}, België</p>
                </div>
              </div>

              <a
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[var(--rb-primary)] text-white font-semibold rounded-lg hover:bg-[var(--rb-primary-dark)] transition-colors"
              >
                Open in kaart
              </a>
            </div>
          </div>

          {/* Home Visits Note */}
          <div className="mt-12 p-8 rounded-2xl bg-[var(--rb-light)] border border-[var(--rb-primary)]/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--rb-accent)]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{homeVisitsTitle}</h3>
                <p className="text-gray-600">
                  {homeVisitsContent}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {ctaTitle}
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {ctaContent}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${telefoon}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--rb-accent)] text-[var(--rb-dark)] font-semibold rounded-lg hover:bg-[var(--rb-accent-dark)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Bel nu
            </a>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Stuur email
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
