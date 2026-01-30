import { Metadata } from 'next'
import Link from 'next/link'
import PublicLayout from '@/components/public/PublicLayout'
import PageHero from '@/components/public/PageHero'
import PageCTA from '@/components/public/PageCTA'
import { getPageContent } from '@/modules/page-content/queries'
import { getFooterData } from '@/modules/footer/queries'

export const metadata: Metadata = {
  title: 'Tarieven en Terugbetaling | RevaBrain',
  description: 'Informatie over tarieven en terugbetaling voor logopedie bij RevaBrain. Geconventioneerde praktijk met maximale RIZIV-terugbetaling.',
  keywords: ['tarieven', 'terugbetaling', 'logopedie', 'RIZIV', 'mutualiteit', 'geconventioneerd', 'RevaBrain'],
  openGraph: {
    title: 'Tarieven en Terugbetaling | RevaBrain',
    description: 'Informatie over tarieven en terugbetaling voor logopedie bij RevaBrain.',
    type: 'website',
  },
}

const DEFAULT_STEPS = [
  { number: 1, text: 'Na aanmelding volgt eerst een anamnesegesprek waarbij wij informatie verlenen over het logopedisch onderzoek en de eventuele opstart van logopedische therapie. Ga kort hiervoor naar uw huisarts en vraag een voorschrift voor logopedisch onderzoek.' },
  { number: 2, text: 'Neem dat voorschrift, 2 mutualiteitsklevers en uw identiteitskaart mee naar onze eerste afspraak of leg het thuis klaar wanneer het om een huisbezoek gaat.' },
  { number: 3, text: 'Na het anamnesegesprek volgt het logopedisch onderzoek en wordt er een logopedisch bilan opgesteld voor uw behandelende specialist. Hij zal een voorschrift logopedische therapie moeten voorzien. Dit alles wordt voorgelegd aan de mutualiteit, indien er een goedkeuring volgt worden sessies logopedie terugbetaald.' },
  { number: 4, text: 'Het anamnesegesprek, het logopedisch onderzoek en het opmaken van het bilan wordt per 30 minuten gefactureerd en dit met een maximum van 5 x 30 minuten.' },
  { number: 5, text: 'Indien nodig zal na enige tijd een evolutiebilan opgemaakt worden waarbij u mogelijks hertest wordt. Zo kunnen we progressie in kaart brengen en verdere terugbetaling garanderen.' },
  { number: 6, text: "Overleg met andere betrokken disciplines is altijd mogelijk, dit wordt per 30' aangerekend." },
]

export default async function CostsPage() {
  const [content, footerData] = await Promise.all([
    getPageContent('costs', 'nl'),
    getFooterData(),
  ])

  const heroTitle = content.hero?.title || 'Tarieven en terugbetaling'
  const howItWorksTitle = content.steps?.title || 'Hoe gaat het in zijn werk'

  const steps = []
  for (let i = 1; i <= 10; i++) {
    const stepContent = content[`step${i}`]
    if (stepContent?.content) {
      steps.push({ number: i, text: stepContent.content })
    }
  }
  const displaySteps = steps.length > 0 ? steps : DEFAULT_STEPS

  const conventionTitle = content.convention?.title || 'Geconventioneerde praktijk'
  const conventionContent = content.convention?.content || 'Wij zijn een geconventioneerde praktijk en volgen de tarieven opgelegd door het RIZIV. Zo geniet u van de maximale wettelijke terugbetaling.'
  const homeVisitsTitle = content.homevisits?.title || 'Huisbezoeken'
  const homeVisitsContent = content.homevisits?.content || 'Voor therapie aan huis rekenen we een verplaatsingsvergoeding van 3 euro per sessie aan.'
  const tariffsButtonText = content.tariffs?.buttonText || 'Bekijk tarieven (RIZIV)'
  const tariffsButtonUrl = content.tariffs?.buttonUrl || 'https://www.riziv.fgov.be/nl/themas/kost-terugbetaling/door-ziekenfonds/verzorging-door-logopedist/Paginas/terugbetaling-logopedie.aspx'
  const tariffsNote = content.tariffs?.content || 'U wordt doorverwezen naar de officiële RIZIV website'
  const ctaTitle = content.cta?.title || 'Vragen over tarieven of terugbetaling?'
  const ctaContent = content.cta?.content || 'Neem gerust contact met ons op voor meer informatie.'
  const ctaButtonText = content.cta?.buttonText || 'Neem contact op'
  const ctaButtonUrl = content.cta?.buttonUrl || '/contact'

  return (
    <PublicLayout footerData={footerData}>
      <PageHero title={heroTitle} />

      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{howItWorksTitle}</h2>
            <div className="space-y-6">
              {displaySteps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-[var(--rb-primary)]">
                    {step.number}
                  </div>
                  <p className="text-slate-600 leading-relaxed pt-1">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[var(--rb-light)] rounded-2xl p-8 lg:p-12 border border-[var(--rb-primary)]/10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--rb-primary)]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--rb-primary)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{conventionTitle}</h3>
                <p className="text-slate-600 leading-relaxed">{conventionContent}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{homeVisitsTitle}</h2>
            <p className="text-slate-600 leading-relaxed">{homeVisitsContent}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <a
            href={tariffsButtonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--rb-primary)] text-white rounded-xl font-semibold hover:bg-[var(--rb-primary-dark)] transition-colors"
          >
            {tariffsButtonText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
          <p className="text-sm text-slate-500 mt-4">{tariffsNote}</p>
        </div>
      </section>

      <PageCTA title={ctaTitle} description={ctaContent}>
        <Link
          href={ctaButtonUrl}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--rb-dark)] font-semibold rounded-xl hover:bg-[var(--rb-accent)] hover:shadow-xl hover:shadow-[var(--rb-accent)]/20 transition-all duration-300"
        >
          {ctaButtonText}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </PageCTA>
    </PublicLayout>
  )
}
