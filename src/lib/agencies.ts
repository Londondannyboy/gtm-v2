import { sql } from './db';

export interface Agency {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  headquarters: string | null;
  logo_url: string | null;
  hero_asset_url: string | null;
  specializations: string[] | null;
  service_areas: string[] | null;
  category_tags: string[] | null;
  global_rank: number | null;
  founded_year: number | null;
  employee_count: number | null;
  website: string | null;
  pricing_model: string | null;
  min_budget: number | null;
  status: string;
  meta_description: string | null;
  overview: string | null;
  key_services: string[] | null;
  avg_rating: number | null;
  review_count: number | null;
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE slug = ${slug} AND app = 'gtm' AND status = 'published'
    LIMIT 1
  `;
  return results[0] as Agency || null;
}

export async function getAllAgencySlugs(): Promise<string[]> {
  const results = await sql`
    SELECT slug FROM companies
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY global_rank NULLS LAST
  `;
  return results.map((r) => (r as { slug: string }).slug);
}

export async function getRelatedAgencies(currentSlug: string, limit = 6): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published' AND slug != ${currentSlug}
    ORDER BY global_rank NULLS LAST
    LIMIT ${limit}
  `;
  return results as Agency[];
}

export async function getAgenciesByLocation(location: string, limit = 20): Promise<Agency[]> {
  const locationPattern = `%${location}%`;
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (headquarters ILIKE ${locationPattern} OR ${location} = ANY(service_areas))
    ORDER BY global_rank NULLS LAST
    LIMIT ${limit}
  `;
  return results as Agency[];
}

export async function searchAgencies(query: string, limit = 20): Promise<Agency[]> {
  const searchPattern = `%${query}%`;
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
    ORDER BY global_rank NULLS LAST
    LIMIT ${limit}
  `;
  return results as Agency[];
}
