'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { ConflictInfo } from './actions';

export type Frequentie = 'WEKELIJKS' | 'TWEEMAAL_PER_WEEK' | 'MAANDELIJKS';

export interface CreateRecurringAfspraakInput {
  patientId: number;
  startDatum: Date;
  duur: 30 | 45 | 60 | 90;
  type: 'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN';
  totaalSessies: number;
  frequentie: Frequentie;
  notities?: string;
}

export interface CreateRecurringAfspraakResult {
  success: boolean;
  error?: string;
  reeksId?: number;
  afspraakIds?: number[];
  conflicts?: ConflictInfo[];
  plannedDates?: Date[];
}

/**
 * Bereken alle datums voor een herhalende reeks
 */
function calculateRecurringDates(
  startDatum: Date,
  totaalSessies: number,
  frequentie: Frequentie
): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDatum);

  for (let i = 0; i < totaalSessies; i++) {
    dates.push(new Date(currentDate));

    // Bereken volgende datum op basis van frequentie
    switch (frequentie) {
      case 'WEKELIJKS':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'TWEEMAAL_PER_WEEK':
        // Elke 3-4 dagen (ongeveer 2x per week)
        currentDate.setDate(currentDate.getDate() + 3);
        break;
      case 'MAANDELIJKS':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
  }

  return dates;
}

/**
 * Check conflicten voor alle geplande datums
 */
async function checkRecurringConflicts(
  zorgverlenerId: number,
  plannedDates: Date[],
  duur: number
): Promise<{ conflicts: ConflictInfo[]; conflictDates: Date[] }> {
  const allConflicts: ConflictInfo[] = [];
  const conflictDates: Date[] = [];

  for (const datum of plannedDates) {
    const eindTijd = new Date(datum.getTime() + duur * 60000);

    const conflicts = await prisma.afspraak.findMany({
      where: {
        zorgverlenerId,
        status: { not: 'GEANNULEERD' },
        OR: [
          {
            AND: [
              { datum: { lte: datum } },
              { datum: { gte: new Date(datum.getTime() - 90 * 60000) } },
            ],
          },
        ],
      },
      include: {
        patient: {
          select: {
            voornaam: true,
            achternaam: true,
          },
        },
      },
    });

    // Filter by actual time overlap
    const overlappingConflicts = conflicts.filter((afspraak: any) => {
      const afspraakEind = new Date(afspraak.datum.getTime() + afspraak.duur * 60000);
      return datum < afspraakEind && eindTijd > afspraak.datum;
    });

    if (overlappingConflicts.length > 0) {
      conflictDates.push(datum);
      overlappingConflicts.forEach((conflict: any) => {
        allConflicts.push({
          id: conflict.id,
          datum: conflict.datum,
          duur: conflict.duur,
          patientNaam: conflict.patient
            ? `${conflict.patient.voornaam} ${conflict.patient.achternaam}`
            : undefined,
        });
      });
    }
  }

  return { conflicts: allConflicts, conflictDates };
}

/**
 * Maak een herhalende reeks afspraken aan
 */
export async function createRecurringAfspraak(
  input: CreateRecurringAfspraakInput
): Promise<CreateRecurringAfspraakResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.patientId || !input.startDatum || !input.totaalSessies || !input.frequentie) {
      return { success: false, error: 'Verplichte velden ontbreken' };
    }

    if (input.totaalSessies < 2 || input.totaalSessies > 52) {
      return { success: false, error: 'Aantal sessies moet tussen 2 en 52 zijn' };
    }

    // Bereken alle datums
    const plannedDates = calculateRecurringDates(
      input.startDatum,
      input.totaalSessies,
      input.frequentie
    );

    // Check conflicten voor alle datums
    const { conflicts, conflictDates } = await checkRecurringConflicts(
      session.userId,
      plannedDates,
      input.duur
    );

    if (conflicts.length > 0) {
      return {
        success: false,
        error: `Er zijn ${conflicts.length} conflicterende afspraken`,
        conflicts,
        plannedDates,
      };
    }

    // Maak herhalende reeks aan
    const reeks = await prisma.herhalendeReeks.create({
      data: {
        totaalSessies: input.totaalSessies,
        frequentie: input.frequentie,
        patientId: input.patientId,
        zorgverlenerId: session.userId,
      },
    });

    // Maak alle afspraken aan
    const afspraakIds: number[] = [];

    for (let i = 0; i < plannedDates.length; i++) {
      const afspraak = await prisma.afspraak.create({
        data: {
          datum: plannedDates[i],
          duur: input.duur,
          type: input.type,
          status: 'TE_BEVESTIGEN',
          notities: input.notities || null,
          patientId: input.patientId,
          zorgverlenerId: session.userId,
          ingeboektDoorId: session.userId,
          herhalendeReeksId: reeks.id,
        },
      });

      afspraakIds.push(afspraak.id);
    }

    console.log('Herhalende reeks aangemaakt', {
      reeksId: reeks.id,
      totaalSessies: input.totaalSessies,
      userId: session.userId,
    });

    return {
      success: true,
      reeksId: reeks.id,
      afspraakIds,
      plannedDates,
    };
  } catch (error) {
    console.error('Create recurring afspraak error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
