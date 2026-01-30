'use server';

import { getContactInfo } from '@/modules/contact-config/actions';
import { getPageContent } from '@/modules/page-content/queries';
import { getAllBehandelingen } from '@/modules/behandeling/queries';

export interface FooterData {
  telefoon: string;
  email: string;
  adresStraat: string;
  adresNummer: string;
  adresPostcode: string;
  adresGemeente: string;
  tagline: string;
  copyrightText: string | null;
  customLinks: Array<{ label: string; url: string }>;
  behandelingLinks: Array<{ label: string; url: string }>;
}

/**
 * Haal alle footer data op - contact info + CMS content + behandelingen
 * Gecombineerde query voor efficiënte data loading
 */
export async function getFooterData(): Promise<FooterData> {
  const [contactInfo, footerContent, behandelingen] = await Promise.all([
    getContactInfo(),
    getPageContent('footer', 'nl'),
    getAllBehandelingen('nl'),
  ]);

  // Build behandeling links from database
  const behandelingLinks = behandelingen.slice(0, 4).map((b) => ({
    label: b.title,
    url: `/treatments/${b.slug}`,
  }));

  // Add "Alle behandelingen" link at the end
  if (behandelingen.length > 0) {
    behandelingLinks.push({
      label: 'Alle behandelingen',
      url: '/treatments',
    });
  }

  // Parse custom links from CMS (stored as JSON string)
  let customLinks: Array<{ label: string; url: string }> = [];
  if (footerContent?.links?.content) {
    try {
      customLinks = JSON.parse(footerContent.links.content);
    } catch {
      // Ignore parse errors
    }
  }

  return {
    // Contact info with defaults
    telefoon: contactInfo?.telefoon || '+32 498 68 68 42',
    email: contactInfo?.email || 'info@revabrain.be',
    adresStraat: contactInfo?.adresStraat || 'Voorbeeldstraat',
    adresNummer: contactInfo?.adresNummer || '1',
    adresPostcode: contactInfo?.adresPostcode || '1480',
    adresGemeente: contactInfo?.adresGemeente || 'Tubize',
    // CMS content
    tagline: footerContent?.brand?.content || 'Multidisciplinaire groepspraktijk voor neurologische revalidatie.',
    copyrightText: footerContent?.copyright?.content || null,
    // Links
    customLinks,
    behandelingLinks,
  };
}
