import { Metadata } from 'next'
import PublicLayout from '@/components/public/PublicLayout'
import PageHero from '@/components/public/PageHero'
import PageCTA from '@/components/public/PageCTA'
import { getContactInfo } from '@/modules/contact-config/actions'
import { getPageContent } from '@/modules/page-content/queries'
import { getFooterData } from '@/modules/footer/queries'

export const metadata: Metadata = {
  title: 'Contact | RevaBrain',
  description: 'Neem contact op met RevaBrain voor vragen over neurologische revalidatie en logopedie.',
  keywords: ['contact', 'RevaBrain', 'Tubeke', 'logopedie', 'afspraak maken', 'neurologische revalidatie'],
  openGraph: {
    title: 'Contact | RevaBrain',
    description: 'Neem contact op met RevaBrain voor vragen over neurologische revalidatie en logopedie.',
    type: 'website',
  },
}

const DAG_LABELS: Record<string, string> = {
  ma: 'Maandag', di: 'Dinsdag', wo: 'Woensdag', do: 'Donderdag',
  vr: 'Vrijdag', za: 'Zaterdag', zo: 'Zondag',
}

const DEFAULT_OPENINGSTIJDEN: Record<string, string> = {
  ma: '09:00-18:00', di: '09:00-18:00', wo: '09:00-18:00',
  do: '09:00-18:00', vr: '09:00-18:00', za: 'Gesloten', zo: 'Gesloten',
}

export default async function ContactPage() {
  const [contactInfo, content, footerData] = await Promise.all([
    getContactInfo(),
    getPageContent('contact', 'nl'),
    getFooterData(),
  ])

  let openingstijden = DEFAULT_OPENINGSTIJDEN
  if (contactInfo?.openingstijden) {
    try { openingstijden = JSON.parse(contactInfo.openingstijden) } catch { /* keep defaults */ }
  }

  const telefoon = contactInfo?.telefoon || '+32 498 68 68 42'
  const email = contactInfo?.email || 'info@revabrain.be'
  const straat = contactInfo?.adresStraat || 'Rue Des Frères Lefort'
  const nummer = contactInfo?.adresNummer || '171, bus 003'
  const postcode = contactInfo?.adresPostcode || '1840'
  const gemeente = contactInfo?.adresGemeente || 'Tubeke'
  const latitude = contactInfo?.latitude || 50.6912
  const longitude = contactInfo?.longitude || 4.2078

  const heroTitle = content.hero?.title || 'Contactgegevens'
  const heroSubtitle = content.hero?.subtitle || 'Neem contact op'
  const heroDescription = content.hero?.content || 'Neem contact met ons op voor vragen of om een afspraak te maken'

  const homeVisitsTitle = content.homevisits?.title || 'Huisbezoeken'
  const homeVisitsContent = content.homevisits?.content || 'Momenteel zijn enkel huisbezoeken mogelijk in Tubeke, Halle, Sint-Pieters-Leeuw, Beersel, en omliggende gemeenten.'

  const ctaTitle = content.cta?.title || 'Klaar om te beginnen?'
  const ctaContent = content.cta?.content || 'Neem vandaag nog contact op en ontdek hoe we u kunnen helpen.'

  return (
    <PublicLayout footerData={footerData}>
      <PageHero title={heroTitle} badge={heroSubtitle} description={heroDescription} />

      {/* Contact Cards */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <a
              href={`tel:${telefoon}`}
              className="bg-white rounded-2xl border border-slate-100 hover:border-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/5 transition-all duration-300 p-8 text-center group"
            >
              <div className="w-14 h-14 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Telefoon</h3>
              <p className="text-[var(--rb-primary)] font-medium text-lg">{telefoon}</p>
            </a>

            <a
              href={`mailto:${email}`}
              className="bg-white rounded-2xl border border-slate-100 hover:border-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/5 transition-all duration-300 p-8 text-center group"
            >
              <div className="w-14 h-14 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Email</h3>
              <p className="text-[var(--rb-primary)] font-medium text-lg">{email}</p>
            </a>

            <a
              href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-slate-100 hover:border-[var(--rb-primary)]/20 hover:shadow-lg hover:shadow-[var(--rb-primary)]/5 transition-all duration-300 p-8 text-center group"
            >
              <div className="w-14 h-14 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)] mx-auto mb-6 group-hover:bg-[var(--rb-primary)] group-hover:text-white transition-colors duration-300">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Adres</h3>
              <address className="not-italic text-slate-600">
                {straat} {nummer}<br />
                {postcode} {gemeente}
              </address>
            </a>
          </div>

          {/* Opening Hours & Map */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Openingstijden
              </h2>
              <div className="space-y-3">
                {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((dag) => {
                  const uren = openingstijden[dag] || '-'
                  const isOpen = uren.toLowerCase() !== 'gesloten'
                  return (
                    <div
                      key={dag}
                      className={`flex justify-between items-center py-3 px-4 rounded-xl ${isOpen ? 'bg-[var(--rb-light)]' : 'bg-slate-50'}`}
                    >
                      <span className="font-medium text-slate-900">{DAG_LABELS[dag]}</span>
                      <span className={isOpen ? 'text-[var(--rb-primary)] font-medium' : 'text-slate-400'}>{uren}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                <span className="w-12 h-12 bg-[var(--rb-light)] rounded-xl flex items-center justify-center text-[var(--rb-primary)]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </span>
                Locatie
              </h2>

              <div className="flex-1 bg-gradient-to-br from-[var(--rb-light)] to-[var(--rb-primary)]/10 rounded-2xl mb-6 min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--rb-primary)] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>
                  <p className="text-[var(--rb-primary)] font-medium">{gemeente}, België</p>
                </div>
              </div>

              <a
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--rb-primary)] text-white font-semibold rounded-xl hover:bg-[var(--rb-primary-dark)] transition-colors"
              >
                Open in kaart
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>

          {/* Home Visits */}
          <div className="mt-12 p-8 rounded-2xl bg-[var(--rb-light)] border border-[var(--rb-primary)]/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--rb-accent)]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{homeVisitsTitle}</h3>
                <p className="text-slate-600">{homeVisitsContent}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA title={ctaTitle} description={ctaContent}>
        <a
          href={`tel:${telefoon}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--rb-dark)] font-semibold rounded-xl hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Bel nu
        </a>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Stuur email
        </a>
      </PageCTA>
    </PublicLayout>
  )
}
