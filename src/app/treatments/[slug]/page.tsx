import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import PublicLayout from '@/components/public/PublicLayout';
import { getBehandelingBySlug, getAllBehandelingen } from '@/modules/behandeling/queries';
import { getFooterData } from '@/modules/footer/queries';

// Fallback data
const FALLBACK_DATA: Record<string, {
  title: string;
  description: string;
  longDescription: string;
  color: string;
  aandoeningen: { naam: string; beschrijving: string }[];
  icon: string;
}> = {
  neurologopedie: {
    title: 'Neurologopedie',
    description: 'Wanneer de communicatie verstoord wordt door een niet aangeboren hersenletsel kan dit zeer ingrijpend zijn voor de patiënt en zijn omgeving. Wij streven ernaar personen met neurologische communicatiestoornissen te begeleiden doorheen het herstelproces.',
    longDescription: 'Neurologopedie omvat de diagnostiek en behandeling van spraak-, taal-, stem-, en slikstoornissen die ontstaan zijn door neurologische aandoeningen zoals een beroerte (CVA), traumatisch hersenletsel, hersentumoren, of neurodegeneratieve ziekten.',
    color: '#2879D8',
    aandoeningen: [
      { naam: 'Afasie', beschrijving: 'Taalstoornis waarbij het begrijpen en/of produceren van taal aangetast is na hersenletsel' },
      { naam: 'Spraakapraxie', beschrijving: 'Motorische spraakstoornis waarbij de planning en programmering van spraakbewegingen verstoord is' },
      { naam: 'Dysartrie', beschrijving: 'Spraakstoornis door zwakte of coördinatieproblemen van de spraakspieren' },
      { naam: 'Dysfagie (slikstoornissen)', beschrijving: 'Problemen met slikken van voedsel, drank of speeksel' },
      { naam: 'Cognitieve communicatiestoornissen', beschrijving: 'Communicatieproblemen door stoornissen in aandacht, geheugen of executieve functies' },
      { naam: 'Aangezichtsverlamming', beschrijving: 'Verlamming van de aangezichtsspieren, vaak eenzijdig' },
    ],
    icon: 'brain',
  },
  prelogopedie: {
    title: 'Prelogopedie',
    description: 'Prelogopedie (ook wel preverbale logopedie) richt zich op eet- en drinkproblemen bij baby\'s en jonge kinderen. Zuigen, slikken en kauwen vormen de basis voor latere spraak- en taalontwikkeling.',
    longDescription: 'Wij begeleiden bij problemen met borstvoeding, flesvoeding, de overgang naar vast voedsel, sondevoeding afbouw en voedingsproblemen bij prematuriteit of syndromen.',
    color: '#59ECB7',
    aandoeningen: [
      { naam: 'Zuigproblemen', beschrijving: 'Moeite met zuigen aan de borst of fles' },
      { naam: 'Slikproblemen', beschrijving: 'Moeite met slikken van melk of vast voedsel' },
      { naam: 'Kauwproblemen', beschrijving: 'Moeite met leren kauwen of overgang naar vaste voeding' },
      { naam: 'Voedselweigering', beschrijving: 'Kind weigert bepaald voedsel of texturen' },
      { naam: 'Sondevoeding afbouw', beschrijving: 'Begeleiding bij afbouwen van sondevoeding naar orale voeding' },
    ],
    icon: 'child',
  },
};

// SVG Icons per type
const ICONS: Record<string, ReactNode> = {
  brain: (
    <svg viewBox="0 0 100 100" className="w-40 h-40" fill="currentColor">
      <path d="M50 10C30 10 15 25 15 45C15 55 20 63 28 68C28 75 32 82 40 86C42 90 47 93 50 93C53 93 58 90 60 86C68 82 72 75 72 68C80 63 85 55 85 45C85 25 70 10 50 10ZM35 30C40 30 43 33 43 38C43 43 40 46 35 46C30 46 27 43 27 38C27 33 30 30 35 30ZM65 30C70 30 73 33 73 38C73 43 70 46 65 46C60 46 57 43 57 38C57 33 60 30 65 30ZM50 55C58 55 65 58 70 63C65 68 58 72 50 72C42 72 35 68 30 63C35 58 42 55 50 55Z" />
    </svg>
  ),
  child: (
    <svg viewBox="0 0 24 24" className="w-40 h-40" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7c0 1.64.8 3.09 2.03 4H6.5C4.57 11 3 12.57 3 14.5c0 1.48.92 2.75 2.22 3.27C5.08 18.15 5 18.57 5 19c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3 0-.43-.08-.85-.22-1.23C20.08 17.25 21 15.98 21 14.5c0-1.93-1.57-3.5-3.5-3.5h-2.53c1.23-.91 2.03-2.36 2.03-4 0-2.76-2.24-5-5-5zm-2 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
  ),
};

// Generate static paths for known behandelingen
export async function generateStaticParams() {
  const behandelingen = await getAllBehandelingen('nl');

  // Combine database slugs with fallback slugs
  const slugs = new Set([
    ...behandelingen.map(b => b.slug),
    ...Object.keys(FALLBACK_DATA),
  ]);

  return Array.from(slugs).map((slug) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const behandeling = await getBehandelingBySlug(slug, 'nl');
  const fallback = FALLBACK_DATA[slug];

  const title = behandeling?.title || fallback?.title || 'Behandeling';
  const description = behandeling?.description || fallback?.description || 'Gespecialiseerde behandeling bij RevaBrain.';

  return {
    title: `${title} | RevaBrain`,
    description,
    keywords: [title.toLowerCase(), 'behandeling', 'logopedie', 'revalidatie', 'RevaBrain'],
    openGraph: {
      title: `${title} | RevaBrain`,
      description,
      type: 'website',
    },
  };
}

export default async function BehandelingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Server-side data fetching voor SEO
  const [behandeling, footerData] = await Promise.all([
    getBehandelingBySlug(slug, 'nl'),
    getFooterData(),
  ]);
  const fallback = FALLBACK_DATA[slug];

  // If no data from DB and no fallback, show 404
  if (!behandeling && !fallback) {
    notFound();
  }

  // Use DB data with fallback
  const title = behandeling?.title || fallback?.title || 'Behandeling';
  const description = behandeling?.description || fallback?.description || '';
  const longDescription = behandeling?.longDescription || fallback?.longDescription || '';
  const color = behandeling?.color || fallback?.color || '#2879D8';
  const aandoeningen = behandeling?.aandoeningen?.length
    ? behandeling.aandoeningen
    : fallback?.aandoeningen || [];
  const iconType = fallback?.icon || 'brain';

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <Link
            href="/treatments"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Terug naar overzicht
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                {title}
              </h1>
              <p className="text-lg text-white/80 leading-relaxed">
                {description}
              </p>
              {longDescription && (
                <p className="text-white/70 mt-4 leading-relaxed">
                  {longDescription}
                </p>
              )}
            </div>

            <div className="flex justify-center">
              <div
                className="w-64 h-64 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {behandeling?.iconSvg ? (
                  <div dangerouslySetInnerHTML={{ __html: behandeling.iconSvg }} />
                ) : (
                  ICONS[iconType] || ICONS.brain
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Aandoeningen Section - Server rendered voor SEO */}
      {aandoeningen.length > 0 && (
        <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Aandoeningen die wij behandelen
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {aandoeningen.map((aandoening, index) => (
                  <div
                    key={aandoening.naam || index}
                    className="border-l-4 pl-4"
                    style={{ borderColor: color }}
                  >
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
      )}

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Vragen over {title.toLowerCase()}?
          </h2>

          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Neem contact met ons op voor een vrijblijvend gesprek over uw situatie.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--rb-accent)] text-[var(--rb-dark)] font-semibold rounded-lg hover:bg-[var(--rb-accent-dark)] transition-colors"
            >
              Maak een afspraak
            </Link>
            <Link
              href="/verwijzers"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Info voor verwijzers
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
