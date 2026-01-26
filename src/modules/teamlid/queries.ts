'use server';

import { Teamlid } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

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
