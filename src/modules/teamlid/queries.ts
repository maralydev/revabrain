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
