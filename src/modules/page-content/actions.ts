'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth';
import type { PageContentData } from './queries';

export interface ContentInput {
  page: string;
  section: string;
  locale: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  published?: boolean;
}

/**
 * Create or update page content (upsert)
 */
export async function savePageContent(
  input: ContentInput
): Promise<{ success: boolean; error?: string; data?: PageContentData }> {
  try {
    await requireAdmin();

    const { page, section, locale, title, content, imageUrl, published } = input;

    // Upsert: create if not exists, update if exists
    const result = await (prisma as any).pageContent.upsert({
      where: {
        page_section_locale: { page, section, locale },
      },
      update: {
        title: title ?? null,
        content: content ?? null,
        imageUrl: imageUrl ?? null,
        published: published ?? false,
        laatstGewijzigd: new Date(),
      },
      create: {
        page,
        section,
        locale,
        title: title ?? null,
        content: content ?? null,
        imageUrl: imageUrl ?? null,
        published: published ?? false,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving page content:', error);
    return { success: false, error: 'Failed to save content' };
  }
}

/**
 * Update existing content by ID
 */
export async function updatePageContent(
  id: number,
  input: Partial<ContentInput>
): Promise<{ success: boolean; error?: string; data?: PageContentData }> {
  try {
    await requireAdmin();

    const { title, content, imageUrl, published } = input;

    const result = await (prisma as any).pageContent.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
        laatstGewijzigd: new Date(),
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error updating page content:', error);
    return { success: false, error: 'Failed to update content' };
  }
}

/**
 * Delete page content
 */
export async function deletePageContent(
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();

    await (prisma as any).pageContent.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting page content:', error);
    return { success: false, error: 'Failed to delete content' };
  }
}

/**
 * Toggle published status
 */
export async function togglePublished(
  id: number
): Promise<{ success: boolean; error?: string; published?: boolean }> {
  try {
    await requireAdmin();

    const current = await (prisma as any).pageContent.findUnique({
      where: { id },
    });

    if (!current) {
      return { success: false, error: 'Content not found' };
    }

    const result = await (prisma as any).pageContent.update({
      where: { id },
      data: {
        published: !current.published,
        laatstGewijzigd: new Date(),
      },
    });

    return { success: true, published: result.published };
  } catch (error) {
    console.error('Error toggling published status:', error);
    return { success: false, error: 'Failed to toggle status' };
  }
}

/**
 * Seed initial content structure (admin only)
 */
export async function seedPageContentStructure(): Promise<{ success: boolean; created: number }> {
  try {
    await requireAdmin();

    // Define the page structure
    const pages = [
      { page: 'home', sections: ['hero', 'vision', 'story', 'cta'] },
      { page: 'team', sections: ['intro'] },
      { page: 'costs', sections: ['intro', 'convention', 'homeVisits'] },
      { page: 'contact', sections: ['intro', 'homeVisitsNote'] },
    ];

    const locales = ['nl', 'fr', 'en'];
    let created = 0;

    for (const { page, sections } of pages) {
      for (const section of sections) {
        for (const locale of locales) {
          // Check if exists
          const existing = await (prisma as any).pageContent.findUnique({
            where: { page_section_locale: { page, section, locale } },
          });

          if (!existing) {
            await (prisma as any).pageContent.create({
              data: {
                page,
                section,
                locale,
                title: null,
                content: null,
                imageUrl: null,
                published: false,
              },
            });
            created++;
          }
        }
      }
    }

    return { success: true, created };
  } catch (error) {
    console.error('Error seeding page content:', error);
    return { success: false, created: 0 };
  }
}
