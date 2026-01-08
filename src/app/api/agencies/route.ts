import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location');
  const specialization = searchParams.get('specialization');
  const search = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '20');

  let query;

  if (search) {
    const searchPattern = `%${search}%`;
    query = sql`
      SELECT id, slug, name, description, headquarters, logo_url,
             specializations, service_areas, global_rank, website,
             pricing_model, min_budget, avg_rating, review_count
      FROM companies
      WHERE app = 'gtm' AND status = 'published'
        AND (name ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      ORDER BY global_rank NULLS LAST
      LIMIT ${limit}
    `;
  } else if (location) {
    const locationPattern = `%${location}%`;
    query = sql`
      SELECT id, slug, name, description, headquarters, logo_url,
             specializations, service_areas, global_rank, website,
             pricing_model, min_budget, avg_rating, review_count
      FROM companies
      WHERE app = 'gtm' AND status = 'published'
        AND (headquarters ILIKE ${locationPattern} OR ${location} = ANY(service_areas))
      ORDER BY global_rank NULLS LAST
      LIMIT ${limit}
    `;
  } else if (specialization) {
    query = sql`
      SELECT id, slug, name, description, headquarters, logo_url,
             specializations, service_areas, global_rank, website,
             pricing_model, min_budget, avg_rating, review_count
      FROM companies
      WHERE app = 'gtm' AND status = 'published'
        AND ${specialization} = ANY(specializations)
      ORDER BY global_rank NULLS LAST
      LIMIT ${limit}
    `;
  } else {
    query = sql`
      SELECT id, slug, name, description, headquarters, logo_url,
             specializations, service_areas, global_rank, website,
             pricing_model, min_budget, avg_rating, review_count
      FROM companies
      WHERE app = 'gtm' AND status = 'published'
      ORDER BY global_rank NULLS LAST
      LIMIT ${limit}
    `;
  }

  const agencies = await query;

  return NextResponse.json({
    agencies,
    count: agencies.length,
  });
}
