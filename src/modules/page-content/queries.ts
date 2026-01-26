'use server';

import { prisma } from '@/shared/lib/prisma';

export interface PageContentData {
  id: number;
  page: string;
  section: string;
  locale: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  content2: string | null;
  imageUrl: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  published: boolean;
  aangemaakt: Date;
  laatstGewijzigd: Date;
}

/**
 * Get all page content entries
 */
export async function getAllPageContent(): Promise<PageContentData[]> {
  try {
    const content = await (prisma as any).pageContent.findMany({
      orderBy: [{ page: 'asc' }, { section: 'asc' }, { locale: 'asc' }],
    });
    return content;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return [];
  }
}

/**
 * Get page content for a specific page and locale
 */
export async function getPageContent(
  page: string,
  locale: string = 'nl'
): Promise<Record<string, PageContentData>> {
  try {
    const content = await (prisma as any).pageContent.findMany({
      where: { page, locale, published: true },
    });

    // Convert to a section-keyed object for easy access
    const result: Record<string, PageContentData> = {};
    for (const item of content) {
      result[item.section] = item;
    }
    return result;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return {};
  }
}

/**
 * Get a specific content entry
 */
export async function getContentById(id: number): Promise<PageContentData | null> {
  try {
    return await (prisma as any).pageContent.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching content by id:', error);
    return null;
  }
}

/**
 * Get content for preview (including unpublished)
 */
export async function getPageContentPreview(
  page: string,
  locale: string = 'nl'
): Promise<Record<string, PageContentData>> {
  try {
    const content = await (prisma as any).pageContent.findMany({
      where: { page, locale },
    });

    const result: Record<string, PageContentData> = {};
    for (const item of content) {
      result[item.section] = item;
    }
    return result;
  } catch (error) {
    console.error('Error fetching page content preview:', error);
    return {};
  }
}
