'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export interface AfwezigheidRecord {
  id: number;
  startDatum: Date;
  eindDatum: Date;
  type: string;
  reden: string | null;
  zorgverlenerId: number;
}

/**
 * Haal afwezigheden op voor een specifieke zorgverlener
 */
export async function getAfwezighedenByZorgverlener(
  zorgverlenerId?: number
): Promise<AfwezigheidRecord[]> {
  const session = await requireZorgverlener();

  const targetId = zorgverlenerId || session.userId;

  // Check toegang
  if (targetId !== session.userId && !session.isAdmin) {
    return [];
  }

  const afwezigheden = await (prisma as any).afwezigheid.findMany({
    where: {
      zorgverlenerId: targetId,
    },
    orderBy: { startDatum: 'desc' },
  } as any); // Type assertion needed

  return afwezigheden as any;
}

/**
 * Haal afwezigheden op voor een periode
 */
export async function getAfwezighedenByPeriod(
  startDatum: Date,
  eindDatum: Date,
  zorgverlenerId?: number
): Promise<AfwezigheidRecord[]> {
  const session = await requireZorgverlener();

  const targetId = zorgverlenerId || session.userId;

  // Check toegang
  if (targetId !== session.userId && !session.isAdmin) {
    return [];
  }

  const afwezigheden = await (prisma as any).afwezigheid.findMany({
    where: {
      zorgverlenerId: targetId,
      OR: [
        {
          // Afwezigheid start binnen periode
          startDatum: {
            gte: startDatum,
            lte: eindDatum,
          },
        },
        {
          // Afwezigheid eindigt binnen periode
          eindDatum: {
            gte: startDatum,
            lte: eindDatum,
          },
        },
        {
          // Afwezigheid omvat hele periode
          AND: [
            { startDatum: { lte: startDatum } },
            { eindDatum: { gte: eindDatum } },
          ],
        },
      ],
    },
    orderBy: { startDatum: 'asc' },
  } as any); // Type assertion needed

  return afwezigheden as any;
}

/**
 * Check of een datum binnen een afwezigheidsperiode valt
 */
export async function isAfwezigOpDatum(
  datum: Date,
  zorgverlenerId: number
): Promise<boolean> {
  const afwezigheid = await (prisma as any).afwezigheid.findFirst({
    where: {
      zorgverlenerId,
      startDatum: { lte: datum },
      eindDatum: { gte: datum },
    },
  } as any); // Type assertion needed

  return !!afwezigheid;
}
