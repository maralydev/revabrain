'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActieveDisciplineConfigs, type DisciplineConfigData } from '@/modules/discipline-config/queries';

export default function DisciplinesPage() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold" style={{ color: '#2879D8' }}>
            RevaBrain
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/disciplines" className="text-gray-900 font-medium" style={{ color: '#2879D8' }}>
              Disciplines
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Inloggen
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2879D8' }}>
            Onze Disciplines
          </h1>
          <p className="text-lg text-gray-600">
            Ontdek ons multidisciplinair aanbod voor neurologische revalidatie
          </p>
        </div>
      </section>

      {/* Disciplines Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center text-gray-600">Laden...</div>
        ) : disciplines.length === 0 ? (
          <div className="text-center text-gray-500">Geen disciplines gevonden</div>
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
                  Meer info →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} RevaBrain. Alle rechten voorbehouden.
          </p>
        </div>
      </footer>
    </div>
  );
}
