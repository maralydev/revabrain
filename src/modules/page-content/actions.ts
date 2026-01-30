'use server';

import { prisma } from '@/shared/lib/prisma';
import { requireAdmin } from '@/shared/lib/auth';
import type { PageContentData } from './queries';

export interface ContentInput {
  page: string;
  section: string;
  locale: string;
  title?: string;
  subtitle?: string;
  content?: string;
  content2?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
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

    const { page, section, locale, title, subtitle, content, content2, imageUrl, buttonText, buttonUrl, published } = input;

    // Upsert: create if not exists, update if exists
    const result = await prisma.pageContent.upsert({
      where: {
        page_section_locale: { page, section, locale },
      },
      update: {
        title: title ?? null,
        subtitle: subtitle ?? null,
        content: content ?? null,
        content2: content2 ?? null,
        imageUrl: imageUrl ?? null,
        buttonText: buttonText ?? null,
        buttonUrl: buttonUrl ?? null,
        published: published ?? false,
        laatstGewijzigd: new Date(),
      },
      create: {
        page,
        section,
        locale,
        title: title ?? null,
        subtitle: subtitle ?? null,
        content: content ?? null,
        content2: content2 ?? null,
        imageUrl: imageUrl ?? null,
        buttonText: buttonText ?? null,
        buttonUrl: buttonUrl ?? null,
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

    const { title, subtitle, content, content2, imageUrl, buttonText, buttonUrl, published } = input;

    const result = await prisma.pageContent.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(content !== undefined && { content }),
        ...(content2 !== undefined && { content2 }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(buttonText !== undefined && { buttonText }),
        ...(buttonUrl !== undefined && { buttonUrl }),
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

    await prisma.pageContent.delete({
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

    const current = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!current) {
      return { success: false, error: 'Content not found' };
    }

    const result = await prisma.pageContent.update({
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

    // Define the complete page structure
    const pages = [
      { page: 'home', sections: ['hero', 'vision', 'disciplines', 'story', 'cta'] },
      { page: 'team', sections: ['hero', 'intro', 'members', 'cta'] },
      { page: 'treatments', sections: ['hero', 'intro', 'list', 'cta'] },
      { page: 'disciplines', sections: ['hero', 'intro', 'list'] },
      { page: 'costs', sections: ['hero', 'intro', 'pricing', 'insurance', 'convention', 'homeVisits', 'cta'] },
      { page: 'contact', sections: ['hero', 'info', 'form', 'map', 'homeVisitsNote'] },
      { page: 'verwijzers', sections: ['hero', 'intro', 'process', 'faq', 'cta'] },
      { page: 'privacy', sections: ['hero', 'content'] },
      { page: 'footer', sections: ['contact', 'hours', 'social', 'legal'] },
    ];

    const locales = ['nl', 'fr', 'en'];
    let created = 0;

    for (const { page, sections } of pages) {
      for (const section of sections) {
        for (const locale of locales) {
          // Check if exists
          const existing = await prisma.pageContent.findUnique({
            where: { page_section_locale: { page, section, locale } },
          });

          if (!existing) {
            await prisma.pageContent.create({
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

/**
 * Quickly add a new section to a page
 */
export async function addSection(
  page: string,
  section: string,
  locale: string = 'nl'
): Promise<{ success: boolean; error?: string; data?: PageContentData }> {
  try {
    await requireAdmin();

    // Check if exists
    const existing = await prisma.pageContent.findUnique({
      where: { page_section_locale: { page, section, locale } },
    });

    if (existing) {
      return { success: false, error: 'Sectie bestaat al' };
    }

    const result = await prisma.pageContent.create({
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

    return { success: true, data: result };
  } catch (error) {
    console.error('Error adding section:', error);
    return { success: false, error: 'Failed to add section' };
  }
}

/**
 * Duplicate content to another locale
 */
export async function duplicateToLocale(
  id: number,
  targetLocale: string
): Promise<{ success: boolean; error?: string; data?: PageContentData }> {
  try {
    await requireAdmin();

    const source = await prisma.pageContent.findUnique({
      where: { id },
    });

    if (!source) {
      return { success: false, error: 'Source content not found' };
    }

    // Check if target already exists
    const existing = await prisma.pageContent.findUnique({
      where: { page_section_locale: { page: source.page, section: source.section, locale: targetLocale } },
    });

    if (existing) {
      return { success: false, error: 'Content already exists for this locale' };
    }

    const result = await prisma.pageContent.create({
      data: {
        page: source.page,
        section: source.section,
        locale: targetLocale,
        title: source.title,
        subtitle: source.subtitle,
        content: source.content,
        content2: source.content2,
        imageUrl: source.imageUrl,
        buttonText: source.buttonText,
        buttonUrl: source.buttonUrl,
        published: false, // Always start as draft when duplicating
      },
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error duplicating content:', error);
    return { success: false, error: 'Failed to duplicate content' };
  }
}
