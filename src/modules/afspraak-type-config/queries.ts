'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export interface AfspraakTypeConfigData {
  id: number;
  code: string;
  naam: string;
  kleur: string;
  standaardDuur: number;
  factureerbaar: boolean;
  actief: boolean;
  aangemaakt: Date;
  laatstGewijzigd: Date;
}

/**
 * Haal alle afspraak type configs op (admin only)
 */
export async function getAllAfspraakTypeConfigs(): Promise<AfspraakTypeConfigData[]> {
  const session = await requireZorgverlener();

  // Check admin toegang
  if (!session.isAdmin) {
    throw new Error('Alleen admins kunnen afspraak types beheren');
  }

  return (prisma as any).afspraakTypeConfig.findMany({
    orderBy: [{ actief: 'desc' }, { naam: 'asc' }],
  });
}

/**
 * Haal een specifieke config op via code
 */
export async function getAfspraakTypeConfigByCode(
  code: string
): Promise<AfspraakTypeConfigData | null> {
  return (prisma as any).afspraakTypeConfig.findUnique({
    where: { code },
  });
}

/**
 * Haal alle actieve configs op (voor dropdown gebruik)
 */
export async function getActieveAfspraakTypeConfigs(): Promise<AfspraakTypeConfigData[]> {
  await requireZorgverlener();

  return (prisma as any).afspraakTypeConfig.findMany({
    where: { actief: true },
    orderBy: { naam: 'asc' },
  });
}
