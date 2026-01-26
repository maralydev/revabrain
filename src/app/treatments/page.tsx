'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

const treatments = [
  {
    id: 'neurologopedie',
    icon: (
      <svg viewBox="0 0 100 100" className="w-16 h-16" fill="currentColor">
        <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
      </svg>
    ),
  },
  {
    id: 'prelogopedie',
    icon: (
      <svg viewBox="0 0 24 24" className="w-16 h-16" fill="currentColor">
        <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5zm-2 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
      </svg>
    ),
  },
];

function TreatmentsContent() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6" style={{ color: '#2879D8' }}>
            {t('treatments.title')}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {t('treatments.subtitle')}
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto">
            {t('treatments.intro')}
          </p>
        </div>
      </section>

      {/* Treatments Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {treatments.map((treatment) => (
              <Link
                key={treatment.id}
                href={`/treatments/${treatment.id}`}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 text-[#59ECB7]">{treatment.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t(`treatments.${treatment.id}.title`)}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">
                    {t(`treatments.${treatment.id}.description`)}
                  </p>
                  <span
                    className="mt-6 inline-flex items-center font-medium"
                    style={{ color: '#2879D8' }}
                  >
                    Meer info
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
            Vragen over onze behandelingen?
          </h2>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-white rounded-full hover:opacity-90 font-semibold"
            style={{ backgroundColor: '#2879D8' }}
          >
            Neem contact op
          </Link>
        </div>
      </section>
    </>
  );
}

export default function TreatmentsPage() {
  return (
    <PublicLayout>
      <TreatmentsContent />
    </PublicLayout>
  );
}
