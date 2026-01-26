'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

function HomeContent() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero Section - Blue gradient background */}
      <section className="py-20 relative" style={{ background: 'linear-gradient(135deg, #2879D8 0%, #5BA3E8 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-lg text-white/90 mb-8">
                {t('home.hero.subtitle')}
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-[#2879D8] rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('home.hero.cta')}
              </Link>
            </div>
            <div className="hidden lg:flex justify-center">
              {/* Brain illustration */}
              <div className="w-80 h-80 rounded-full bg-[#59ECB7]/30 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-64 h-64 text-[#59ECB7]" fill="currentColor">
                  <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Onze Visie Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {t('home.vision.title')}
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {t('home.vision.text1')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('home.vision.text2')}
                </p>
              </div>
              <div className="flex justify-center">
                {/* Placeholder for vision image */}
                <div className="w-80 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-sm">Afbeelding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ons Verhaal Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {t('home.story.title')}
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center order-2 lg:order-1">
                {/* Placeholder for founder image */}
                <div className="w-64 h-80 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-sm">Foto</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="text-gray-700 leading-relaxed">
                  {t('home.story.text')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: '#2879D8' }}>
            {t('home.cta.title')}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-white rounded-full hover:opacity-90 text-lg font-semibold"
            style={{ backgroundColor: '#2879D8' }}
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      <HomeContent />
    </PublicLayout>
  );
}
