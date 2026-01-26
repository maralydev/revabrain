'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';

// Disciplines matching PRD
const DISCIPLINES = [
  { id: 'all', label: 'Iedereen' },
  { id: 'logopedie', label: 'Logopedie' },
  { id: 'kinesitherapie', label: 'Kinesitherapie' },
  { id: 'ergotherapie', label: 'Ergotherapie' },
  { id: 'neuropsychologie', label: 'Neuropsychologie' },
  { id: 'dietetiek', label: 'Diëtetiek' },
];

// Mock data - will be fetched from DB in production
const TEAM_MEMBERS = [
  {
    id: 1,
    voornaam: 'Imene',
    achternaam: 'Chetti',
    discipline: 'logopedie',
    rol: 'Oprichter & Neurologopedist',
    specialisaties: ['Neurogene spraak-taalstoornissen', 'Cognitieve problemen', 'Slikstoornissen', 'Preverbale logopedie'],
    bio: 'Imene Chetti is de oprichter van RevaBrain en gespecialiseerd neurologopedist. Met haar expertise in neurogene spraak-taalstoornissen, cognitieve communicatieproblemen, slikstoornissen (dysfagie) en preverbale logopedie, biedt zij evidence-based behandeling aan volwassenen met niet-aangeboren hersenletsel en jonge kinderen met eet- en drinkproblemen. RevaBrain is een geconventioneerde praktijk, waardoor officiële RIZIV-tarieven worden gehanteerd.',
    foto: '/images/profiel-imene.jpeg',
  },
  {
    id: 2,
    voornaam: 'Thomas',
    achternaam: 'Peeters',
    discipline: 'kinesitherapie',
    rol: 'Neurokinesitherapeut',
    specialisaties: ['Motorische revalidatie', 'Evenwicht', 'Looptraining', 'Bobath'],
    bio: 'Thomas is gespecialiseerd in de motorische revalidatie van patiënten met neurologische aandoeningen. Hij combineert klassieke kinesitherapie met moderne neurowetenschappelijke inzichten om optimale bewegingspatronen te herstellen.',
    foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    voornaam: 'Lisa',
    achternaam: 'Wouters',
    discipline: 'ergotherapie',
    rol: 'Ergotherapeut',
    specialisaties: ['ADL-training', 'Cognitieve revalidatie', 'Hulpmiddelen', 'Woningaanpassingen'],
    bio: 'Lisa helpt patiënten om hun dagelijkse activiteiten zo zelfstandig mogelijk uit te voeren. Ze werkt nauw samen met patiënten en hun omgeving om praktische oplossingen te vinden voor de uitdagingen die hersenletsel met zich meebrengt.',
    foto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 4,
    voornaam: 'Emma',
    achternaam: 'Claes',
    discipline: 'logopedie',
    rol: 'Prelogopedist',
    specialisaties: ['Eet- en drinkproblemen', 'Baby\'s en peuters', 'Sondevoeding afbouw'],
    bio: 'Emma is gespecialiseerd in prelogopedie: de behandeling van voedingsproblemen bij baby\'s en jonge kinderen. Ze begeleidt ouders en kinderen bij de overgang van sonde- naar orale voeding en bij eet- en drinkproblemen.',
    foto: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 5,
    voornaam: 'Jan',
    achternaam: 'Maes',
    discipline: 'neuropsychologie',
    rol: 'Neuropsycholoog',
    specialisaties: ['Cognitieve evaluatie', 'Geheugenrevalidatie', 'Executieve functies'],
    bio: 'Jan voert neuropsychologische onderzoeken uit en biedt cognitieve revalidatie aan. Hij helpt patiënten en hun familie om de gevolgen van hersenletsel te begrijpen en er zo goed mogelijk mee om te gaan.',
    foto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop&crop=face',
  },
];

function TeamPhoto({ foto, naam }: { foto: string | null; naam: string }) {
  return (
    <div className="relative w-48 h-48 mx-auto lg:mx-0">
      <div className="w-full h-full rounded-full overflow-hidden border-4 border-[var(--rb-primary)] shadow-lg bg-[var(--rb-light)]">
        {foto ? (
          <img
            src={foto}
            alt={naam}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-24 h-24 text-[var(--rb-primary)]/30"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

function TeamContent() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  const filteredMembers = activeTab === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.discipline === activeTab);

  return (
    <>
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 relative"
        style={{ background: 'linear-gradient(135deg, var(--rb-primary) 0%, #5BA3E8 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/80 uppercase tracking-widest text-sm mb-2">Ons team</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('team.title')}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </div>
      </section>

      {/* Discipline Tabs */}
      <section className="bg-white border-b sticky top-20 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
            {DISCIPLINES.map((disc) => (
              <button
                key={disc.id}
                onClick={() => setActiveTab(disc.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${activeTab === disc.id
                    ? 'bg-[var(--rb-primary)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {disc.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Nog geen teamleden in deze discipline.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {filteredMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`
                    flex flex-col lg:flex-row gap-12 items-center
                    ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}
                  `}
                >
                  {/* Diamond Photo */}
                  <div className="flex-shrink-0">
                    <TeamPhoto
                      foto={member.foto}
                      naam={`${member.voornaam} ${member.achternaam}`}
                    />
                  </div>

                  {/* Info */}
                  <div className={`flex-1 ${index % 2 === 1 ? 'lg:text-right' : ''}`}>
                    <div
                      className={`
                        inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-4
                        bg-[var(--rb-accent)]/20 text-[var(--rb-primary)]
                      `}
                    >
                      {DISCIPLINES.find(d => d.id === member.discipline)?.label}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {member.voornaam} {member.achternaam}
                    </h2>

                    <p className="text-lg text-[var(--rb-primary)] font-medium mb-4">
                      {member.rol}
                    </p>

                    {member.specialisaties.length > 0 && (
                      <div className={`flex flex-wrap gap-2 mb-6 ${index % 2 === 1 ? 'lg:justify-end' : ''}`}>
                        {member.specialisaties.map((spec) => (
                          <span
                            key={spec}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interesse om bij ons team te komen?
          </h2>
          <p className="text-gray-600 mb-8">
            We zijn altijd op zoek naar gepassioneerde zorgverleners die ons team willen versterken.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-[var(--rb-primary)] text-white rounded-full font-medium hover:bg-[var(--rb-primary-dark)] transition-colors"
          >
            Neem contact op
          </a>
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
