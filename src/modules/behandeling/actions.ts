'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth';
import type { BehandelingData, AandoeningData } from './queries';

export interface BehandelingInput {
  slug: string;
  locale: string;
  title: string;
  description: string;
  longDescription?: string;
  extraInfo?: string;
  iconSvg?: string;
  color?: string;
  volgorde?: number;
  actief?: boolean;
}

export interface AandoeningInput {
  naam: string;
  beschrijving?: string;
  locale?: string;
  volgorde?: number;
  behandelingId: number;
}

/**
 * Create or update behandeling
 */
export async function saveBehandeling(
  input: BehandelingInput
): Promise<{ success: boolean; error?: string; data?: BehandelingData }> {
  try {
    await requireAdmin();

    const { slug, locale, title, description, longDescription, extraInfo, iconSvg, color, volgorde, actief } = input;

    const result = await (prisma as any).behandeling.upsert({
      where: {
        slug_locale: { slug, locale },
      },
      update: {
        title,
        description,
        longDescription: longDescription ?? null,
        extraInfo: extraInfo ?? null,
        iconSvg: iconSvg ?? null,
        color: color ?? null,
        volgorde: volgorde ?? 0,
        actief: actief ?? true,
        laatstGewijzigd: new Date(),
      },
      create: {
        slug,
        locale,
        title,
        description,
        longDescription: longDescription ?? null,
        extraInfo: extraInfo ?? null,
        iconSvg: iconSvg ?? null,
        color: color ?? null,
        volgorde: volgorde ?? 0,
        actief: actief ?? true,
      },
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving behandeling:', error);
    return { success: false, error: 'Failed to save behandeling' };
  }
}

/**
 * Update behandeling by ID
 */
export async function updateBehandeling(
  id: number,
  input: Partial<BehandelingInput>
): Promise<{ success: boolean; error?: string; data?: BehandelingData }> {
  try {
    await requireAdmin();

    const result = await (prisma as any).behandeling.update({
      where: { id },
      data: {
        ...input,
        laatstGewijzigd: new Date(),
      },
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating behandeling:', error);
    return { success: false, error: 'Failed to update behandeling' };
  }
}

/**
 * Delete behandeling
 */
export async function deleteBehandeling(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    await (prisma as any).behandeling.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting behandeling:', error);
    return { success: false, error: 'Failed to delete behandeling' };
  }
}

/**
 * Toggle behandeling actief status
 */
export async function toggleBehandelingActief(
  id: number
): Promise<{ success: boolean; error?: string; actief?: boolean }> {
  try {
    await requireAdmin();

    const current = await (prisma as any).behandeling.findUnique({
      where: { id },
    });

    if (!current) {
      return { success: false, error: 'Behandeling not found' };
    }

    const result = await (prisma as any).behandeling.update({
      where: { id },
      data: {
        actief: !current.actief,
        laatstGewijzigd: new Date(),
      },
    });

    return { success: true, actief: result.actief };
  } catch (error) {
    console.error('Error toggling behandeling actief:', error);
    return { success: false, error: 'Failed to toggle status' };
  }
}

// ============================================
// AANDOENING ACTIONS
// ============================================

/**
 * Create aandoening
 */
export async function createAandoening(
  input: AandoeningInput
): Promise<{ success: boolean; error?: string; data?: AandoeningData }> {
  try {
    await requireAdmin();

    const result = await (prisma as any).aandoening.create({
      data: {
        naam: input.naam,
        beschrijving: input.beschrijving ?? null,
        locale: input.locale ?? 'nl',
        volgorde: input.volgorde ?? 0,
        behandelingId: input.behandelingId,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating aandoening:', error);
    return { success: false, error: 'Failed to create aandoening' };
  }
}

/**
 * Update aandoening
 */
export async function updateAandoening(
  id: number,
  input: Partial<AandoeningInput>
): Promise<{ success: boolean; error?: string; data?: AandoeningData }> {
  try {
    await requireAdmin();

    const result = await (prisma as any).aandoening.update({
      where: { id },
      data: input,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating aandoening:', error);
    return { success: false, error: 'Failed to update aandoening' };
  }
}

/**
 * Delete aandoening
 */
export async function deleteAandoening(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    await (prisma as any).aandoening.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting aandoening:', error);
    return { success: false, error: 'Failed to delete aandoening' };
  }
}

/**
 * Reorder aandoeningen
 */
export async function reorderAandoeningen(
  orders: { id: number; volgorde: number }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    for (const { id, volgorde } of orders) {
      await (prisma as any).aandoening.update({
        where: { id },
        data: { volgorde },
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error reordering aandoeningen:', error);
    return { success: false, error: 'Failed to reorder aandoeningen' };
  }
}
