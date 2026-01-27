'use server';

import { Teamlid } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

/**
 * Publieke teamleden data voor de website
 *
 * VEILIGHEID: Geen gevoelige data zoals email, wachtwoord, isAdmin
 * De voornaam+achternaam combinatie dient als unieke key voor React rendering
 */
export interface PublicTeamlid {
  voornaam: string;
  achternaam: string;
  discipline: string | null;
  rol: string;
  bio: string | null;
  foto: string | null;
}

/**
 * Haal alle actieve teamleden op voor de publieke website
 * Geen auth nodig - alleen publieke info wordt geretourneerd
 */
export async function getPublicTeamleden(): Promise<PublicTeamlid[]> {
  const teamleden = await prisma.teamlid.findMany({
    where: {
      actief: true,
      rol: 'ZORGVERLENER', // Alleen zorgverleners tonen op publieke site
    },
    select: {
      // GEEN id - niet nodig voor publieke site, voorkomt data exposure
      voornaam: true,
      achternaam: true,
      discipline: true,
      rol: true,
      bio: true,
      foto: true,
    },
    orderBy: [{ achternaam: 'asc' }, { voornaam: 'asc' }],
  });

  return teamleden;
}

/**
 * Haal publieke teamleden op per discipline
 */
export async function getPublicTeamledenByDiscipline(disciplineCode: string): Promise<PublicTeamlid[]> {
  const teamleden = await prisma.teamlid.findMany({
    where: {
      actief: true,
      discipline: disciplineCode,
      rol: 'ZORGVERLENER',
    },
    select: {
      voornaam: true,
      achternaam: true,
      discipline: true,
      rol: true,
      bio: true,
      foto: true,
    },
    orderBy: [{ achternaam: 'asc' }, { voornaam: 'asc' }],
  });

  return teamleden;
}

/**
 * Haal alle actieve teamleden op (voor agenda view)
 */
export async function getActieveTeamleden(): Promise<Teamlid[]> {
  await requireZorgverlener();

  return prisma.teamlid.findMany({
    where: { actief: true },
    orderBy: [{ achternaam: 'asc' }, { voornaam: 'asc' }],
  });
}

/**
 * Haal alle teamleden op, inclusief inactieve (admin only)
 */
export async function getAllTeamleden(): Promise<Teamlid[]> {
  const session = await requireZorgverlener();

  // Check admin toegang
  if (!session.isAdmin) {
    throw new Error('Alleen admins kunnen alle teamleden bekijken');
  }

  return prisma.teamlid.findMany({
    orderBy: [{ actief: 'desc' }, { achternaam: 'asc' }, { voornaam: 'asc' }],
  });
}
