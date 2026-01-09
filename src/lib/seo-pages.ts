import { sql } from './db';

export interface SEOPage {
  id: number;
  slug: string;
  page_type: 'category' | 'location';
  name: string;
  display_name: string | null;
  description: string | null;
  market_highlight: string | null;
  hero_image_url: string | null;
  country: string | null;
  region: string | null;
  timezone: string | null;
  currency: string | null;
  services: string[];
  industries: string[];
  related_pages: string[];
  faqs: { question: string; answer: string }[];
  meta_title: string | null;
  meta_description: string | null;
  status: string;
}

// Get all SEO pages for static generation
export async function getAllSEOPages(): Promise<SEOPage[]> {
  const results = await sql`
    SELECT * FROM seo_pages WHERE status = 'published'
  `;
  return results as SEOPage[];
}

// Get all category pages
export async function getCategoryPages(): Promise<SEOPage[]> {
  const results = await sql`
    SELECT * FROM seo_pages WHERE page_type = 'category' AND status = 'published'
    ORDER BY name
  `;
  return results as SEOPage[];
}

// Get all location pages
export async function getLocationPages(): Promise<SEOPage[]> {
  const results = await sql`
    SELECT * FROM seo_pages WHERE page_type = 'location' AND status = 'published'
    ORDER BY name
  `;
  return results as SEOPage[];
}

// Get a single SEO page by slug
export async function getSEOPageBySlug(slug: string): Promise<SEOPage | null> {
  const results = await sql`
    SELECT * FROM seo_pages WHERE slug = ${slug} AND status = 'published'
    LIMIT 1
  `;
  return (results[0] as SEOPage) || null;
}

// Get related pages for a given page
export async function getRelatedPages(slugs: string[]): Promise<SEOPage[]> {
  if (!slugs || slugs.length === 0) return [];
  const results = await sql`
    SELECT * FROM seo_pages WHERE slug = ANY(${slugs}) AND status = 'published'
  `;
  return results as SEOPage[];
}
