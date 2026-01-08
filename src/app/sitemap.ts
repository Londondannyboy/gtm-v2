import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://gtm.quest';

  // Get all agency slugs
  const agencies = await sql`
    SELECT slug, updated_at FROM companies
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY global_rank NULLS LAST
  `;

  // Get all article slugs
  const articles = await sql`
    SELECT slug, updated_at FROM articles
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY published_at DESC NULLS LAST
  `;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/agencies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/consult`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Location pages
  const locationPages: MetadataRoute.Sitemap = [
    'london', 'new-york', 'san-francisco', 'boston', 'toronto', 'sydney'
  ].map(loc => ({
    url: `${baseUrl}/gtm-agencies-${loc}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Agency pages
  const agencyPages: MetadataRoute.Sitemap = agencies.map((agency) => {
    const a = agency as { slug: string; updated_at: Date };
    return {
      url: `${baseUrl}/agency/${a.slug}`,
      lastModified: a.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  // Article pages
  const articlePages: MetadataRoute.Sitemap = articles.map((article) => {
    const a = article as { slug: string; updated_at: Date };
    return {
      url: `${baseUrl}/articles/${a.slug}`,
      lastModified: a.updated_at || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [
    ...staticPages,
    ...locationPages,
    ...agencyPages,
    ...articlePages,
  ];
}
