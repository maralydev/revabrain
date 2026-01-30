'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireZorgverlener } from '@/shared/lib/auth';
import { logAudit } from '@/shared/lib/audit';

export interface ContactInfoData {
  id: number;
  telefoon: string;
  email: string;
  adresStraat: string;
  adresNummer: string;
  adresPostcode: string;
  adresGemeente: string;
  latitude: number | null;
  longitude: number | null;
  openingstijden: string;
}

export interface UpdateContactInfoInput {
  telefoon?: string;
  email?: string;
  adresStraat?: string;
  adresNummer?: string;
  adresPostcode?: string;
  adresGemeente?: string;
  latitude?: number;
  longitude?: number;
  openingstijden?: Record<string, string>;
}

export interface UpdateContactInfoResult {
  success: boolean;
  error?: string;
}

/**
 * Haal contact info op
 */
export async function getContactInfo(): Promise<ContactInfoData | null> {
  try {
    const info = await prisma.contactInfo.findFirst({
      where: { id: 1 },
    });
    return info;
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return null;
  }
}

/**
 * Update contact info (admin only)
 */
export async function updateContactInfo(
  input: UpdateContactInfoInput
): Promise<UpdateContactInfoResult> {
  try {
    const session = await requireZorgverlener();

    // Check admin toegang
    if (!session.isAdmin) {
      return { success: false, error: 'Alleen admins kunnen contact info wijzigen' };
    }

    // Build update data
    const updateData: any = {};
    if (input.telefoon !== undefined) updateData.telefoon = input.telefoon;
    if (input.email !== undefined) updateData.email = input.email;
    if (input.adresStraat !== undefined) updateData.adresStraat = input.adresStraat;
    if (input.adresNummer !== undefined) updateData.adresNummer = input.adresNummer;
    if (input.adresPostcode !== undefined) updateData.adresPostcode = input.adresPostcode;
    if (input.adresGemeente !== undefined) updateData.adresGemeente = input.adresGemeente;
    if (input.latitude !== undefined) updateData.latitude = input.latitude;
    if (input.longitude !== undefined) updateData.longitude = input.longitude;
    if (input.openingstijden !== undefined) {
      updateData.openingstijden = JSON.stringify(input.openingstijden);
    }

    // Upsert (update or insert)
    await prisma.contactInfo.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        telefoon: input.telefoon || '+32 2 123 45 67',
        email: input.email || 'info@revabrain.be',
        adresStraat: input.adresStraat || 'Voorbeeldstraat',
        adresNummer: input.adresNummer || '1',
        adresPostcode: input.adresPostcode || '1000',
        adresGemeente: input.adresGemeente || 'Brussel',
        latitude: input.latitude || 50.8503,
        longitude: input.longitude || 4.3517,
        openingstijden: input.openingstijden
          ? JSON.stringify(input.openingstijden)
          : JSON.stringify({
              ma: '09:00-17:00',
              di: '09:00-17:00',
              wo: '09:00-17:00',
              do: '09:00-17:00',
              vr: '09:00-16:00',
              za: 'Gesloten',
              zo: 'Gesloten',
            }),
      },
    });

    // Audit log
    await logAudit({
      actieType: 'CONFIG_UPDATE',
      entiteitType: 'ContactInfo',
      entiteitId: 1,
      omschrijving: 'Contact informatie bijgewerkt',
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating contact info:', error);
    return { success: false, error: 'Er is een fout opgetreden' };
  }
}
