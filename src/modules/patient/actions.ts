'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';
import { logAudit } from '@/shared/lib/audit';
import {
  valideerRijksregisternummer,
  geboortedatumUitRR,
  geslachtUitRR,
} from '@/shared/utils/rijksregisternummer';

export interface RegisterPatientInput {
  rijksregisternummer: string;
  voornaam: string;
  achternaam: string;
  telefoonnummer: string;
  email?: string;
  straat?: string;
  huisnummer?: string;
  postcode?: string;
  gemeente?: string;
  contactpersoon?: string;
  contactpersoonTelefoon?: string;
}

export interface RegisterPatientResult {
  success: boolean;
  error?: string;
  patientId?: number;
}

/**
 * Registreer een nieuwe patiënt met RR validatie
 * PRIVACY: RR wordt NOOIT gelogd in plaintext
 */
export async function registerPatient(
  input: RegisterPatientInput
): Promise<RegisterPatientResult> {
  try {
    // Auth check
    await requireZorgverlener();

    // Validatie
    if (!input.rijksregisternummer || !input.voornaam || !input.achternaam || !input.telefoonnummer) {
      return { success: false, error: 'Verplichte velden ontbreken' };
    }

    // RR validatie (Belgische checksum mod 97)
    const rrSchoon = input.rijksregisternummer.replace(/\D/g, '');

    if (!valideerRijksregisternummer(rrSchoon)) {
      return { success: false, error: 'Ongeldig rijksregisternummer (checksum fout)' };
    }

    // Automatisch afleiden geboortedatum en geslacht
    const geboortedatum = geboortedatumUitRR(rrSchoon);
    const geslacht = geslachtUitRR(rrSchoon);

    if (!geboortedatum) {
      return { success: false, error: 'Kan geboortedatum niet afleiden uit RR' };
    }

    // Check dubbele RR
    const bestaandePatient = await prisma.patient.findUnique({
      where: { rijksregisternummer: rrSchoon },
    });

    if (bestaandePatient) {
      return {
        success: false,
        error: 'Deze patiënt bestaat al in het systeem',
      };
    }

    // Maak patiënt aan (dataminimalisatie: alleen noodzakelijke velden)
    const patient = await prisma.patient.create({
      data: {
        rijksregisternummer: rrSchoon,
        voornaam: input.voornaam.trim(),
        achternaam: input.achternaam.trim(),
        geboortedatum,
        telefoonnummer: input.telefoonnummer.trim(),
        email: input.email?.trim() || null,
        straat: input.straat?.trim() || null,
        huisnummer: input.huisnummer?.trim() || null,
        postcode: input.postcode?.trim() || null,
        gemeente: input.gemeente?.trim() || null,
        contactpersoon: input.contactpersoon?.trim() || null,
        contactpersoonTelefoon: input.contactpersoonTelefoon?.trim() || null,
      },
    });

    // Audit log (GEEN PII - geen RR loggen)
    await logAudit({
      actieType: 'PATIENT_CREATE',
      entiteitType: 'Patient',
      entiteitId: patient.id,
      omschrijving: `Patiënt aangemaakt: ${patient.voornaam} ${patient.achternaam}`,
    });

    return {
      success: true,
      patientId: patient.id,
    };
  } catch (error) {
    console.error('Patient registration error:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
