'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getActieveDisciplineConfigs, type DisciplineConfigData } from '@/modules/discipline-config/queries';

function DisciplinesContent() {
  const { t } = useI18n();
  const [disciplines, setDisciplines] = useState<DisciplineConfigData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActieveDisciplineConfigs();
        setDisciplines(data);
      } catch (err) {
        console.error('Error loading disciplines:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2879D8' }}>
            {t('disciplines.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('disciplines.subtitle')}
          </p>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-600">{t('common.loading')}</div>
        ) : disciplines.length === 0 ? (
          <div className="text-center text-gray-500">{t('common.notFound')}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {disciplines.map((discipline) => (
              <Link
                key={discipline.id}
                href={`/disciplines/${discipline.code.toLowerCase()}`}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold mb-3" style={{ color: '#2879D8' }}>
                  {discipline.naam}
                </h2>
                {discipline.beschrijving && (
                  <p className="text-gray-600 mb-4">
                    {discipline.beschrijving}
                  </p>
                )}
                <span className="text-sm font-medium" style={{ color: '#2879D8' }}>
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default function DisciplinesPage() {
  return (
    <PublicLayout>
      <DisciplinesContent />
    </PublicLayout>
  );
}
