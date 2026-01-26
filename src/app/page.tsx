'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getActieveDisciplineConfigs, type DisciplineConfigData } from '@/modules/discipline-config/queries';

function HomeContent() {
  const { t } = useI18n();
  const [disciplines, setDisciplines] = useState<DisciplineConfigData[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getActieveDisciplineConfigs();
      setDisciplines(data);
    }
    load();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#2879D8' }}>
            RevaBrain
          </h1>
          <p className="text-2xl text-gray-600 mb-4">
            {t('home.hero.title')}
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
            {t('home.hero.subtitle')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/contact"
              className="px-8 py-3 text-white rounded-md hover:opacity-90 text-lg"
              style={{ backgroundColor: '#2879D8' }}
            >
              {t('home.hero.cta')}
            </Link>
            <a
              href="tel:+3221234567"
              className="px-8 py-3 border-2 rounded-md hover:bg-gray-50 text-lg"
              style={{ borderColor: '#2879D8', color: '#2879D8' }}
            >
              +32 2 123 45 67
            </a>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4" style={{ color: '#2879D8' }}>
            {t('home.disciplines.title')}
          </h2>
          <p className="text-center text-gray-600 mb-12">
            {t('home.disciplines.subtitle')}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {disciplines.map((disc) => (
              <Link
                key={disc.code}
                href={`/disciplines/${disc.code.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                  {disc.naam}
                </h3>
                {disc.beschrijving && (
                  <p className="text-gray-600">{disc.beschrijving}</p>
                )}
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/disciplines"
              className="text-[#2879D8] hover:underline font-medium"
            >
              {t('nav.disciplines')} →
            </Link>
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
            className="inline-block px-8 py-3 text-white rounded-md hover:opacity-90 text-lg"
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
