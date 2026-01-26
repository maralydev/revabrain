'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

const indicaties = [
  'Problemen met borstvoeding',
  'Problemen met flesvoeding',
  'Overgang naar vast voedsel',
  'Weigeren van voeding',
  'Verslikken of kokhalzen',
  'Sondevoeding afbouw',
  'Voedingsproblemen bij prematuriteit',
  'Voedingsproblemen bij syndromen',
];

function PrelogopedieContent() {
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
                {t('treatments.prelogopedie.title')}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                {t('treatments.prelogopedie.description')}
              </p>
              <p className="text-gray-700 mt-4 leading-relaxed">
                Baby's en jonge kinderen met eet- en drinkproblemen kunnen bij ons terecht voor gespecialiseerde begeleiding. We helpen bij problemen met zuigen, slikken, kauwen en de overgang naar vast voedsel.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full bg-[#59ECB7]/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-32 h-32 text-[#59ECB7]"
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
