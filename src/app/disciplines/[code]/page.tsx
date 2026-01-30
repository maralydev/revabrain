import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { PublicLayout } from '@/components/public/PublicLayout';
import PageCTA from '@/components/public/PageCTA';
import { getActieveDisciplineConfigs, getDisciplineByCode } from '@/modules/discipline-config/queries';
import { getPublicTeamledenByDiscipline } from '@/modules/teamlid/queries';
import { getPageContent } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';

// Icons per discipline
const DISCIPLINE_ICONS: Record<string, ReactNode> = {
  NEUROLOGOPEDIE: (
    <svg className="w-24 h-24" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
    </svg>
  ),
  PRELOGOPEDIE: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5zm-2 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  ),
  KINESITHERAPIE: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7" />
    </svg>
  ),
  ERGOTHERAPIE: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 11c0-.55-.45-1-1-1s-1 .45-1 1v2h2v-2zm2-4V5h-6v2h4v2h-2c-1.1 0-2 .9-2 2v4h2v-2h2v2h2v-6c0-1.1-.9-2-2-2zM8 9H4c-1.1 0-2 .9-2 2v10h2v-4h4v4h2V11c0-1.1-.9-2-2-2zm-2 6H4v-4h4v4h-2z" />
    </svg>
  ),
  NEUROPSYCHOLOGIE: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
    </svg>
  ),
  LOGOPEDIE: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z" />
    </svg>
  ),
  DIETIEK: (
    <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05l-5 2v8h-1V5.05l-5-2 1.66 16.46c.09.83.78 1.46 1.63 1.46h1.66l-.87-9.5h2.51l-.86 9.53zM1 21.99h6v-2H1v2zM8.5 3.5l-5 5H6v9h2V10h2l-.5 2h3l-.5-2h2V8.5H8.5z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

// Fallback indicaties per discipline
const INDICATIES: Record<string, { naam: string; beschrijving: string }[]> = {
  NEUROLOGOPEDIE: [
    { naam: 'Afasie', beschrijving: 'Taalstoornis na hersenletsel' },
    { naam: 'Dysartrie', beschrijving: 'Spraakstoornis door spierzwakte' },
    { naam: 'Dysfagie', beschrijving: 'Slikproblemen' },
    { naam: 'Apraxie', beschrijving: 'Spraakplanning stoornis' },
    { naam: 'Cognitieve communicatiestoornissen', beschrijving: 'Problemen met aandacht, geheugen' },
  ],
  PRELOGOPEDIE: [
    { naam: 'Zuigproblemen', beschrijving: 'Moeite met zuigen aan borst of fles' },
    { naam: 'Slikproblemen', beschrijving: 'Moeite met slikken van voeding' },
    { naam: 'Kauwproblemen', beschrijving: 'Overgang naar vaste voeding' },
    { naam: 'Voedselweigering', beschrijving: 'Kind weigert bepaalde texturen' },
    { naam: 'Sondevoeding afbouw', beschrijving: 'Begeleiding naar orale voeding' },
  ],
  KINESITHERAPIE: [
    { naam: 'Motorische revalidatie', beschrijving: 'Na CVA of hersenletsel' },
    { naam: 'Evenwichtsproblemen', beschrijving: 'Balans en coördinatie' },
    { naam: 'Spasticiteit', beschrijving: 'Verhoogde spierspanning' },
    { naam: 'Loopproblemen', beschrijving: 'Gang- en mobiliteitsrevalidatie' },
    { naam: 'Conditieopbouw', beschrijving: 'Fysieke conditie verbeteren' },
  ],
  ERGOTHERAPIE: [
    { naam: 'ADL-training', beschrijving: 'Dagelijkse activiteiten oefenen' },
    { naam: 'Hulpmiddelenadvisering', beschrijving: 'Aanpassingen voor zelfstandigheid' },
    { naam: 'Cognitieve training', beschrijving: 'Geheugen en concentratie' },
    { naam: 'Fijnmotoriek', beschrijving: 'Handfunctie verbeteren' },
    { naam: 'Woningaanpassingen', beschrijving: 'Advies voor thuis/werk' },
  ],
  NEUROPSYCHOLOGIE: [
    { naam: 'Cognitief onderzoek', beschrijving: 'Uitgebreide testbatterij' },
    { naam: 'Geheugentraining', beschrijving: 'Strategieën en oefeningen' },
    { naam: 'Aandachtsproblemen', beschrijving: 'Concentratie verbeteren' },
    { naam: 'Executieve functies', beschrijving: 'Planning en organisatie' },
    { naam: 'Psycho-educatie', beschrijving: 'Uitleg over hersenletsel' },
  ],
};

// Generate static paths for all disciplines
export async function generateStaticParams() {
  const disciplines = await getActieveDisciplineConfigs();
  return disciplines.map((d) => ({
    code: d.code.toLowerCase(),
  }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const discipline = await getDisciplineByCode(code.toUpperCase());

  if (!discipline) {
    return {
      title: 'Discipline niet gevonden | RevaBrain',
    };
  }

  return {
    title: `${discipline.naam} | RevaBrain`,
    description: discipline.beschrijving || `Ontdek meer over ${discipline.naam} bij RevaBrain. Gespecialiseerde zorg voor neurologische revalidatie.`,
    keywords: [discipline.naam.toLowerCase(), 'discipline', 'revalidatie', 'RevaBrain', 'neurologische zorg'],
    openGraph: {
      title: `${discipline.naam} | RevaBrain`,
      description: discipline.beschrijving || `Gespecialiseerde ${discipline.naam.toLowerCase()} bij RevaBrain.`,
      type: 'website',
    },
  };
}

export default async function DisciplinePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const discipline = await getDisciplineByCode(code.toUpperCase());

  if (!discipline || !discipline.actief) {
    notFound();
  }

  const [teamleden, allDisciplines, content, footerData] = await Promise.all([
    getPublicTeamledenByDiscipline(discipline.code),
    getActieveDisciplineConfigs(),
    getPageContent(`discipline-${discipline.code.toLowerCase()}`, 'nl'),
    getFooterData(),
  ]);

  const otherDisciplines = allDisciplines.filter((d) => d.code !== discipline.code);

  const extraInfo = content?.info?.content || null;
  const ctaTitle = content?.cta?.title || `Meer weten over ${discipline.naam.toLowerCase()}?`;
  const ctaContent = content?.cta?.content || 'Neem contact met ons op voor een vrijblijvend gesprek over uw situatie.';

  const indicaties = INDICATIES[discipline.code.toUpperCase()] || [];

  return (
    <PublicLayout >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--rb-dark)] via-[var(--rb-primary)] to-[var(--rb-dark)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(89,236,183,0.1),transparent_70%)]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <Link
            href="/disciplines"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar disciplines
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {discipline.naam}
              </h1>
              {discipline.beschrijving && (
                <p className="text-lg text-white/80 leading-relaxed">
                  {discipline.beschrijving}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                {DISCIPLINE_ICONS[discipline.code.toUpperCase()] || DEFAULT_ICON}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--rb-primary)] via-[var(--rb-accent)] to-[var(--rb-primary)]" />
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {extraInfo && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                  <p className="text-slate-700 leading-relaxed">{extraInfo}</p>
                </div>
              )}

              {indicaties.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Wat behandelen wij?
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {indicaties.map((indicatie, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-[var(--rb-primary)] pl-4 py-2"
                      >
                        <h3 className="font-semibold text-slate-900">{indicatie.naam}</h3>
                        <p className="text-sm text-slate-600">{indicatie.beschrijving}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {teamleden.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Ons team
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {teamleden.map((lid) => (
                      <div
                        key={`${lid.voornaam}-${lid.achternaam}`}
                        className="flex items-start gap-4"
                      >
                        {lid.foto ? (
                          <img
                            src={lid.foto}
                            alt={`${lid.voornaam} ${lid.achternaam}`}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--rb-primary)] to-[var(--rb-primary-dark)] flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {lid.voornaam.charAt(0)}{lid.achternaam.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900">
                            {lid.voornaam} {lid.achternaam}
                          </h3>
                          <p className="text-sm text-[var(--rb-primary)]">{discipline.naam}</p>
                          {lid.bio && (
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">{lid.bio}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <Link
                      href="/team"
                      className="inline-flex items-center text-[var(--rb-primary)] font-medium hover:underline"
                    >
                      Bekijk het volledige team
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Afspraak maken?
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                  Neem contact met ons op voor een vrijblijvend gesprek.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-3 text-center bg-[var(--rb-primary)] text-white font-semibold rounded-xl hover:bg-[var(--rb-primary-dark)] transition-colors"
                >
                  Neem contact op
                </Link>
                <a
                  href="tel:+32498686842"
                  className="block w-full mt-3 py-3 text-center border-2 border-[var(--rb-primary)] text-[var(--rb-primary)] font-semibold rounded-xl hover:bg-[var(--rb-primary)]/5 transition-colors"
                >
                  +32 498 68 68 42
                </a>
              </div>

              {otherDisciplines.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Andere disciplines
                  </h3>
                  <ul className="space-y-3">
                    {otherDisciplines.map((d) => (
                      <li key={d.id}>
                        <Link
                          href={`/disciplines/${d.code.toLowerCase()}`}
                          className="flex items-center text-slate-700 hover:text-[var(--rb-primary)] transition-colors"
                        >
                          <svg className="w-4 h-4 mr-2 text-[var(--rb-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          {d.naam}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-[var(--rb-light)] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Snelle links
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/treatments" className="text-slate-700 hover:text-[var(--rb-primary)] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      Onze behandelingen
                    </Link>
                  </li>
                  <li>
                    <Link href="/costs" className="text-slate-700 hover:text-[var(--rb-primary)] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      Tarieven & terugbetaling
                    </Link>
                  </li>
                  <li>
                    <Link href="/verwijzers" className="text-slate-700 hover:text-[var(--rb-primary)] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      Info voor verwijzers
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageCTA title={ctaTitle} description={ctaContent}>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--rb-dark)] font-semibold rounded-xl hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20 transition-all duration-300"
        >
          Maak een afspraak
        </Link>
        <Link
          href="/treatments"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300"
        >
          Bekijk behandelingen
        </Link>
      </PageCTA>
    </PublicLayout>
  );
}
