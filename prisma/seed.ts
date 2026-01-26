import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash wachtwoorden
  const imenePassword = await hash('admin123', 12);

  // Maak Imene Chetti aan (praktijkeigenaar)
  const imene = await prisma.teamlid.upsert({
    where: { email: 'info@revabrain.be' },
    update: {},
    create: {
      voornaam: 'Imene',
      achternaam: 'Chetti',
      email: 'info@revabrain.be',
      wachtwoord: imenePassword,
      rol: 'ZORGVERLENER',
      isAdmin: true,
      actief: true,
      discipline: 'LOGOPEDIE',
      bio: 'Ik ben Imene, logopedist en praktijkeigenaar. In 2020 studeerde ik af als logopedist aan de Universiteit van Gent. Daarna volgde ik nog een master theoretische en experimentele psychologie om mijn kennis rond neurowetenschappen te verbreden. Ik deed afgelopen jaren talrijke ervaring op en volgde bijkomende opleidingen binnen het onderzoeken en behandelen van neurogene spraak-taal en cognitieve communicatiestoornissen. Daarnaast verdiepte ik me ook in slikstoornissen, aangezichtsverlamming en laryngectomie. Ook baby\'s en jonge kindjes met eet en drinkproblemen kunnen bij mij terecht. Als praktijkcoordinator tracht ik de aangename huiselijke sfeer te bewaken en juiste zorgverlening te kunnen toewijzen aan elke client.',
    },
  });

  console.log('Imene Chetti aangemaakt:', imene.email);

  // Contactgegevens
  await prisma.contactInfo.upsert({
    where: { id: 1 },
    update: {
      telefoon: '+32 498 68 68 42',
      email: 'info@revabrain.be',
      adresStraat: 'Rue Des Freres Lefort',
      adresNummer: '171, bus 003',
      adresPostcode: '1840',
      adresGemeente: 'Tubeke',
      latitude: 50.6947,
      longitude: 4.2019,
      openingstijden: JSON.stringify({
        ma: '09:00-18:00',
        di: '09:00-18:00',
        wo: '09:00-18:00',
        do: '09:00-18:00',
        vr: '09:00-18:00',
        za: 'Gesloten',
        zo: 'Gesloten',
      }),
    },
    create: {
      telefoon: '+32 498 68 68 42',
      email: 'info@revabrain.be',
      adresStraat: 'Rue Des Freres Lefort',
      adresNummer: '171, bus 003',
      adresPostcode: '1840',
      adresGemeente: 'Tubeke',
      latitude: 50.6947,
      longitude: 4.2019,
      openingstijden: JSON.stringify({
        ma: '09:00-18:00',
        di: '09:00-18:00',
        wo: '09:00-18:00',
        do: '09:00-18:00',
        vr: '09:00-18:00',
        za: 'Gesloten',
        zo: 'Gesloten',
      }),
    },
  });

  console.log('Contactgegevens aangemaakt');

  // ============================================
  // PAGE CONTENT - Homepage sections
  // ============================================
  const pageContents = [
    // Homepage - Hero
    {
      page: 'home',
      section: 'hero',
      locale: 'nl',
      title: 'Welkom bij RevaBrain - Centrum voor (neurologische) revalidatie',
      subtitle: 'Neurologische Revalidatie',
      content: 'Welkom bij RevaBrain, een multidisciplinaire groepspraktijk in volle ontwikkeling voor neuro- en kinderrevalidatie. Momenteel kunt u bij ons terecht voor logopedische revalidatie van neurogene spraak-taal en cognitieve problemen, slikproblemen en preverbale logopedie.',
      buttonText: 'Maak een afspraak',
      buttonUrl: '/contact',
      published: true,
    },
    // Homepage - Vision
    {
      page: 'home',
      section: 'vision',
      locale: 'nl',
      title: 'Onze Visie',
      subtitle: 'Over ons',
      content: 'RevaBrain is een jonge praktijk in volle ontwikkeling tot een gespecialiseerde groepspraktijk waar u gericht volgens de wetenschappelijke evidentie wordt verder geholpen.',
      content2: 'Wij streven ernaar op één locatie gerichte zorg te bieden, dit zowel voor personen met neurogene aandoeningen als kinderen met taal/ leer en ontwikkelingsproblemen. Momenteel bieden wij specialistische neurologopedische en prelogopedisch onderzoek en therapie aan. Voor ons is het belangrijk dat u geholpen wordt door een therapeut met de juiste kennis en ervaring. Zo zal iedereen in het team binnen zijn discipline ook zijn eigen specialisaties en kwalificaties hebben.',
      imageUrl: '/images/onze-visie.jpg',
      published: true,
    },
    // Homepage - Story
    {
      page: 'home',
      section: 'story',
      locale: 'nl',
      title: 'Ons verhaal',
      subtitle: 'Ontstaan uit passie',
      content: 'Nadat ik 5 mooie jaren ervaring mocht opdoen in een groepspraktijk en diverse ziekenhuizen en revalidatiecentra, besloot ik mijn eigen praktijk op te starten. Verschillende disciplines onder een dak, waarbij zorg voor u gecentraliseerd kan worden is het ultieme doel. Door multidisciplinair samen te werken en overleggen staan wij voor kwalitatieve individuele behandelingen en zorg op maat. Daarnaast zijn regelmatige bijscholingen en intervisies essentieel om up to date te blijven met de nieuwe evidence based literatuur en u zo ook een wetenschappelijk ondersteunde therapie te kunnen bieden.',
      imageUrl: '/images/profiel-imene.jpeg',
      published: true,
    },
    // Homepage - CTA
    {
      page: 'home',
      section: 'cta',
      locale: 'nl',
      title: 'Klaar om te Beginnen?',
      content: 'Neem contact op voor een vrijblijvend gesprek over uw situatie.',
      buttonText: 'Neem Contact Op',
      buttonUrl: '/contact',
      published: true,
    },
    // Homepage - Disciplines intro
    {
      page: 'home',
      section: 'disciplines',
      locale: 'nl',
      title: 'Onze Disciplines',
      subtitle: 'Wat we doen',
      content: 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.',
      published: true,
    },
    // Team page
    {
      page: 'team',
      section: 'hero',
      locale: 'nl',
      title: 'Ons Team',
      content: 'Momenteel bieden wij logopedie aan voor volwassenen met een niet aangeboren hersenletsel of baby\'s en jonge kinderen met eet-en drinkproblemen. Ons team zal snel uitbreiden zodat wij u de optimale zorg kunnen bieden.',
      published: true,
    },
    // Treatments overview
    {
      page: 'treatments',
      section: 'hero',
      locale: 'nl',
      title: 'Waarvoor u bij ons terecht kan',
      subtitle: 'Behandeling mogelijk in het Nederlands, Frans en Engels',
      content: 'U kan bij ons terecht voor gespecialiseerde logopedische diagnostiek en therapie voor zowel neurogene stoornissen als prelogopedie.',
      published: true,
    },
    // Costs page
    {
      page: 'costs',
      section: 'hero',
      locale: 'nl',
      title: 'Tarieven en terugbetaling',
      published: true,
    },
    {
      page: 'costs',
      section: 'convention',
      locale: 'nl',
      title: 'Geconventioneerde praktijk',
      content: 'Wij zijn een geconventioneerde praktijk en volgen de tarieven opgelegd door het RIZIV. Zo geniet u van de maximale wettelijke terugbetaling.',
      published: true,
    },
    {
      page: 'costs',
      section: 'homeVisits',
      locale: 'nl',
      title: 'Huisbezoeken',
      content: 'Voor therapie aan huis rekenen we een verplaatsingsvergoeding van 3 euro per sessie aan. Dit dekt een deeltje van de transportkosten en tijd die wij spenderen aan verplaatsing.',
      published: true,
    },
    // Contact page
    {
      page: 'contact',
      section: 'hero',
      locale: 'nl',
      title: 'Contactgegevens',
      content: 'Neem contact met ons op voor vragen of om een afspraak te maken',
      published: true,
    },
    {
      page: 'contact',
      section: 'homeVisitsNote',
      locale: 'nl',
      content: 'Momenteel zijn enkel huisbezoeken mogelijk in Tubeke, Halle, Sint-Pieters-Leeuw, Beersel, en omliggende gemeenten. Wij streven ernaar u ook zo snel mogelijk in de praktijk te verwelkomen.',
      published: true,
    },
  ];

  for (const content of pageContents) {
    await prisma.pageContent.upsert({
      where: {
        page_section_locale: {
          page: content.page,
          section: content.section,
          locale: content.locale,
        },
      },
      update: content,
      create: content,
    });
  }
  console.log('PageContent aangemaakt:', pageContents.length, 'items');

  // ============================================
  // BEHANDELINGEN
  // ============================================

  // Neurologopedie
  const neurologopedie = await prisma.behandeling.upsert({
    where: { slug_locale: { slug: 'neurologopedie', locale: 'nl' } },
    update: {},
    create: {
      slug: 'neurologopedie',
      locale: 'nl',
      title: 'Neurologopedie',
      description: 'Wanneer de communicatie verstoord wordt door een niet aangeboren hersenletsel kan dit zeer ingrijpend zijn voor de patiënt en zijn omgeving. Wij streven ernaar personen met neurologische communicatiestoornissen te begeleiden doorheen het herstelproces. Als logopedist houden wij ons bezig met het opsporen, onderzoeken en behandelen van spraak-, taal en slikstoornissen ten gevolge van een hersenletsel of hersenaandoening.',
      longDescription: 'Neurologopedie omvat de diagnostiek en behandeling van spraak-, taal-, stem-, en slikstoornissen die ontstaan zijn door neurologische aandoeningen zoals een beroerte (CVA), traumatisch hersenletsel, hersentumoren, of neurodegeneratieve ziekten.',
      color: '#2879D8',
      volgorde: 1,
      actief: true,
    },
  });

  // Neurologopedie aandoeningen
  const neuroAandoeningen = [
    { naam: 'Afasie', beschrijving: 'Taalstoornis waarbij het begrijpen en/of produceren van taal aangetast is na hersenletsel' },
    { naam: 'Spraakapraxie', beschrijving: 'Motorische spraakstoornis waarbij de planning en programmering van spraakbewegingen verstoord is' },
    { naam: 'Dysartrie', beschrijving: 'Spraakstoornis door zwakte of coördinatieproblemen van de spraakspieren' },
    { naam: 'Dysfagie (slikstoornissen)', beschrijving: 'Problemen met slikken van voedsel, drank of speeksel' },
    { naam: 'Cognitieve communicatiestoornissen', beschrijving: 'Communicatieproblemen door stoornissen in aandacht, geheugen of executieve functies' },
    { naam: 'Aangezichtsverlamming', beschrijving: 'Verlamming van de aangezichtsspieren, vaak eenzijdig' },
    { naam: 'Stemproblemen na intubatie', beschrijving: 'Heesheid of stemproblemen na langdurige beademing' },
    { naam: 'Laryngectomie', beschrijving: 'Spraakrevalidatie na verwijdering van het strottenhoofd' },
  ];

  for (let i = 0; i < neuroAandoeningen.length; i++) {
    await prisma.aandoening.upsert({
      where: { id: i + 1 },
      update: { ...neuroAandoeningen[i], behandelingId: neurologopedie.id, volgorde: i + 1 },
      create: { ...neuroAandoeningen[i], behandelingId: neurologopedie.id, volgorde: i + 1, locale: 'nl' },
    });
  }

  // Prelogopedie
  const prelogopedie = await prisma.behandeling.upsert({
    where: { slug_locale: { slug: 'prelogopedie', locale: 'nl' } },
    update: {},
    create: {
      slug: 'prelogopedie',
      locale: 'nl',
      title: 'Prelogopedie',
      description: 'Prelogopedie (ook wel preverbale logopedie) richt zich op eet- en drinkproblemen bij baby\'s en jonge kinderen. Zuigen, slikken en kauwen vormen de basis voor latere spraak- en taalontwikkeling. Wij begeleiden bij problemen met borstvoeding, flesvoeding, de overgang naar vast voedsel, sondevoeding afbouw en voedingsproblemen bij prematuriteit of syndromen.',
      longDescription: 'Prelogopedie (ook wel preverbale logopedie genoemd) richt zich op de mondmotorische ontwikkeling en voedingsvaardigheden van baby\'s en jonge kinderen. De term "pre" verwijst naar de fase vóór het spreken, waarin zuigen, slikken en kauwen zich ontwikkelen als basis voor latere spraak- en taalontwikkeling.',
      extraInfo: 'Wanneer uw baby of jong kind problemen heeft met drinken uit de borst of fles, moeite heeft met de overgang naar vast voedsel, veel huilt bij maaltijden, lang doet over eten, of wanneer er zorgen zijn over gewichtstoename, kan prelogopedische begeleiding helpen.',
      color: '#59ECB7',
      volgorde: 2,
      actief: true,
    },
  });

  // Prelogopedie indicaties
  const prelogIndicaties = [
    { naam: 'Problemen met borstvoeding', beschrijving: 'Moeizaam vasthappen, slecht zuigpatroon' },
    { naam: 'Problemen met flesvoeding', beschrijving: 'Luchthappen, vermoeidheid tijdens voeding' },
    { naam: 'Overgang naar vast voedsel', beschrijving: 'Weigeren, kokhalzen bij vaste voeding' },
    { naam: 'Selectief of kieskeurig eten', beschrijving: 'Beperkt voedselpatroon, textuurproblemen' },
    { naam: 'Verslikken of aspiratie', beschrijving: 'Voedsel of vocht in de luchtwegen' },
    { naam: 'Sondevoeding afbouw', beschrijving: 'Begeleiding bij overgang van sonde naar orale voeding' },
    { naam: 'Voedingsproblemen bij prematuriteit', beschrijving: 'Eet- en drinkproblemen bij te vroeg geboren baby\'s' },
    { naam: 'Voedingsproblemen bij syndromen', beschrijving: 'Down syndroom, Pierre Robin, etc.' },
    { naam: 'Schisis', beschrijving: 'Lip-, kaak- en/of gehemeltespleet' },
    { naam: 'Tongriem problematiek', beschrijving: 'Te korte of te strakke tongband' },
  ];

  const startId = neuroAandoeningen.length + 1;
  for (let i = 0; i < prelogIndicaties.length; i++) {
    await prisma.aandoening.upsert({
      where: { id: startId + i },
      update: { ...prelogIndicaties[i], behandelingId: prelogopedie.id, volgorde: i + 1 },
      create: { ...prelogIndicaties[i], behandelingId: prelogopedie.id, volgorde: i + 1, locale: 'nl' },
    });
  }

  console.log('Behandelingen aangemaakt: neurologopedie, prelogopedie');

  console.log('\nTest credentials:');
  console.log('   Admin: info@revabrain.be / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
