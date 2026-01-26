'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getContactInfo, type ContactInfoData } from '@/modules/contact-config/actions';
import { FadeIn, SectionHeading, GlowCard } from '@/components/public/AnimatedComponents';

const DAG_LABELS: Record<string, Record<string, string>> = {
  nl: { ma: 'Maandag', di: 'Dinsdag', wo: 'Woensdag', do: 'Donderdag', vr: 'Vrijdag', za: 'Zaterdag', zo: 'Zondag' },
  fr: { ma: 'Lundi', di: 'Mardi', wo: 'Mercredi', do: 'Jeudi', vr: 'Vendredi', za: 'Samedi', zo: 'Dimanche' },
  en: { ma: 'Monday', di: 'Tuesday', wo: 'Wednesday', do: 'Thursday', vr: 'Friday', za: 'Saturday', zo: 'Sunday' },
};

const GESLOTEN: Record<string, string> = {
  nl: 'Gesloten',
  fr: 'Fermé',
  en: 'Closed',
};

function ContactContent() {
  const { t, locale } = useI18n();
  const [contactInfo, setContactInfo] = useState<ContactInfoData | null>(null);
  const [openingstijden, setOpeningstijden] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const defaultOpeningstijden = {
    ma: '09:00-18:00',
    di: '09:00-18:00',
    wo: '09:00-18:00',
    do: '09:00-18:00',
    vr: '09:00-18:00',
    za: 'Gesloten',
    zo: 'Gesloten',
  };

  useEffect(() => {
    async function load() {
      const info = await getContactInfo();
      if (info) {
        setContactInfo(info);
        try {
          const parsed = JSON.parse(info.openingstijden);
          setOpeningstijden(parsed);
        } catch (e) {
          setOpeningstijden(defaultOpeningstijden);
        }
      } else {
        setOpeningstijden(defaultOpeningstijden);
      }
      setLoading(false);
    }
    load();
  }, []);

  const dagLabels = DAG_LABELS[locale] || DAG_LABELS.nl;
  const gesloten = GESLOTEN[locale] || GESLOTEN.nl;

  // Fallback values
  const telefoon = contactInfo?.telefoon || '+32 498 68 68 42';
  const email = contactInfo?.email || 'info@revabrain.be';
  const straat = contactInfo?.adresStraat || 'Rue Des Frères Lefort';
  const nummer = contactInfo?.adresNummer || '171, bus 003';
  const postcode = contactInfo?.adresPostcode || '1840';
  const gemeente = contactInfo?.adresGemeente || 'Tubeke';
  const latitude = contactInfo?.latitude || 50.6912;
  const longitude = contactInfo?.longitude || 4.2078;

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full decorative-gradient-2 blur-3xl opacity-20 animate-float-slow" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full decorative-gradient-1 blur-3xl opacity-20 animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
              <span className="text-sm text-white/80 font-medium">Neem contact op</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('contact.title')}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Phone Card */}
            <FadeIn delay={0.1}>
              <a
                href={`tel:${telefoon}`}
                className="premium-card text-center group cursor-pointer"
              >
                <div className="icon-container w-16 h-16 mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Telefoon</h3>
                <p className="text-[var(--rb-primary)] font-medium text-lg group-hover:underline">
                  {telefoon}
                </p>
              </a>
            </FadeIn>

            {/* Email Card */}
            <FadeIn delay={0.2}>
              <a
                href={`mailto:${email}`}
                className="premium-card text-center group cursor-pointer"
              >
                <div className="icon-container w-16 h-16 mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-[var(--rb-primary)] font-medium text-lg group-hover:underline">
                  {email}
                </p>
              </a>
            </FadeIn>

            {/* Address Card */}
            <FadeIn delay={0.3}>
              <a
                href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="premium-card text-center group cursor-pointer"
              >
                <div className="icon-container w-16 h-16 mx-auto mb-6">
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
            </FadeIn>
          </div>

          {/* Opening Hours & Map Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Opening Hours */}
            <FadeIn delay={0.2}>
              <div className="premium-card h-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="icon-container w-12 h-12">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  {t('contact.info.hours')}
                </h2>

                <div className="space-y-4">
                  {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((dag) => {
                    const uren = openingstijden[dag] || '-';
                    const isOpen = uren.toLowerCase() !== 'gesloten';
                    const displayUren = uren.toLowerCase() === 'gesloten' ? gesloten : uren;

                    return (
                      <div
                        key={dag}
                        className={`flex justify-between items-center py-3 px-4 rounded-xl ${
                          isOpen ? 'bg-[var(--rb-light)]' : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium text-gray-900">{dagLabels[dag]}</span>
                        <span className={isOpen ? 'text-[var(--rb-primary)] font-medium' : 'text-gray-400'}>
                          {displayUren}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            {/* Map & Directions */}
            <FadeIn delay={0.3}>
              <div className="premium-card h-full flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <span className="icon-container w-12 h-12">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                  {t('contact.location.title')}
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
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--rb-primary)] flex items-center justify-center shadow-lg animate-bounce">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <p className="text-[var(--rb-primary)] font-medium">Tubeke, België</p>
                  </div>
                </div>

                <a
                  href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-center"
                >
                  Open in kaart
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Home Visits Note */}
          <FadeIn delay={0.4}>
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[var(--rb-light)] to-[var(--rb-accent)]/10 border border-[var(--rb-primary)]/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--rb-accent)]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Huisbezoeken</h3>
                  <p className="text-gray-600">
                    {t('contact.homeVisitsNote')}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <FadeIn>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Klaar om te beginnen?
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              Neem vandaag nog contact op en ontdek hoe we u kunnen helpen met uw revalidatietraject.
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={`tel:${telefoon}`} className="btn-accent text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Bel nu
              </a>
              <a href={`mailto:${email}`} className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Stuur email
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <ContactContent />
    </PublicLayout>
  );
}
