'use server';

import { requireZorgverlener } from '@/shared/lib/auth';
import { prisma } from '@/shared/lib/prisma';

export interface DeletePatientInput {
  patientId: number;
  reden: string;
}

export interface DeletePatientResult {
  success: boolean;
  error?: string;
}

/**
 * Verwijder een patiënt volledig (GDPR recht op vergetelheid)
 *
 * - Alle persoonsgegevens worden permanent verwijderd
 * - Afspraken worden geanonimiseerd (patientId → NULL) voor statistieken
 * - HerhalendeReeks records worden verwijderd
 * - Actie wordt gelogd zonder persoonsgegevens
 */
export async function deletePatient(
  input: DeletePatientInput
): Promise<DeletePatientResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen patiënten verwijderen' };
    }

    // Validatie
    if (!input.patientId || !input.reden) {
      return { success: false, error: 'Patient ID en reden zijn verplicht' };
    }

    if (input.reden.trim().length < 5) {
      return { success: false, error: 'Reden moet minstens 5 karakters bevatten' };
    }

    // Haal patiënt op voor logging (voor PII verwijdering)
    const patient = await prisma.patient.findUnique({
      where: { id: input.patientId },
      select: {
        id: true,
        aangemaakt: true,
      },
    });

    if (!patient) {
      return { success: false, error: 'Patiënt niet gevonden' };
    }

    // Tel afspraken voor logging
    const afspraakCount = await prisma.afspraak.count({
      where: { patientId: input.patientId },
    });

    // Transaction: Anonimiseer afspraken, verwijder herhalende reeksen, verwijder patiënt
    await prisma.$transaction(async (tx: any) => {
      // 1. Anonimiseer afspraken (set patientId to NULL)
      await tx.afspraak.updateMany({
        where: { patientId: input.patientId },
        data: { patientId: null },
      });

      // 2. Verwijder herhalende reeksen
      await tx.herhalendeReeks.deleteMany({
        where: { patientId: input.patientId },
      });

      // 3. Verwijder patiënt (alle PII wordt permanent verwijderd)
      await tx.patient.delete({
        where: { id: input.patientId },
      });
    });

    // Log actie zonder PII
    console.log('Patiënt verwijderd (GDPR)', {
      patientId: input.patientId,
      aantalAfspraken: afspraakCount,
      redenCategorie: input.reden.substring(0, 20), // Alleen eerste 20 chars
      door: session.userId,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Delete patient error:', error);
    return { success: false, error: 'Er is een fout opgetreden bij verwijderen' };
  }
}
