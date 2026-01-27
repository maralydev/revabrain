import { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { getPageContent, PageContentData } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';

export const metadata: Metadata = {
  title: 'Tarieven en Terugbetaling | RevaBrain',
  description: 'Informatie over tarieven en terugbetaling voor logopedie bij RevaBrain. Geconventioneerde praktijk met maximale RIZIV-terugbetaling.',
  keywords: ['tarieven', 'terugbetaling', 'logopedie', 'RIZIV', 'mutualiteit', 'geconventioneerd', 'RevaBrain'],
  openGraph: {
    title: 'Tarieven en Terugbetaling | RevaBrain',
    description: 'Informatie over tarieven en terugbetaling voor logopedie bij RevaBrain.',
    type: 'website',
  },
};

// Default steps als er geen CMS content is
const DEFAULT_STEPS = [
  {
    number: 1,
    text: 'Na aanmelding volgt eerst een anamnesegesprek waarbij wij informatie verlenen over het logopedisch onderzoek en de eventuele opstart van logopedische therapie. Ga kort hiervoor naar uw huisarts en vraag een voorschrift voor logopedisch onderzoek.',
  },
  {
    number: 2,
    text: 'Neem dat voorschrift, 2 mutualiteitsklevers en uw identiteitskaart mee naar onze eerste afspraak of leg het thuis klaar wanneer het om een huisbezoek gaat.',
  },
  {
    number: 3,
    text: 'Na het anamnesegesprek volgt het logopedisch onderzoek en wordt er een logopedisch bilan opgesteld voor uw behandelende specialist. Hij zal een voorschrift logopedische therapie moeten voorzien. Dit alles wordt voorgelegd aan de mutualiteit, indien er een goedkeuring volgt worden sessies logopedie terugbetaald.',
  },
  {
    number: 4,
    text: 'Het anamnesegesprek, het logopedisch onderzoek en het opmaken van het bilan wordt per 30 minuten gefactureerd en dit met een maximum van 5 x 30 minuten.',
  },
  {
    number: 5,
    text: 'Indien nodig zal na enige tijd een evolutiebilan opgemaakt worden waarbij u mogelijks hertest wordt. Zo kunnen we progressie in kaart brengen en verdere terugbetaling garanderen.',
  },
  {
    number: 6,
    text: 'Overleg met andere betrokken disciplines is altijd mogelijk, dit wordt per 30\' aangerekend.',
  },
];

export default async function CostsPage() {
  // Server-side data fetching voor SEO
  const [content, footerData] = await Promise.all([
    getPageContent('costs', 'nl'),
    getFooterData(),
  ]);

  // CMS content met defaults
  const heroTitle = content.hero?.title || 'Tarieven en terugbetaling';

  const howItWorksTitle = content.steps?.title || 'Hoe gaat het in zijn werk';

  // Steps via CMS (step1, step2, etc.) of defaults
  const steps = [];
  for (let i = 1; i <= 10; i++) {
    const stepContent = content[`step${i}`];
    if (stepContent?.content) {
      steps.push({
        number: i,
        text: stepContent.content,
      });
    }
  }
  const displaySteps = steps.length > 0 ? steps : DEFAULT_STEPS;

  const conventionTitle = content.convention?.title || 'Geconventioneerde praktijk';
  const conventionContent = content.convention?.content || 'Wij zijn een geconventioneerde praktijk en volgen de tarieven opgelegd door het RIZIV. Zo geniet u van de maximale wettelijke terugbetaling.';

  const homeVisitsTitle = content.homevisits?.title || 'Huisbezoeken';
  const homeVisitsContent = content.homevisits?.content || 'Voor therapie aan huis rekenen we een verplaatsingsvergoeding van 3 euro per sessie aan. Dit dekt een deeltje van de transportkosten en tijd die wij spenderen aan verplaatsing.';

  const tariffsButtonText = content.tariffs?.buttonText || 'Bekijk tarieven (RIZIV)';
  const tariffsButtonUrl = content.tariffs?.buttonUrl || 'https://www.riziv.fgov.be/nl/themas/kost-terugbetaling/door-ziekenfonds/verzorging-door-logopedist/Paginas/terugbetaling-logopedie.aspx';
  const tariffsNote = content.tariffs?.content || 'U wordt doorverwezen naar de officiële RIZIV website';

  const ctaTitle = content.cta?.title || 'Vragen over tarieven of terugbetaling?';
  const ctaContent = content.cta?.content || 'Neem gerust contact met ons op voor meer informatie.';
  const ctaButtonText = content.cta?.buttonText || 'Neem contact op';
  const ctaButtonUrl = content.cta?.buttonUrl || '/contact';

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />
        <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full bg-[var(--rb-primary-light)]/10 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {heroTitle}
          </h1>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 lg:py-24 bg-[var(--gray-50)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {howItWorksTitle}
            </h2>
            <div className="space-y-6">
              {displaySteps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[var(--rb-primary)]">
                    {step.number}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Convention Section */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--rb-light)] rounded-2xl p-8 lg:p-12 border border-[var(--rb-primary)]/20">
            <div className="flex items-start gap-4">
              <svg
                className="w-8 h-8 flex-shrink-0 text-[var(--rb-primary)]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{conventionTitle}</h3>
                <p className="text-gray-700 leading-relaxed">{conventionContent}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel costs */}
      <section className="py-12 bg-[var(--gray-50)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{homeVisitsTitle}</h2>
            <p className="text-gray-700 leading-relaxed">{homeVisitsContent}</p>
          </div>
        </div>
      </section>

      {/* Tariffs link */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href={tariffsButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 text-white rounded-lg hover:opacity-90 font-semibold bg-[var(--rb-primary)] transition-colors"
          >
            {tariffsButtonText}
          </a>
          <p className="text-sm text-gray-500 mt-4">
            {tariffsNote}
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {ctaTitle}
          </h2>

          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            {ctaContent}
          </p>

          <Link
            href={ctaButtonUrl}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-[var(--rb-primary)] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
