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
