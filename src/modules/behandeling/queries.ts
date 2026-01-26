'use server';

import { prisma } from '@/shared/lib/prisma';

export interface AandoeningData {
  id: number;
  naam: string;
  beschrijving: string | null;
  locale: string;
  volgorde: number;
  behandelingId: number;
}

export interface BehandelingData {
  id: number;
  slug: string;
  locale: string;
  title: string;
  description: string;
  longDescription: string | null;
  extraInfo: string | null;
  iconSvg: string | null;
  color: string | null;
  volgorde: number;
  actief: boolean;
  aangemaakt: Date;
  laatstGewijzigd: Date;
  aandoeningen: AandoeningData[];
}

/**
 * Get all behandelingen for a locale
 */
export async function getAllBehandelingen(
  locale: string = 'nl'
): Promise<BehandelingData[]> {
  try {
    const behandelingen = await (prisma as any).behandeling.findMany({
      where: { locale, actief: true },
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
      orderBy: { volgorde: 'asc' },
    });
    return behandelingen;
  } catch (error) {
    console.error('Error fetching behandelingen:', error);
    return [];
  }
}

/**
 * Get a specific behandeling by slug
 */
export async function getBehandelingBySlug(
  slug: string,
  locale: string = 'nl'
): Promise<BehandelingData | null> {
  try {
    const behandeling = await (prisma as any).behandeling.findUnique({
      where: {
        slug_locale: { slug, locale },
      },
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
    });
    return behandeling;
  } catch (error) {
    console.error('Error fetching behandeling:', error);
    return null;
  }
}

/**
 * Get all behandelingen for admin (including inactive)
 */
export async function getAllBehandelingenAdmin(): Promise<BehandelingData[]> {
  try {
    const behandelingen = await (prisma as any).behandeling.findMany({
      include: {
        aandoeningen: {
          orderBy: { volgorde: 'asc' },
        },
      },
      orderBy: [{ locale: 'asc' }, { volgorde: 'asc' }],
    });
    return behandelingen;
  } catch (error) {
    console.error('Error fetching behandelingen for admin:', error);
    return [];
  }
}
