'use server';

import { requireZorgverlener, getSession } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface CreateAfspraakInput {
  patientId: number;
  datum: Date;
  duur: 30 | 45 | 60 | 90;
  type: 'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN';
  notities?: string;
}

export interface CreateAfspraakResult {
  success: boolean;
  error?: string;
  afspraakId?: number;
  conflicts?: ConflictInfo[];
}

export interface UpdateAfspraakInput {
  afspraakId: number;
  patientId?: number;
  datum?: Date;
  duur?: 30 | 45 | 60 | 90;
  type?: 'INTAKE' | 'CONSULTATIE' | 'HUISBEZOEK' | 'ADMIN';
  notities?: string;
}

export interface UpdateAfspraakResult {
  success: boolean;
  error?: string;
  conflicts?: ConflictInfo[];
}

export interface ConflictInfo {
  id: number;
  datum: Date;
  duur: number;
  patientNaam?: string;
}

/**
 * Controleer of er conflicten zijn voor een afspraak
 */
async function checkConflicts(
  zorgverlenerId: number,
  datum: Date,
  duur: number,
  excludeAfspraakId?: number
): Promise<ConflictInfo[]> {
  const eindTijd = new Date(datum.getTime() + duur * 60000);

  const conflicts = await prisma.afspraak.findMany({
    where: {
      zorgverlenerId,
      id: excludeAfspraakId ? { not: excludeAfspraakId } : undefined,
      status: { not: 'GEANNULEERD' },
      OR: [
        {
          // Nieuwe afspraak start tijdens bestaande afspraak
          AND: [
            { datum: { lte: datum } },
            {
              datum: {
                gte: new Date(datum.getTime() - 90 * 60000), // max 90 min overlap check
              },
            },
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

  // Filter conflicts by actual time overlap
  return conflicts
    .filter((afspraak: any) => {
      const afspraakEind = new Date(afspraak.datum.getTime() + afspraak.duur * 60000);
      // Check if there's actual overlap
      return datum < afspraakEind && eindTijd > afspraak.datum;
    })
    .map((afspraak: any) => ({
      id: afspraak.id,
      datum: afspraak.datum,
      duur: afspraak.duur,
      patientNaam: afspraak.patient
        ? `${afspraak.patient.voornaam} ${afspraak.patient.achternaam}`
        : undefined,
    }));
}

/**
 * Maak een nieuwe afspraak aan
 */
export async function createAfspraak(
  input: CreateAfspraakInput
): Promise<CreateAfspraakResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.patientId || !input.datum || !input.duur || !input.type) {
      return { success: false, error: 'Verplichte velden ontbreken' };
    }

    // Check conflicten
    const conflicts = await checkConflicts(session.userId, input.datum, input.duur);

    if (conflicts.length > 0) {
      return {
        success: false,
        error: 'Er zijn conflicterende afspraken',
        conflicts,
      };
    }

    // Maak afspraak aan
    const afspraak = await prisma.afspraak.create({
      data: {
        datum: input.datum,
        duur: input.duur,
        type: input.type,
        status: 'TE_BEVESTIGEN',
        notities: input.notities || null,
        patientId: input.patientId,
        zorgverlenerId: session.userId,
        ingeboektDoorId: session.userId,
      },
    });

    return {
      success: true,
      afspraakId: afspraak.id,
    };
  } catch (error) {
    console.error('Create afspraak error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Update een bestaande afspraak
 */
export async function updateAfspraak(
  input: UpdateAfspraakInput
): Promise<UpdateAfspraakResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.afspraakId) {
      return { success: false, error: 'Afspraak ID ontbreekt' };
    }

    // Haal bestaande afspraak op
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { id: input.afspraakId },
    });

    if (!bestaandeAfspraak) {
      return { success: false, error: 'Afspraak niet gevonden' };
    }

    // Check of zorgverlener toegang heeft (alleen eigen afspraken wijzigen)
    if (bestaandeAfspraak.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afspraak' };
    }

    // Als datum of duur wijzigt: check conflicten
    const nieuweDatum = input.datum || bestaandeAfspraak.datum;
    const nieuweDuur = input.duur || bestaandeAfspraak.duur;

    const datumWijzigt = input.datum && input.datum.getTime() !== bestaandeAfspraak.datum.getTime();
    const duurWijzigt = input.duur && input.duur !== bestaandeAfspraak.duur;

    if (datumWijzigt || duurWijzigt) {
      const conflicts = await checkConflicts(
        bestaandeAfspraak.zorgverlenerId,
        nieuweDatum,
        nieuweDuur,
        input.afspraakId // Exclude current afspraak from conflict check
      );

      if (conflicts.length > 0) {
        return {
          success: false,
          error: 'Er zijn conflicterende afspraken',
          conflicts,
        };
      }
    }

    // Update afspraak
    const updated = await prisma.afspraak.update({
      where: { id: input.afspraakId },
      data: {
        ...(input.patientId && { patientId: input.patientId }),
        ...(input.datum && { datum: input.datum }),
        ...(input.duur && { duur: input.duur }),
        ...(input.type && { type: input.type }),
        ...(input.notities !== undefined && { notities: input.notities || null }),
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Update afspraak error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

export interface CancelAfspraakResult {
  success: boolean;
  error?: string;
}

/**
 * Annuleer een afspraak (zet status op GEANNULEERD)
 * Afspraak blijft zichtbaar in agenda maar doorgestreept/gedimd
 */
export async function cancelAfspraak(
  afspraakId: number
): Promise<CancelAfspraakResult> {
  try {
    const session = await requireZorgverlener();

    // Haal bestaande afspraak op
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { id: afspraakId },
    });

    if (!bestaandeAfspraak) {
      return { success: false, error: 'Afspraak niet gevonden' };
    }

    // Check toegang
    if (bestaandeAfspraak.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afspraak' };
    }

    // Zet status op GEANNULEERD
    await prisma.afspraak.update({
      where: { id: afspraakId },
      data: { status: 'GEANNULEERD' },
    });

    console.log('Afspraak geannuleerd', { id: afspraakId, userId: session.userId });

    return { success: true };
  } catch (error) {
    console.error('Cancel afspraak error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

export interface DeleteAfspraakResult {
  success: boolean;
  error?: string;
}

/**
 * Verwijder een afspraak permanent
 * Logging voor audit trail
 */
export async function deleteAfspraak(
  afspraakId: number
): Promise<DeleteAfspraakResult> {
  try {
    const session = await requireZorgverlener();

    // Haal bestaande afspraak op
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { id: afspraakId },
      include: {
        patient: { select: { voornaam: true, achternaam: true } },
      },
    });

    if (!bestaandeAfspraak) {
      return { success: false, error: 'Afspraak niet gevonden' };
    }

    // Check toegang
    if (bestaandeAfspraak.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afspraak' };
    }

    // Audit log (GEEN PII in logs)
    console.log('Afspraak verwijderd', {
      id: afspraakId,
      datum: bestaandeAfspraak.datum,
      type: bestaandeAfspraak.type,
      deletedBy: session.userId,
    });

    // Permanent delete
    await prisma.afspraak.delete({
      where: { id: afspraakId },
    });

    return { success: true };
  } catch (error) {
    console.error('Delete afspraak error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

export type AfspraakStatus =
  | 'TE_BEVESTIGEN'
  | 'BEVESTIGD'
  | 'IN_WACHTZAAL'
  | 'BINNEN'
  | 'AFGEWERKT'
  | 'NO_SHOW'
  | 'GEANNULEERD';

export interface UpdateAfspraakStatusResult {
  success: boolean;
  error?: string;
}

/**
 * Update de status van een afspraak
 */
export async function updateAfspraakStatus(
  afspraakId: number,
  status: AfspraakStatus
): Promise<UpdateAfspraakStatusResult> {
  try {
    const session = await requireZorgverlener();

    // Haal bestaande afspraak op
    const bestaandeAfspraak = await prisma.afspraak.findUnique({
      where: { id: afspraakId },
    });

    if (!bestaandeAfspraak) {
      return { success: false, error: 'Afspraak niet gevonden' };
    }

    // Check toegang
    if (bestaandeAfspraak.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afspraak' };
    }

    // Update status
    await prisma.afspraak.update({
      where: { id: afspraakId },
      data: { status },
    });

    return { success: true };
  } catch (error) {
    console.error('Update afspraak status error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
