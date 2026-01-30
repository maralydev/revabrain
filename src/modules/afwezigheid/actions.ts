'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export type AfwezigheidType = 'VAKANTIE' | 'ZIEKTE' | 'OPLEIDING' | 'ANDERE';

export interface CreateAfwezigheidInput {
  startDatum: Date;
  eindDatum: Date;
  type: AfwezigheidType;
  reden?: string;
}

export interface CreateAfwezigheidResult {
  success: boolean;
  error?: string;
  afwezigheidId?: number;
  conflictingAfspraken?: number; // Count of conflicting appointments
}

export interface UpdateAfwezigheidInput {
  afwezigheidId: number;
  startDatum?: Date;
  eindDatum?: Date;
  type?: AfwezigheidType;
  reden?: string;
}

export interface UpdateAfwezigheidResult {
  success: boolean;
  error?: string;
}

export interface DeleteAfwezigheidResult {
  success: boolean;
  error?: string;
}

/**
 * Maak een nieuwe afwezigheidsperiode aan
 */
export async function createAfwezigheid(
  input: CreateAfwezigheidInput
): Promise<CreateAfwezigheidResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.startDatum || !input.eindDatum || !input.type) {
      return { success: false, error: 'Verplichte velden ontbreken' };
    }

    if (input.eindDatum < input.startDatum) {
      return { success: false, error: 'Einddatum moet na startdatum liggen' };
    }

    if (input.type === 'ANDERE' && !input.reden) {
      return { success: false, error: 'Reden is verplicht bij type "Andere"' };
    }

    // Check conflicterende afspraken
    const conflictingAfspraken = await prisma.afspraak.count({
      where: {
        zorgverlenerId: session.userId,
        status: { not: 'GEANNULEERD' },
        datum: {
          gte: input.startDatum,
          lte: input.eindDatum,
        },
      },
    });

    // Maak afwezigheid aan
    const afwezigheid = await prisma.afwezigheid.create({
      data: {
        startDatum: input.startDatum,
        eindDatum: input.eindDatum,
        type: input.type,
        reden: input.reden || null,
        zorgverlenerId: session.userId,
      },
    });

    return {
      success: true,
      afwezigheidId: afwezigheid.id,
      conflictingAfspraken: conflictingAfspraken > 0 ? conflictingAfspraken : undefined,
    };
  } catch (error) {
    console.error('Create afwezigheid error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Update een bestaande afwezigheid
 */
export async function updateAfwezigheid(
  input: UpdateAfwezigheidInput
): Promise<UpdateAfwezigheidResult> {
  try {
    const session = await requireZorgverlener();

    // Validatie
    if (!input.afwezigheidId) {
      return { success: false, error: 'Afwezigheid ID ontbreekt' };
    }

    // Haal bestaande afwezigheid op
    const bestaandeAfwezigheid = await prisma.afwezigheid.findUnique({
      where: { id: input.afwezigheidId },
    });

    if (!bestaandeAfwezigheid) {
      return { success: false, error: 'Afwezigheid niet gevonden' };
    }

    // Check toegang
    if (bestaandeAfwezigheid.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afwezigheid' };
    }

    // Validatie datum
    const nieuwStartDatum = input.startDatum || bestaandeAfwezigheid.startDatum;
    const nieuwEindDatum = input.eindDatum || bestaandeAfwezigheid.eindDatum;

    if (nieuwEindDatum < nieuwStartDatum) {
      return { success: false, error: 'Einddatum moet na startdatum liggen' };
    }

    // Update afwezigheid
    await prisma.afwezigheid.update({
      where: { id: input.afwezigheidId },
      data: {
        ...(input.startDatum && { startDatum: input.startDatum }),
        ...(input.eindDatum && { eindDatum: input.eindDatum }),
        ...(input.type && { type: input.type }),
        ...(input.reden !== undefined && { reden: input.reden || null }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Update afwezigheid error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Verwijder een afwezigheid
 */
export async function deleteAfwezigheid(
  afwezigheidId: number
): Promise<DeleteAfwezigheidResult> {
  try {
    const session = await requireZorgverlener();

    // Haal bestaande afwezigheid op
    const bestaandeAfwezigheid = await prisma.afwezigheid.findUnique({
      where: { id: afwezigheidId },
    });

    if (!bestaandeAfwezigheid) {
      return { success: false, error: 'Afwezigheid niet gevonden' };
    }

    // Check toegang
    if (bestaandeAfwezigheid.zorgverlenerId !== session.userId && !session.isAdmin) {
      return { success: false, error: 'Geen toegang tot deze afwezigheid' };
    }

    // Delete
    await prisma.afwezigheid.delete({
      where: { id: afwezigheidId },
    });

    console.log('Afwezigheid verwijderd', { id: afwezigheidId, userId: session.userId });

    return { success: true };
  } catch (error) {
    console.error('Delete afwezigheid error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
