'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

function CostsContent() {
  const { t } = useI18n();

  const steps = [
    { number: 1, text: t('costs.step1') },
    { number: 2, text: t('costs.step2') },
    { number: 3, text: t('costs.step3') },
    { number: 4, text: t('costs.step4') },
    { number: 5, text: t('costs.step5') },
    { number: 6, text: t('costs.step6') },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: '#2879D8' }}>
            {t('costs.title')}
          </h1>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('costs.howItWorks')}
            </h2>
            <div className="space-y-6">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: '#2879D8' }}
                  >
                    {step.number}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Convention Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#E7F6FC] rounded-2xl p-8 lg:p-12 border border-[#2879D8]/20">
            <div className="flex items-start gap-4">
              <svg
                className="w-8 h-8 flex-shrink-0"
                fill="none"
                stroke="#2879D8"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Geconventioneerde praktijk</h3>
                <p className="text-gray-700 leading-relaxed">{t('costs.convention')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel costs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Huisbezoeken</h2>
            <p className="text-gray-700 leading-relaxed">{t('costs.travel')}</p>
          </div>
        </div>
      </section>

      {/* Tariffs link */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href="https://www.riziv.fgov.be/nl/themas/kost-terugbetaling/door-ziekenfonds/verzorging-door-logopedist/Paginas/terugbetaling-logopedie.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-white rounded-full hover:opacity-90 font-semibold"
            style={{ backgroundColor: '#2879D8' }}
          >
            {t('costs.viewTariffs')} (RIZIV)
          </a>
          <p className="text-sm text-gray-500 mt-4">
            U wordt doorverwezen naar de officiële RIZIV website
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#2879D8' }}>
            Vragen over tarieven of terugbetaling?
          </h2>
          <p className="text-gray-600 mb-8">
            Neem gerust contact met ons op voor meer informatie.
          </p>
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

export default function CostsPage() {
  return (
    <PublicLayout>
      <CostsContent />
    </PublicLayout>
  );
}
