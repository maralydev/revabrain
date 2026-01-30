'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface UpdateAfspraakTypeConfigInput {
  code: string;
  naam?: string;
  kleur?: string;
  standaardDuur?: number;
  factureerbaar?: boolean;
  actief?: boolean;
}

export interface UpdateAfspraakTypeConfigResult {
  success: boolean;
  error?: string;
}

/**
 * Update een bestaande afspraak type config (admin only)
 * Note: Cannot create new types (enum-based), only modify existing
 */
export async function updateAfspraakTypeConfig(
  input: UpdateAfspraakTypeConfigInput
): Promise<UpdateAfspraakTypeConfigResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen afspraak types wijzigen' };
    }

    // Validatie
    if (!input.code) {
      return { success: false, error: 'Type code is verplicht' };
    }

    // Check if exists
    const existing = await prisma.afspraakTypeConfig.findUnique({
      where: { code: input.code },
    });

    if (!existing) {
      return { success: false, error: 'Afspraak type niet gevonden' };
    }

    // Update
    const updateData: any = {};
    if (input.naam !== undefined) updateData.naam = input.naam;
    if (input.kleur !== undefined) updateData.kleur = input.kleur;
    if (input.standaardDuur !== undefined) updateData.standaardDuur = input.standaardDuur;
    if (input.factureerbaar !== undefined) updateData.factureerbaar = input.factureerbaar;
    if (input.actief !== undefined) updateData.actief = input.actief;

    await prisma.afspraakTypeConfig.update({
      where: { code: input.code },
      data: updateData,
    });

    console.log('Afspraak type config gewijzigd', { code: input.code, door: session.userId });

    return { success: true };
  } catch (error) {
    console.error('Update afspraak type config error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Deactiveer een afspraak type (admin only)
 */
export async function deactivateAfspraakTypeConfig(
  code: string
): Promise<UpdateAfspraakTypeConfigResult> {
  return updateAfspraakTypeConfig({ code, actief: false });
}

/**
 * Activeer een afspraak type (admin only)
 */
export async function activateAfspraakTypeConfig(
  code: string
): Promise<UpdateAfspraakTypeConfigResult> {
  return updateAfspraakTypeConfig({ code, actief: true });
}
