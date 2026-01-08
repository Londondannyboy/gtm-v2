import { sql } from './db';

export interface Article {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: string;
  guide_type: string | null;
  hero_asset_url: string | null;
  hero_asset_alt: string | null;
  featured_asset_url: string | null;
  meta_description: string | null;
  word_count: number | null;
  published_at: Date | null;
  created_at: Date | null;
  category: string | null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const results = await sql`
    SELECT id, slug, title, content, excerpt, status, guide_type,
           hero_asset_url, hero_asset_alt, featured_asset_url, meta_description,
           word_count, published_at, created_at, category
    FROM articles
    WHERE slug = ${slug} AND app = 'gtm' AND status = 'published'
    LIMIT 1
  `;
  return results[0] as Article || null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const results = await sql`
    SELECT slug FROM articles
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY published_at DESC NULLS LAST
  `;
  return results.map((r) => (r as { slug: string }).slug);
}

export async function getRelatedArticles(currentSlug: string, guideType?: string, limit = 4): Promise<Article[]> {
  if (guideType) {
    const results = await sql`
      SELECT id, slug, title, content, excerpt, status, guide_type,
             hero_asset_url, hero_asset_alt, featured_asset_url, meta_description,
             word_count, published_at, created_at, category
      FROM articles
      WHERE app = 'gtm' AND status = 'published' AND slug != ${currentSlug}
        AND guide_type = ${guideType}
      ORDER BY published_at DESC NULLS LAST
      LIMIT ${limit}
    `;
    return results as Article[];
  }

  const results = await sql`
    SELECT id, slug, title, content, excerpt, status, guide_type,
           hero_asset_url, hero_asset_alt, featured_asset_url, meta_description,
           word_count, published_at, created_at, category
    FROM articles
    WHERE app = 'gtm' AND status = 'published' AND slug != ${currentSlug}
    ORDER BY published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return results as Article[];
}

export async function getArticlesByType(guideType: string, limit = 20): Promise<Article[]> {
  const results = await sql`
    SELECT id, slug, title, content, excerpt, status, guide_type,
           hero_asset_url, hero_asset_alt, featured_asset_url, meta_description,
           word_count, published_at, created_at, category
    FROM articles
    WHERE app = 'gtm' AND status = 'published' AND guide_type = ${guideType}
    ORDER BY published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return results as Article[];
}

export async function getAllArticles(limit = 50): Promise<Article[]> {
  const results = await sql`
    SELECT id, slug, title, content, excerpt, status, guide_type,
           hero_asset_url, hero_asset_alt, featured_asset_url, meta_description,
           word_count, published_at, created_at, category
    FROM articles
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY published_at DESC NULLS LAST
    LIMIT ${limit}
  `;
  return results as Article[];
}
