'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getBehandelingBySlug, type BehandelingData } from '@/modules/behandeling/queries';

// Fallback data from revabrain.be
const FALLBACK_DESCRIPTION = 'Prelogopedie (ook wel preverbale logopedie) richt zich op eet- en drinkproblemen bij baby\'s en jonge kinderen. Zuigen, slikken en kauwen vormen de basis voor latere spraak- en taalontwikkeling. Wij begeleiden bij problemen met borstvoeding, flesvoeding, de overgang naar vast voedsel, sondevoeding afbouw en voedingsproblemen bij prematuriteit of syndromen.';

const FALLBACK_LONG_DESCRIPTION = 'Prelogopedie (ook wel preverbale logopedie genoemd) richt zich op de mondmotorische ontwikkeling en voedingsvaardigheden van baby\'s en jonge kinderen. De term "pre" verwijst naar de fase vóór het spreken, waarin zuigen, slikken en kauwen zich ontwikkelen als basis voor latere spraak- en taalontwikkeling.';

const FALLBACK_EXTRA_INFO = 'Wanneer uw baby of jong kind problemen heeft met drinken uit de borst of fles, moeite heeft met de overgang naar vast voedsel, veel huilt bij maaltijden, lang doet over eten, of wanneer er zorgen zijn over gewichtstoename, kan prelogopedische begeleiding helpen.';

const FALLBACK_AANDOENINGEN = [
  { naam: 'Problemen met borstvoeding', beschrijving: 'Moeizaam vasthappen, slecht zuigpatroon' },
  { naam: 'Problemen met flesvoeding', beschrijving: 'Luchthappen, vermoeidheid tijdens voeding' },
  { naam: 'Overgang naar vast voedsel', beschrijving: 'Weigeren, kokhalzen bij vaste voeding' },
  { naam: 'Selectief of kieskeurig eten', beschrijving: 'Beperkt voedselpatroon, textuurproblemen' },
  { naam: 'Verslikken of aspiratie', beschrijving: 'Voedsel of vocht in de luchtwegen' },
  { naam: 'Sondevoeding afbouw', beschrijving: 'Begeleiding bij overgang van sonde naar orale voeding' },
  { naam: 'Voedingsproblemen bij prematuriteit', beschrijving: 'Eet- en drinkproblemen bij te vroeg geboren baby\'s' },
  { naam: 'Voedingsproblemen bij syndromen', beschrijving: 'Down syndroom, Pierre Robin, etc.' },
  { naam: 'Schisis', beschrijving: 'Lip-, kaak- en/of gehemeltespleet' },
  { naam: 'Tongriem problematiek', beschrijving: 'Te korte of te strakke tongband' },
];

function PrelogopedieContent() {
  const { t, locale } = useI18n();
  const [behandeling, setBehandeling] = useState<BehandelingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getBehandelingBySlug('prelogopedie', locale);
      setBehandeling(data);
      setLoading(false);
    }
    loadData();
  }, [locale]);

  const title = behandeling?.title || 'Prelogopedie';
  const description = behandeling?.description || FALLBACK_DESCRIPTION;
  const longDescription = behandeling?.longDescription || FALLBACK_LONG_DESCRIPTION;
  const extraInfo = behandeling?.extraInfo || FALLBACK_EXTRA_INFO;
  const aandoeningen = behandeling?.aandoeningen?.length ? behandeling.aandoeningen : FALLBACK_AANDOENINGEN;
  const color = behandeling?.color || '#59ECB7';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 pt-28">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - pt-28 for fixed navbar */}
      <section className="pt-28 pb-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/treatments"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('common.backToOverview')}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h1 className="text-4xl font-bold mb-6" style={{ color: '#2879D8' }}>
                {title}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {description}
              </p>
              {longDescription && (
                <p className="text-gray-700 mt-4 leading-relaxed">
                  {longDescription}
                </p>
              )}
              {extraInfo && (
                <p className="text-gray-700 mt-4 leading-relaxed">
                  {extraInfo}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <svg
                  viewBox="0 0 24 24"
                  className="w-32 h-32"
                  style={{ color }}
                  fill="currentColor"
                >
                  <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5zm-2 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indicaties Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Indicaties voor prelogopedie
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {aandoeningen.map((indicatie, index) => (
                <div key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <div>
                    <span className="text-gray-900 font-medium">{indicatie.naam}</span>
                    {indicatie.beschrijving && (
                      <p className="text-sm text-gray-500">{indicatie.beschrijving}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2879D8' }}>
            Vragen over eet- en drinkproblemen bij uw kind?
          </h2>
          <p className="text-gray-600 mb-8">
            Neem contact met ons op voor een vrijblijvend gesprek.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-white rounded-full hover:opacity-90 font-semibold"
            style={{ backgroundColor: '#2879D8' }}
          >
            Maak een afspraak
          </Link>
        </div>
      </section>
    </>
  );
}

export default function PrelogopediePage() {
  return (
    <PublicLayout>
      <PrelogopedieContent />
    </PublicLayout>
  );
}
