'use server';

import { Afspraak, Patient, Teamlid } from '@prisma/client';
import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';

export type AfspraakWithRelations = Afspraak & {
  patient: Patient | null;
  zorgverlener: Pick<Teamlid, 'id' | 'voornaam' | 'achternaam'>;
};

/**
 * Haal afspraken op voor een specifieke dag
 */
export async function getAfsprakenByDate(datum: Date): Promise<AfspraakWithRelations[]> {
  const session = await requireZorgverlener();

  const startOfDay = new Date(datum);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(datum);
  endOfDay.setHours(23, 59, 59, 999);

  return prisma.afspraak.findMany({
    where: {
      zorgverlenerId: session.userId,
      datum: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      patient: true,
      zorgverlener: {
        select: {
          id: true,
          voornaam: true,
          achternaam: true,
        },
      },
    },
    orderBy: { datum: 'asc' },
  });
}

/**
 * Haal afspraken op voor een week
 */
export async function getAfsprakenByWeek(
  startDatum: Date
): Promise<AfspraakWithRelations[]> {
  const session = await requireZorgverlener();

  const endDatum = new Date(startDatum);
  endDatum.setDate(endDatum.getDate() + 7);

  return prisma.afspraak.findMany({
    where: {
      zorgverlenerId: session.userId,
      datum: {
        gte: startDatum,
        lt: endDatum,
      },
    },
    include: {
      patient: true,
      zorgverlener: {
        select: {
          id: true,
          voornaam: true,
          achternaam: true,
        },
      },
    },
    orderBy: { datum: 'asc' },
  });
}

/**
 * Haal een specifieke afspraak op via ID
 */
export async function getAfspraakById(
  afspraakId: number
): Promise<AfspraakWithRelations | null> {
  const session = await requireZorgverlener();

  const afspraak = await prisma.afspraak.findUnique({
    where: { id: afspraakId },
    include: {
      patient: true,
      zorgverlener: {
        select: {
          id: true,
          voornaam: true,
          achternaam: true,
        },
      },
    },
  });

  if (!afspraak) {
    return null;
  }

  // Check toegang: alleen eigen afspraken (of admin)
  if (afspraak.zorgverlenerId !== session.userId && !session.isAdmin) {
    return null;
  }

  return afspraak;
}
