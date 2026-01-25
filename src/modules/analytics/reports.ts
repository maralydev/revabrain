'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface TreatmentReportData {
  zorgverlenerId: number;
  zorgverlenerNaam: string;
  totaalAfspraken: number;
  intakes: number;
  consultaties: number;
  huisbezoeken: number;
  afgewerkt: number;
  noShows: number;
  geannuleerd: number;
}

export interface TreatmentReportInput {
  startDatum: Date;
  eindDatum: Date;
  zorgverlenerId?: number;
}

export interface TreatmentReportResult {
  success: boolean;
  error?: string;
  data?: TreatmentReportData[];
}

/**
 * Genereer behandelingen rapport
 */
export async function generateTreatmentReport(
  input: TreatmentReportInput
): Promise<TreatmentReportResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen rapporten genereren' };
    }

    // Haal zorgverleners op
    const whereZorgverlener = input.zorgverlenerId
      ? { id: input.zorgverlenerId }
      : { actief: true };

    const zorgverleners = await prisma.teamlid.findMany({
      where: whereZorgverlener,
      orderBy: [{ achternaam: 'asc' }, { voornaam: 'asc' }],
    });

    const reportData: TreatmentReportData[] = [];

    for (const zorgverlener of zorgverleners) {
      // Tel afspraken per categorie
      const whereBase = {
        zorgverlenerId: zorgverlener.id,
        datum: {
          gte: input.startDatum,
          lte: input.eindDatum,
        },
      };

      const [totaal, intakes, consultaties, huisbezoeken, afgewerkt, noShows, geannuleerd] = await Promise.all([
        prisma.afspraak.count({
          where: { ...whereBase, type: { not: 'ADMIN' } },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, type: 'INTAKE' },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, type: 'CONSULTATIE' },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, type: 'HUISBEZOEK' },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, status: 'AFGEWERKT' },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, status: 'NO_SHOW' },
        }),
        prisma.afspraak.count({
          where: { ...whereBase, status: 'GEANNULEERD' },
        }),
      ]);

      reportData.push({
        zorgverlenerId: zorgverlener.id,
        zorgverlenerNaam: `${zorgverlener.voornaam} ${zorgverlener.achternaam}`,
        totaalAfspraken: totaal,
        intakes,
        consultaties,
        huisbezoeken,
        afgewerkt,
        noShows,
        geannuleerd,
      });
    }

    return {
      success: true,
      data: reportData.filter(d => d.totaalAfspraken > 0), // Only include with appointments
    };
  } catch (error) {
    console.error('Generate treatment report error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
