import { Metadata } from 'next';
import Link from 'next/link';
import PublicLayout from '@/components/public/PublicLayout';
import { getPageContent } from '@/modules/page-content/queries';
import { getFooterData } from '@/modules/footer/queries';
import { getContactInfo } from '@/modules/contact-config/actions';

export const metadata: Metadata = {
  title: 'Privacy Policy | RevaBrain',
  description: 'Privacybeleid van RevaBrain. Informatie over hoe wij omgaan met uw persoonsgegevens conform de GDPR/AVG wetgeving.',
  robots: 'noindex, follow',
};

export default async function PrivacyPage() {
  const [content, footerData, contactInfo] = await Promise.all([
    getPageContent('privacy', 'nl'),
    getFooterData(),
    getContactInfo(),
  ]);

  // Contact info voor in de tekst
  const praktijkNaam = 'RevaBrain';
  const email = contactInfo?.email || 'info@revabrain.be';
  const adres = contactInfo
    ? `${contactInfo.adresStraat} ${contactInfo.adresNummer}, ${contactInfo.adresPostcode} ${contactInfo.adresGemeente}`
    : 'Rue Des Frères Lefort 171, bus 003, 1480 Tubize';

  // CMS content met defaults
  const heroTitle = content?.hero?.title || 'Privacybeleid';
  const lastUpdated = content?.hero?.subtitle || 'Laatst bijgewerkt: januari 2026';

  // Secties - kunnen via CMS worden aangepast
  const intro = content?.intro?.content || `Bij ${praktijkNaam} hechten wij groot belang aan de bescherming van uw persoonsgegevens. Dit privacybeleid legt uit welke gegevens wij verzamelen, waarom wij deze verzamelen, en hoe wij ermee omgaan conform de Algemene Verordening Gegevensbescherming (AVG/GDPR).`;

  const sections = [
    {
      title: content?.section1?.title || '1. Wie zijn wij?',
      content: content?.section1?.content || `${praktijkNaam} is een multidisciplinaire groepspraktijk voor neurologische revalidatie. Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens.\n\nContactgegevens:\n${praktijkNaam}\n${adres}\nE-mail: ${email}`,
    },
    {
      title: content?.section2?.title || '2. Welke gegevens verzamelen wij?',
      content: content?.section2?.content || `Wij kunnen de volgende persoonsgegevens verzamelen en verwerken:\n\n• Identificatiegegevens: naam, adres, telefoonnummer, e-mailadres\n• Medische gegevens: diagnose, behandelgegevens, verslagen van onderzoeken\n• Administratieve gegevens: mutualiteit, RIZIV-nummer, facturatiegegevens\n• Communicatiegegevens: correspondentie via e-mail of telefoon`,
    },
    {
      title: content?.section3?.title || '3. Waarom verwerken wij uw gegevens?',
      content: content?.section3?.content || `Wij verwerken uw gegevens voor de volgende doeleinden:\n\n• Het verlenen van logopedische en revalidatiezorg\n• Het opstellen van verslagen en communicatie met verwijzers\n• Administratieve en financiële afhandeling (facturatie, terugbetaling)\n• Wettelijke verplichtingen (bijv. RIZIV-rapportage)\n• Kwaliteitsverbetering van onze dienstverlening`,
    },
    {
      title: content?.section4?.title || '4. Rechtsgrond voor verwerking',
      content: content?.section4?.content || `Wij verwerken uw gegevens op basis van:\n\n• Uitvoering van de behandelovereenkomst\n• Wettelijke verplichtingen (gezondheidszorgwetgeving)\n• Uw uitdrukkelijke toestemming (indien van toepassing)\n• Gerechtvaardigd belang (kwaliteitsverbetering, beveiliging)`,
    },
    {
      title: content?.section5?.title || '5. Hoe lang bewaren wij uw gegevens?',
      content: content?.section5?.content || `Medische dossiers worden bewaard conform de wettelijke bewaartermijnen voor gezondheidszorg:\n\n• Patiëntendossiers: minimaal 30 jaar na laatste behandeling\n• Facturatiegegevens: 7 jaar (wettelijke verplichting)\n• Algemene correspondentie: 5 jaar\n\nNa afloop van de bewaartermijn worden de gegevens veilig vernietigd.`,
    },
    {
      title: content?.section6?.title || '6. Met wie delen wij uw gegevens?',
      content: content?.section6?.content || `Uw gegevens kunnen worden gedeeld met:\n\n• Verwijzende artsen en specialisten (met uw toestemming)\n• Mutualiteiten (voor terugbetaling)\n• Overheidsinstanties indien wettelijk verplicht\n\nWij verkopen of verhuren uw gegevens nooit aan derden.`,
    },
    {
      title: content?.section7?.title || '7. Uw rechten',
      content: content?.section7?.content || `Conform de AVG/GDPR heeft u de volgende rechten:\n\n• Recht op inzage: U kunt opvragen welke gegevens wij over u bewaren\n• Recht op rectificatie: U kunt onjuiste gegevens laten corrigeren\n• Recht op vergetelheid: U kunt verzoeken om verwijdering van uw gegevens (binnen wettelijke grenzen)\n• Recht op beperking: U kunt de verwerking laten beperken\n• Recht op overdraagbaarheid: U kunt uw gegevens opvragen in een overdraagbaar formaat\n• Recht op bezwaar: U kunt bezwaar maken tegen bepaalde verwerkingen\n\nOm uw rechten uit te oefenen, kunt u contact met ons opnemen via ${email}.`,
    },
    {
      title: content?.section8?.title || '8. Beveiliging',
      content: content?.section8?.content || `Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, misbruik of ongeoorloofde toegang:\n\n• Beveiligde opslag van digitale gegevens\n• Toegangscontrole tot systemen en dossiers\n• Versleutelde communicatie waar mogelijk\n• Regelmatige back-ups`,
    },
    {
      title: content?.section9?.title || '9. Cookies',
      content: content?.section9?.content || `Onze website maakt gebruik van functionele cookies die noodzakelijk zijn voor de werking van de site. Wij gebruiken geen tracking cookies of analytics zonder uw toestemming.`,
    },
    {
      title: content?.section10?.title || '10. Klachten',
      content: content?.section10?.content || `Indien u een klacht heeft over de verwerking van uw persoonsgegevens, kunt u contact met ons opnemen. U heeft ook het recht om een klacht in te dienen bij de Gegevensbeschermingsautoriteit:\n\nGegevensbeschermingsautoriteit\nDrukpersstraat 35, 1000 Brussel\nwww.gegevensbeschermingsautoriteit.be`,
    },
  ];

  return (
    <PublicLayout footerData={footerData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--rb-primary)] via-[var(--rb-primary-dark)] to-[var(--rb-dark)] overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[var(--rb-accent)]/10 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {heroTitle}
          </h1>
          <p className="text-white/70">{lastUpdated}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-slate-700 leading-relaxed text-lg">{intro}</p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  {section.title}
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-[var(--rb-primary)] font-medium hover:underline"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Terug naar home
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
