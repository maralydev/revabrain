import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { hash } from 'bcryptjs';

// Secret key for one-time seed - change or remove after use
const SEED_SECRET = 'revabrain-seed-2024';

export async function POST(request: Request) {
  try {
    // Check secret
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== SEED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if already seeded
    const existingAdmin = await prisma.teamlid.findFirst({
      where: { isAdmin: true },
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Database already seeded',
        admin: existingAdmin.email
      });
    }

    // Hash password
    const hashedPassword = await hash('admin123', 12);

    // Create admin user
    const admin = await prisma.teamlid.create({
      data: {
        voornaam: 'Imene',
        achternaam: 'Chetti',
        email: 'info@revabrain.be',
        wachtwoord: hashedPassword,
        rol: 'ZORGVERLENER',
        isAdmin: true,
        actief: true,
        discipline: 'LOGOPEDIE',
        bio: 'Praktijkeigenaar en logopedist gespecialiseerd in neurologopedie.',
      },
    });

    // Create contact info
    await prisma.contactInfo.upsert({
      where: { id: 1 },
      update: {},
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

    // Create page content
    const pageContents = [
      {
        page: 'home',
        section: 'hero',
        locale: 'nl',
        title: 'Welkom bij RevaBrain - Centrum voor (neurologische) revalidatie',
        subtitle: 'Neurologische Revalidatie',
        content: 'Welkom bij RevaBrain, een multidisciplinaire groepspraktijk in volle ontwikkeling voor neuro- en kinderrevalidatie.',
        buttonText: 'Maak een afspraak',
        buttonUrl: '/contact',
        published: true,
      },
      {
        page: 'home',
        section: 'vision',
        locale: 'nl',
        title: 'Onze Visie',
        subtitle: 'Over ons',
        content: 'RevaBrain is een jonge praktijk in volle ontwikkeling tot een gespecialiseerde groepspraktijk.',
        content2: 'Wij streven ernaar op één locatie gerichte zorg te bieden.',
        imageUrl: '/images/onze-visie.jpg',
        published: true,
      },
      {
        page: 'home',
        section: 'story',
        locale: 'nl',
        title: 'Ons verhaal',
        subtitle: 'Ontstaan uit passie',
        content: 'Nadat ik 5 mooie jaren ervaring mocht opdoen, besloot ik mijn eigen praktijk op te starten.',
        imageUrl: '/images/profiel-imene.jpeg',
        published: true,
      },
      {
        page: 'home',
        section: 'cta',
        locale: 'nl',
        title: 'Klaar om te Beginnen?',
        content: 'Neem contact op voor een vrijblijvend gesprek.',
        buttonText: 'Neem Contact Op',
        buttonUrl: '/contact',
        published: true,
      },
      {
        page: 'home',
        section: 'disciplines',
        locale: 'nl',
        title: 'Onze Disciplines',
        subtitle: 'Wat we doen',
        content: 'Multidisciplinaire zorg voor volwassenen met hersenletsel en kinderen met ontwikkelingsproblemen.',
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

    // Create behandelingen
    const neurologopedie = await prisma.behandeling.upsert({
      where: { slug_locale: { slug: 'neurologopedie', locale: 'nl' } },
      update: {},
      create: {
        slug: 'neurologopedie',
        locale: 'nl',
        title: 'Neurologopedie',
        description: 'Diagnostiek en behandeling van spraak-, taal- en slikstoornissen na hersenletsel.',
        color: '#2879D8',
        volgorde: 1,
        actief: true,
      },
    });

    const prelogopedie = await prisma.behandeling.upsert({
      where: { slug_locale: { slug: 'prelogopedie', locale: 'nl' } },
      update: {},
      create: {
        slug: 'prelogopedie',
        locale: 'nl',
        title: 'Prelogopedie',
        description: 'Eet- en drinkproblemen bij baby\'s en jonge kinderen.',
        color: '#59ECB7',
        volgorde: 2,
        actief: true,
      },
    });

    // Create aandoeningen
    const neuroAandoeningen = [
      'Afasie', 'Spraakapraxie', 'Dysartrie', 'Dysfagie',
      'Cognitieve communicatiestoornissen', 'Aangezichtsverlamming'
    ];

    for (let i = 0; i < neuroAandoeningen.length; i++) {
      await prisma.aandoening.create({
        data: {
          naam: neuroAandoeningen[i],
          locale: 'nl',
          volgorde: i + 1,
          behandelingId: neurologopedie.id,
        },
      });
    }

    const prelogIndicaties = [
      'Problemen met borstvoeding', 'Problemen met flesvoeding',
      'Overgang naar vast voedsel', 'Selectief eten', 'Sondevoeding afbouw'
    ];

    for (let i = 0; i < prelogIndicaties.length; i++) {
      await prisma.aandoening.create({
        data: {
          naam: prelogIndicaties[i],
          locale: 'nl',
          volgorde: i + 1,
          behandelingId: prelogopedie.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      admin: admin.email,
      password: 'admin123',
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({
      error: 'Seed failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
