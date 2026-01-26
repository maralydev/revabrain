'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { getDisciplineDetail, type PublicDisciplineData, type PublicTeamlidData } from '@/modules/discipline-config/public-queries';

// Treatment indications by discipline
const indicaties: Record<string, string[]> = {
  LOGOPEDIE: [
    'Afasie (taalstoornis na hersenletsel)',
    'Dysartrie (spraakstoornis)',
    'Dysfagie (slikproblemen)',
    'Apraxie (spraakplanning)',
    'Stotteren',
    'Taalontwikkelingsstoornissen bij kinderen',
  ],
  KINESITHERAPIE: [
    'Motorische revalidatie na CVA',
    'Evenwichtsproblemen',
    'Spasticiteit',
    'Loopproblemen',
    'Conditieopbouw',
    'Pijnbehandeling',
  ],
  ERGOTHERAPIE: [
    'ADL-training (dagelijkse activiteiten)',
    'Hulpmiddelenadvisering',
    'Cognitieve training',
    'Aanpassingen thuis/werk',
    'Fijnmotorische revalidatie',
  ],
  NEUROPSYCHOLOGIE: [
    'Cognitief onderzoek',
    'Geheugentraining',
    'Aandachtsproblemen',
    'Executieve functies',
    'Gedragsveranderingen',
    'Psycho-educatie',
  ],
  DIETIEK: [
    'Voedingsadvies bij slikproblemen',
    'Gewichtsbeheer',
    'Enterale voeding',
    'Voedingsdeficiënties',
    'Diabetes management',
  ],
};

function DisciplineDetailContent() {
  const params = useParams();
  const code = params.code as string;
  const { t } = useI18n();

  const [discipline, setDiscipline] = useState<PublicDisciplineData | null>(null);
  const [teamleden, setTeamleden] = useState<PublicTeamlidData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getDisciplineDetail(code);
        setDiscipline(result.discipline);
        setTeamleden(result.teamleden);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  if (!discipline) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('common.notFound')}</h1>
        <Link href="/disciplines" className="text-blue-600 hover:underline">
          {t('common.backToOverview')}
        </Link>
      </div>
    );
  }

  const disciplineIndicaties = indicaties[discipline.code.toUpperCase()] || [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700">{t('nav.home')}</Link>
            <span className="mx-2">/</span>
            <Link href="/disciplines" className="hover:text-gray-700">{t('nav.disciplines')}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{discipline.naam}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#2879D8' }}>
            {discipline.naam}
          </h1>
          {discipline.beschrijving && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {discipline.beschrijving}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Indicaties */}
            {disciplineIndicaties.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#2879D8' }}>
                  {t('disciplines.detail.treatments')}
                </h2>
                <ul className="space-y-2">
                  {disciplineIndicaties.map((indicatie, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-gray-700">{indicatie}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Team */}
            {teamleden.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#2879D8' }}>
                  {t('disciplines.detail.team')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {teamleden.map((teamlid) => (
                    <div key={teamlid.id} className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xl font-semibold flex-shrink-0">
                        {teamlid.foto ? (
                          <img
                            src={teamlid.foto}
                            alt={`${teamlid.voornaam} ${teamlid.achternaam}`}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          `${teamlid.voornaam[0]}${teamlid.achternaam[0]}`
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {teamlid.voornaam} {teamlid.achternaam}
                        </h3>
                        {teamlid.bio && (
                          <p className="text-sm text-gray-600 mt-1">{teamlid.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact CTA */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2879D8' }}>
                {t('disciplines.detail.appointment')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('disciplines.detail.appointmentText')}
              </p>
              <Link
                href="/contact"
                className="block w-full py-3 text-center text-white rounded-md hover:opacity-90"
                style={{ backgroundColor: '#2879D8' }}
              >
                {t('disciplines.detail.contactUs')}
              </Link>
              <a
                href="tel:+3221234567"
                className="block w-full mt-3 py-3 text-center border-2 rounded-md hover:bg-gray-50"
                style={{ borderColor: '#2879D8', color: '#2879D8' }}
              >
                +32 2 123 45 67
              </a>
            </div>

            {/* Other Disciplines */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#2879D8' }}>
                {t('disciplines.detail.otherDisciplines')}
              </h3>
              <ul className="space-y-2">
                {['Logopedie', 'Kinesitherapie', 'Ergotherapie', 'Neuropsychologie', 'Diëtiek']
                  .filter(d => d.toLowerCase() !== discipline.naam.toLowerCase())
                  .map((d) => (
                    <li key={d}>
                      <Link
                        href={`/disciplines/${d.toLowerCase().replace('ë', 'e')}`}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        {d}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function DisciplineDetailPage() {
  return (
    <PublicLayout>
      <DisciplineDetailContent />
    </PublicLayout>
  );
}
