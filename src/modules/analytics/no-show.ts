'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface NoShowStats {
  totaalAfspraken: number;
  totaalNoShows: number;
  noShowPercentage: number;
}

export interface PatientNoShowInfo {
  patientId: number;
  patientNaam: string;
  noShowCount: number;
  totaalAfspraken: number;
  laatsteNoShow: Date | null;
}

export interface NoShowAnalysisInput {
  startDatum: Date;
  eindDatum: Date;
  zorgverlenerId?: number;
}

export interface NoShowAnalysisResult {
  success: boolean;
  error?: string;
  stats?: NoShowStats;
  patienten?: PatientNoShowInfo[];
}

/**
 * Analyseer no-shows voor een periode
 */
export async function analyzeNoShows(
  input: NoShowAnalysisInput
): Promise<NoShowAnalysisResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen no-show analyses bekijken' };
    }

    const whereClause: any = {
      datum: {
        gte: input.startDatum,
        lte: input.eindDatum,
      },
      type: { not: 'ADMIN' }, // Exclude admin blocks
    };

    // Filter op zorgverlener indien opgegeven
    if (input.zorgverlenerId) {
      whereClause.zorgverlenerId = input.zorgverlenerId;
    }

    // Tel totaal afspraken in periode
    const totaalAfspraken = await prisma.afspraak.count({
      where: {
        ...whereClause,
        status: { notIn: ['GEANNULEERD'] }, // Exclude cancelled
      },
    });

    // Tel no-shows
    const totaalNoShows = await prisma.afspraak.count({
      where: {
        ...whereClause,
        status: 'NO_SHOW',
      },
    });

    // Bereken percentage
    const noShowPercentage = totaalAfspraken > 0
      ? Math.round((totaalNoShows / totaalAfspraken) * 100 * 10) / 10
      : 0;

    // Haal patiënten op met no-shows
    const noShowAfspraken = await prisma.afspraak.findMany({
      where: {
        ...whereClause,
        status: 'NO_SHOW',
        patientId: { not: null }, // Exclude anonymized
      },
      include: {
        patient: {
          select: {
            id: true,
            voornaam: true,
            achternaam: true,
          },
        },
      },
      orderBy: { datum: 'desc' },
    });

    // Groepeer per patiënt
    const patientMap = new Map<number, PatientNoShowInfo>();

    for (const afspraak of noShowAfspraken as any[]) {
      if (!afspraak.patient) continue;

      const patientId = afspraak.patient.id;
      const existing = patientMap.get(patientId);

      if (existing) {
        existing.noShowCount++;
        if (!existing.laatsteNoShow || afspraak.datum > existing.laatsteNoShow) {
          existing.laatsteNoShow = afspraak.datum;
        }
      } else {
        // Tel totaal afspraken voor deze patiënt
        const totaal = await prisma.afspraak.count({
          where: {
            patientId,
            datum: {
              gte: input.startDatum,
              lte: input.eindDatum,
            },
            status: { notIn: ['GEANNULEERD'] },
          },
        });

        patientMap.set(patientId, {
          patientId,
          patientNaam: `${afspraak.patient.voornaam} ${afspraak.patient.achternaam}`,
          noShowCount: 1,
          totaalAfspraken: totaal,
          laatsteNoShow: afspraak.datum,
        });
      }
    }

    // Convert map to array en sorteer op no-show count
    const patienten = Array.from(patientMap.values())
      .sort((a, b) => b.noShowCount - a.noShowCount);

    return {
      success: true,
      stats: {
        totaalAfspraken,
        totaalNoShows,
        noShowPercentage,
      },
      patienten,
    };
  } catch (error) {
    console.error('Analyze no-shows error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
