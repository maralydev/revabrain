'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { useI18n } from '@/i18n/client';
import { FadeIn, StaggerChildren, SectionHeading, GlowCard } from '@/components/public/AnimatedComponents';

// Disciplines matching PRD
const DISCIPLINES = [
  { id: 'all', label: 'Iedereen', icon: '👥' },
  { id: 'logopedie', label: 'Logopedie', icon: '🗣️' },
  { id: 'kinesitherapie', label: 'Kinesitherapie', icon: '🏃' },
  { id: 'ergotherapie', label: 'Ergotherapie', icon: '🤲' },
  { id: 'neuropsychologie', label: 'Neuropsychologie', icon: '🧠' },
  { id: 'dietetiek', label: 'Diëtetiek', icon: '🥗' },
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
    bio: 'Imene Chetti is de oprichter van RevaBrain en gespecialiseerd neurologopedist. Met haar expertise in neurogene spraak-taalstoornissen, cognitieve communicatieproblemen, slikstoornissen (dysfagie) en preverbale logopedie, biedt zij evidence-based behandeling aan volwassenen met niet-aangeboren hersenletsel en jonge kinderen met eet- en drinkproblemen.',
    foto: '/images/profiel-imene.jpeg',
    linkedin: '#',
    email: 'imene@revabrain.be',
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
    linkedin: '#',
    email: 'thomas@revabrain.be',
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
    linkedin: '#',
    email: 'lisa@revabrain.be',
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
    linkedin: '#',
    email: 'emma@revabrain.be',
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
    linkedin: '#',
    email: 'jan@revabrain.be',
  },
];

function TeamContent() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('all');

  const filteredMembers = activeTab === 'all'
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter(m => m.discipline === activeTab);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-mesh" />

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full decorative-gradient-2 blur-3xl opacity-20 animate-float-slow" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full decorative-gradient-1 blur-3xl opacity-20 animate-float" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
              <span className="text-sm text-white/80 font-medium">Ontmoet de experts</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('team.title')}
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl mx-auto">
              {t('team.subtitle')}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Discipline Filter Tabs */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            {DISCIPLINES.map((disc) => (
              <button
                key={disc.id}
                onClick={() => setActiveTab(disc.id)}
                className={`
                  px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap
                  transition-all duration-300
                  ${activeTab === disc.id
                    ? 'bg-[var(--rb-primary)] text-white shadow-lg shadow-[var(--rb-primary)]/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                <span className="mr-2">{disc.icon}</span>
                {disc.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="section-padding bg-[var(--gray-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nog geen teamleden</h3>
              <p className="text-gray-500">Nog geen teamleden in deze discipline.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <StaggerChildren staggerDelay={0.1} className="contents">
                {filteredMembers.map((member) => (
                  <GlowCard key={member.id} className="premium-card group">
                    {/* Photo & Overlay */}
                    <div className="relative mb-6 -mx-8 -mt-8 overflow-hidden rounded-t-3xl">
                      <div className="aspect-[4/3] bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-light)]">
                        {member.foto ? (
                          <img
                            src={member.foto}
                            alt={`${member.voornaam} ${member.achternaam}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-24 h-24 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Discipline Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-[var(--rb-primary)] shadow-lg">
                          {DISCIPLINES.find(d => d.id === member.discipline)?.label}
                        </span>
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Social Links on Hover */}
                      <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[var(--rb-primary)] hover:bg-white transition-colors"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[var(--rb-primary)] hover:bg-white transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {member.voornaam} {member.achternaam}
                      </h3>
                      <p className="text-[var(--rb-primary)] font-medium mb-4">
                        {member.rol}
                      </p>

                      {/* Specialisaties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.specialisaties.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="px-2.5 py-1 bg-[var(--rb-light)] text-[var(--rb-primary)] rounded-full text-xs font-medium"
                          >
                            {spec}
                          </span>
                        ))}
                        {member.specialisaties.length > 3 && (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            +{member.specialisaties.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Bio excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </GlowCard>
                ))}
              </StaggerChildren>
            </div>
          )}
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
              <span className="text-sm text-white/80 font-medium">Word deel van ons team</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Interesse om bij ons team te komen?
            </h2>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto">
              We zijn altijd op zoek naar gepassioneerde zorgverleners die ons team willen versterken.
              Werk in een dynamische omgeving met de nieuwste inzichten in neurologische revalidatie.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-accent text-lg px-8 py-4">
                Solliciteer nu
              </Link>
              <a href="mailto:jobs@revabrain.be" className="btn-secondary text-lg px-8 py-4">
                Mail ons direct
              </a>
            </div>
          </FadeIn>
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
