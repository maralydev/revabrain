'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getBehandelingBySlug, type BehandelingData } from '@/modules/behandeling/queries';

// Fallback data from revabrain.be
const FALLBACK_DESCRIPTION = 'Wanneer de communicatie verstoord wordt door een niet aangeboren hersenletsel kan dit zeer ingrijpend zijn voor de patiënt en zijn omgeving. Wij streven ernaar personen met neurologische communicatiestoornissen te begeleiden doorheen het herstelproces. Als logopedist houden wij ons bezig met het opsporen, onderzoeken en behandelen van spraak-, taal en slikstoornissen ten gevolge van een hersenletsel of hersenaandoening.';

const FALLBACK_LONG_DESCRIPTION = 'Neurologopedie omvat de diagnostiek en behandeling van spraak-, taal-, stem-, en slikstoornissen die ontstaan zijn door neurologische aandoeningen zoals een beroerte (CVA), traumatisch hersenletsel, hersentumoren, of neurodegeneratieve ziekten.';

const FALLBACK_AANDOENINGEN = [
  { naam: 'Afasie', beschrijving: 'Taalstoornis waarbij het begrijpen en/of produceren van taal aangetast is na hersenletsel' },
  { naam: 'Spraakapraxie', beschrijving: 'Motorische spraakstoornis waarbij de planning en programmering van spraakbewegingen verstoord is' },
  { naam: 'Dysartrie', beschrijving: 'Spraakstoornis door zwakte of coördinatieproblemen van de spraakspieren' },
  { naam: 'Dysfagie (slikstoornissen)', beschrijving: 'Problemen met slikken van voedsel, drank of speeksel' },
  { naam: 'Cognitieve communicatiestoornissen', beschrijving: 'Communicatieproblemen door stoornissen in aandacht, geheugen of executieve functies' },
  { naam: 'Aangezichtsverlamming', beschrijving: 'Verlamming van de aangezichtsspieren, vaak eenzijdig' },
  { naam: 'Stemproblemen na intubatie', beschrijving: 'Heesheid of stemproblemen na langdurige beademing' },
  { naam: 'Laryngectomie', beschrijving: 'Spraakrevalidatie na verwijdering van het strottenhoofd' },
];

function NeurologopedieContent() {
  const { t, locale } = useI18n();
  const [behandeling, setBehandeling] = useState<BehandelingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getBehandelingBySlug('neurologopedie', locale);
      setBehandeling(data);
      setLoading(false);
    }
    loadData();
  }, [locale]);

  const title = behandeling?.title || 'Neurologopedie';
  const description = behandeling?.description || FALLBACK_DESCRIPTION;
  const longDescription = behandeling?.longDescription || FALLBACK_LONG_DESCRIPTION;
  const aandoeningen = behandeling?.aandoeningen?.length ? behandeling.aandoeningen : FALLBACK_AANDOENINGEN;
  const color = behandeling?.color || '#2879D8';

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
              <h1 className="text-4xl font-bold mb-6" style={{ color }}>
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
            </div>

            <div className="flex justify-center">
              <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <svg
                  viewBox="0 0 100 100"
                  className="w-40 h-40"
                  style={{ color }}
                  fill="currentColor"
                >
                  <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aandoeningen Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Aandoeningen die wij behandelen
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {aandoeningen.map((aandoening, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: color }}>
                  <h3 className="font-semibold text-gray-900 mb-1">{aandoening.naam}</h3>
                  {aandoening.beschrijving && (
                    <p className="text-sm text-gray-600">{aandoening.beschrijving}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color }}>
            Vragen over neurologische stoornissen?
          </h2>
          <p className="text-gray-600 mb-8">
            Neem contact met ons op voor een vrijblijvend gesprek.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 text-white rounded-full hover:opacity-90 font-semibold"
            style={{ backgroundColor: color }}
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
