'use client';

export const dynamic = 'force-dynamic';

import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

const teamMembers = [
  {
    voornaam: 'Imene',
    achternaam: 'Chetti',
    discipline: 'Logopedist',
    rol: 'Praktijkcoördinator',
    bio: 'Ik ben Imene, logopedist en praktijkeigenaar. In 2020 studeerde ik af als logopedist aan de Universiteit van Gent. Daarna volgde ik nog een master theoretische en experimentele psychologie om mijn kennis rond neurowetenschappen te verbreden. Ik deed afgelopen jaren talrijke ervaring op en volgde bijkomende opleidingen binnen het onderzoeken en behandelen van neurogene spraak-taal en cognitieve communicatiestoornissen. Daarnaast verdiepte ik me ook in slikstoornissen, aangezichtsverlamming en laryngectomie. Ook baby\'s en jonge kindjes met eet en drinkproblemen kunnen bij mij terecht. Als praktijkcoordinator tracht ik de aangename huiselijke sfeer te bewaken en juiste zorgverlening te kunnen toewijzen aan elke client.',
  },
];

function TeamContent() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6" style={{ color: '#2879D8' }}>
            {t('team.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 lg:p-12"
              >
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                  {/* Photo placeholder */}
                  <div className="flex justify-center lg:justify-start">
                    <div className="w-48 h-60 bg-gray-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-20 h-20 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {member.voornaam} {member.achternaam}
                    </h2>
                    <p className="text-lg font-medium mb-1" style={{ color: '#2879D8' }}>
                      {member.discipline}
                    </p>
                    <p className="text-gray-500 mb-6">{member.rol}</p>
                    <p className="text-gray-700 leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function TeamPage() {
  return (
    <PublicLayout>
      <TeamContent />
    </PublicLayout>
  );
}
