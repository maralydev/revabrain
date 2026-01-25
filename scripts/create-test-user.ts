import { hash } from 'bcryptjs';
import Database from 'better-sqlite3';

async function main() {
  const db = new Database('./dev.db');

  console.log('🌱 Creating test users...');

  // Hash wachtwoorden
  const adminPassword = await hash('admin123', 12);
  const zorgverlenerPassword = await hash('zorgverlener123', 12);

  // Maak admin aan
  const insertAdmin = db.prepare(`
    INSERT OR REPLACE INTO Teamlid (id, voornaam, achternaam, email, wachtwoord, rol, isAdmin, actief, discipline, aangemaakt, laatstGewijzigd)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  insertAdmin.run(
    1,
    'Admin',
    'RevaBrain',
    'admin@revabrain.be',
    adminPassword,
    'ZORGVERLENER',
    1, // isAdmin = true
    1, // actief = true
    'LOGOPEDIE'
  );

  console.log('✅ Admin aangemaakt: admin@revabrain.be');

  // Maak zorgverlener aan
  const insertZorgverlener = db.prepare(`
    INSERT OR REPLACE INTO Teamlid (id, voornaam, achternaam, email, wachtwoord, rol, isAdmin, actief, discipline, aangemaakt, laatstGewijzigd)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  insertZorgverlener.run(
    2,
    'Sarah',
    'Logopedist',
    'zorgverlener@revabrain.be',
    zorgverlenerPassword,
    'ZORGVERLENER',
    0, // isAdmin = false
    1, // actief = true
    'LOGOPEDIE'
  );

  console.log('✅ Zorgverlener aangemaakt: zorgverlener@revabrain.be');

  console.log('\n📋 Test credentials:');
  console.log('   Admin: admin@revabrain.be / admin123');
  console.log('   Zorgverlener: zorgverlener@revabrain.be / zorgverlener123');

  db.close();
}

main().catch(console.error);
