'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

const indicaties = [
  'Afasie (taalstoornissen)',
  'Dysartrie (spraakstoornissen)',
  'Apraxie (spraakprogrammeringsstoornissen)',
  'Dysfagie (slikstoornissen)',
  'Cognitieve communicatiestoornissen',
  'Aangezichtsverlamming',
  'Stemklachten na neurologische aandoening',
  'Laryngectomie',
];

function NeurologopedieContent() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-white">
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
                {t('treatments.neurologopedie.title')}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('treatments.neurologopedie.description')}
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-[#59ECB7]/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 100"
                  className="w-40 h-40 text-[#59ECB7]"
                  fill="currentColor"
                >
                  <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
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
              Indicaties voor neurologopedie
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {indicaties.map((indicatie, index) => (
                <div key={index} className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="#59ECB7"
                    strokeWidth={3}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{indicatie}</span>
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
            Hulp nodig bij neurologische spraak- of taalproblemen?
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

export default function NeurologopediePage() {
  return (
    <PublicLayout>
      <NeurologopedieContent />
    </PublicLayout>
  );
}
