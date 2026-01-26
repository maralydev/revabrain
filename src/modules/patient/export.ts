'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface PatientExportData {
  persoonlijk: {
    voornaam: string;
    achternaam: string;
    rijksregisternummer: string;
    geboortedatum: string;
    telefoonnummer: string;
    email: string | null;
    adres: {
      straat: string | null;
      huisnummer: string | null;
      postcode: string | null;
      gemeente: string | null;
    };
    contactpersoon: {
      naam: string | null;
      telefoon: string | null;
    };
  };
  afspraken: Array<{
    datum: string;
    duur: number;
    type: string;
    status: string;
    zorgverlener: string;
    notities: string | null;
  }>;
  metadata: {
    exportDatum: string;
    aangemaakt: string;
    laatstGewijzigd: string;
  };
}

export interface ExportPatientResult {
  success: boolean;
  error?: string;
  data?: PatientExportData;
}

/**
 * Exporteer alle gegevens van een patiënt (GDPR inzageverzoek)
 */
export async function exportPatientData(
  patientId: number
): Promise<ExportPatientResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen patiëntgegevens exporteren' };
    }

    // Haal patiënt op met alle gerelateerde data
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        afspraken: {
          include: {
            zorgverlener: {
              select: {
                voornaam: true,
                achternaam: true,
              },
            },
          },
          orderBy: { datum: 'desc' },
        },
      },
    });

    if (!patient) {
      return { success: false, error: 'Patiënt niet gevonden' };
    }

    // Structureer export data
    const exportData: PatientExportData = {
      persoonlijk: {
        voornaam: patient.voornaam,
        achternaam: patient.achternaam,
        rijksregisternummer: patient.rijksregisternummer,
        geboortedatum: patient.geboortedatum.toISOString().split('T')[0],
        telefoonnummer: patient.telefoonnummer,
        email: patient.email,
        adres: {
          straat: patient.straat,
          huisnummer: patient.huisnummer,
          postcode: patient.postcode,
          gemeente: patient.gemeente,
        },
        contactpersoon: {
          naam: patient.contactpersoon,
          telefoon: patient.contactpersoonTelefoon,
        },
      },
      afspraken: patient.afspraken.map((afspraak: any) => ({
        datum: afspraak.datum.toISOString(),
        duur: afspraak.duur,
        type: afspraak.type,
        status: afspraak.status,
        zorgverlener: `${afspraak.zorgverlener.voornaam} ${afspraak.zorgverlener.achternaam}`,
        notities: afspraak.notities,
      })),
      metadata: {
        exportDatum: new Date().toISOString(),
        aangemaakt: patient.aangemaakt.toISOString(),
        laatstGewijzigd: patient.laatstGewijzigd.toISOString(),
      },
    };

    // Log export actie (geen PII in logs)
    console.log('Patient data geëxporteerd', {
      patientId,
      aantalAfspraken: patient.afspraken.length,
      door: session.userId,
    });

    return {
      success: true,
      data: exportData,
    };
  } catch (error) {
    console.error('Export patient error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
