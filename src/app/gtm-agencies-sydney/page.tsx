import { Metadata } from 'next';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';
import { AgencyCard } from '@/components/ui/AgencyCard';

const LOCATION = 'Sydney';

export const metadata: Metadata = {
  title: `Best GTM Agencies in ${LOCATION} (2025) | GTM.quest`,
  description: `Discover top-rated go-to-market agencies in ${LOCATION}. Compare services and find the perfect GTM partner.`,
};

async function getAgenciesInLocation(): Promise<Agency[]> {
  const pattern = `%${LOCATION}%`;
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (headquarters ILIKE ${pattern} OR ${LOCATION} = ANY(service_areas))
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

export default async function Page() {
  const agencies = await getAgenciesInLocation();
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <nav className="text-sm mb-6 opacity-80">
            <Link href="/" className="hover:underline">Home</Link>
            {' / '}
            <Link href="/agencies" className="hover:underline">Agencies</Link>
            {' / '}
            <span>{LOCATION}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Best GTM Agencies in {LOCATION}</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Discover {agencies.length} top-rated go-to-market agencies in {LOCATION}.
          </p>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} />
          ))}
        </div>
        {agencies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No agencies found in {LOCATION} yet.</p>
            <Link href="/agencies" className="text-emerald-600 hover:underline">
              View all agencies →
            </Link>
          </div>
        )}
      </section>
      <section className="bg-emerald-50 border-t py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
          <p className="text-gray-600 mb-6">Our AI advisor can match you with the perfect GTM agency.</p>
          <Link
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition"
          >
            Get AI Recommendations
          </Link>
        </div>
      </section>
    </main>
  );
}
