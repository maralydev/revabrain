'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getContactInfo, type ContactInfoData } from '@/modules/contact-config/actions';

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

  // Default opening hours from revabrain.be
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
        // No database connection, use defaults
        setOpeningstijden(defaultOpeningstijden);
      }
      setLoading(false);
    }
    load();
  }, []);

  const dagLabels = DAG_LABELS[locale] || DAG_LABELS.nl;
  const gesloten = GESLOTEN[locale] || GESLOTEN.nl;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  // Fallback values from revabrain.be
  const telefoon = contactInfo?.telefoon || '+32 498 68 68 42';
  const email = contactInfo?.email || 'info@revabrain.be';
  const straat = contactInfo?.adresStraat || 'Rue Des Frères Lefort';
  const nummer = contactInfo?.adresNummer || '171, bus 003';
  const postcode = contactInfo?.adresPostcode || '1840';
  const gemeente = contactInfo?.adresGemeente || 'Tubeke';
  const latitude = contactInfo?.latitude || 50.6912;
  const longitude = contactInfo?.longitude || 4.2078;

  return (
    <>
      {/* Hero Section - pt-28 for fixed navbar */}
      <section className="bg-white pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2879D8' }}>
            {t('contact.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info Card */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
              {t('contact.info.title')}
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  {t('contact.info.phone')}
                </h3>
                <a
                  href={`tel:${telefoon}`}
                  className="text-lg hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  {telefoon}
                </a>
              </div>

              {/* Email */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  {t('contact.info.email')}
                </h3>
                <a
                  href={`mailto:${email}`}
                  className="text-lg hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  {email}
                </a>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  {t('contact.info.address')}
                </h3>
                <address className="text-lg text-gray-900 not-italic">
                  {straat} {nummer}<br />
                  {postcode} {gemeente}
                </address>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-sm hover:underline"
                  style={{ color: '#2879D8' }}
                >
                  Open in OpenStreetMap →
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
              {t('contact.info.hours')}
            </h2>

            <div className="space-y-3">
              {['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((dag) => {
                const uren = openingstijden[dag] || '-';
                const displayUren = uren.toLowerCase() === 'gesloten' ? gesloten : uren;
                return (
                  <div key={dag} className="flex justify-between items-center">
                    <span className="text-gray-900 font-medium">{dagLabels[dag]}</span>
                    <span className="text-gray-600">{displayUren}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Home Visits Note */}
        <div className="mt-8 bg-[#E7F6FC] p-6 rounded-lg border border-[#2879D8]/20">
          <p className="text-gray-700">
            {t('contact.homeVisitsNote')}
          </p>
        </div>

        {/* Map Section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
            {t('contact.location.title')}
          </h2>
          <a
            href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 text-white rounded-md hover:opacity-90"
            style={{ backgroundColor: '#2879D8' }}
          >
            Bekijk op kaart
          </a>
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
