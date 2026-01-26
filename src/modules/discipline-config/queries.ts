'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export interface DisciplineConfigData {
  id: number;
  code: string;
  naam: string;
  beschrijving: string | null;
  actief: boolean;
  volgorde: number;
  aangemaakt: Date;
  laatstGewijzigd: Date;
}

/**
 * Haal alle discipline configs op (admin only)
 */
export async function getAllDisciplineConfigs(): Promise<DisciplineConfigData[]> {
  const session = await requireZorgverlener();

  // Check admin toegang
  if (!session.isAdmin) {
    throw new Error('Alleen admins kunnen disciplines beheren');
  }

  return (prisma as any).disciplineConfig.findMany({
    orderBy: [{ volgorde: 'asc' }, { naam: 'asc' }],
  });
}

/**
 * Haal alle actieve disciplines op (voor publieke site/dropdowns)
 */
export async function getActieveDisciplineConfigs(): Promise<DisciplineConfigData[]> {
  return (prisma as any).disciplineConfig.findMany({
    where: { actief: true },
    orderBy: { volgorde: 'asc' },
  });
}
