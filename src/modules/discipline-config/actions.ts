'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface UpdateDisciplineConfigInput {
  code: string;
  naam?: string;
  beschrijving?: string;
  actief?: boolean;
  volgorde?: number;
}

export interface UpdateDisciplineConfigResult {
  success: boolean;
  error?: string;
}

/**
 * Update een bestaande discipline config (admin only)
 */
export async function updateDisciplineConfig(
  input: UpdateDisciplineConfigInput
): Promise<UpdateDisciplineConfigResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen disciplines wijzigen' };
    }

    // Validatie
    if (!input.code) {
      return { success: false, error: 'Discipline code is verplicht' };
    }

    // Check if exists
    const existing = await (prisma as any).disciplineConfig.findUnique({
      where: { code: input.code },
    });

    if (!existing) {
      return { success: false, error: 'Discipline niet gevonden' };
    }

    // Update
    const updateData: any = {};
    if (input.naam !== undefined) updateData.naam = input.naam;
    if (input.beschrijving !== undefined) updateData.beschrijving = input.beschrijving || null;
    if (input.actief !== undefined) updateData.actief = input.actief;
    if (input.volgorde !== undefined) updateData.volgorde = input.volgorde;

    await (prisma as any).disciplineConfig.update({
      where: { code: input.code },
      data: updateData,
    });

    console.log('Discipline config gewijzigd', { code: input.code, door: session.userId });

    return { success: true };
  } catch (error) {
    console.error('Update discipline config error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}

/**
 * Deactiveer een discipline (admin only)
 */
export async function deactivateDisciplineConfig(
  code: string
): Promise<UpdateDisciplineConfigResult> {
  return updateDisciplineConfig({ code, actief: false });
}

/**
 * Activeer een discipline (admin only)
 */
export async function activateDisciplineConfig(
  code: string
): Promise<UpdateDisciplineConfigResult> {
  return updateDisciplineConfig({ code, actief: true });
}
