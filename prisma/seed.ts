import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash wachtwoorden
  const adminPassword = await hash('admin123', 12);
  const zorgverlenerPassword = await hash('zorgverlener123', 12);

  // Maak admin aan
  const admin = await prisma.teamlid.upsert({
    where: { email: 'admin@revabrain.be' },
    update: {},
    create: {
      voornaam: 'Admin',
      achternaam: 'RevaBrain',
      email: 'admin@revabrain.be',
      wachtwoord: adminPassword,
      rol: 'ZORGVERLENER',
      isAdmin: true,
      actief: true,
      discipline: 'LOGOPEDIE',
    },
  });

  console.log('✅ Admin aangemaakt:', admin.email);

  // Maak zorgverlener aan
  const zorgverlener = await prisma.teamlid.upsert({
    where: { email: 'zorgverlener@revabrain.be' },
    update: {},
    create: {
      voornaam: 'Sarah',
      achternaam: 'Logopedist',
      email: 'zorgverlener@revabrain.be',
      wachtwoord: zorgverlenerPassword,
      rol: 'ZORGVERLENER',
      isAdmin: false,
      actief: true,
      discipline: 'LOGOPEDIE',
    },
  });

  console.log('✅ Zorgverlener aangemaakt:', zorgverlener.email);

  console.log('\n📋 Test credentials:');
  console.log('   Admin: admin@revabrain.be / admin123');
  console.log('   Zorgverlener: zorgverlener@revabrain.be / zorgverlener123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
