import { MetadataRoute } from 'next';
import { prisma } from '@/shared/lib/prisma';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://revabrain.be';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/team`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/treatments`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/disciplines`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/costs`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/verwijzers`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic behandeling pages
  let behandelingPages: MetadataRoute.Sitemap = [];
  try {
    const behandelingen = await prisma.behandeling.findMany({
      where: { actief: true, locale: 'nl' },
      select: { slug: true, laatstGewijzigd: true },
    });

    behandelingPages = behandelingen.map((b) => ({
      url: `${BASE_URL}/treatments/${b.slug}`,
      lastModified: b.laatstGewijzigd,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch {
    // Database not available during build
  }

  // Dynamic discipline pages
  let disciplinePages: MetadataRoute.Sitemap = [];
  try {
    const disciplines = await prisma.disciplineConfig.findMany({
      where: { actief: true },
      select: { code: true, laatstGewijzigd: true },
    });

    disciplinePages = disciplines.map((d: { code: string; laatstGewijzigd: Date }) => ({
      url: `${BASE_URL}/disciplines/${d.code.toLowerCase()}`,
      lastModified: d.laatstGewijzigd,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database not available during build
  }

  return [...staticPages, ...behandelingPages, ...disciplinePages];
}
