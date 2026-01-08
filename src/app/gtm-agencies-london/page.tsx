import { Metadata } from 'next';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';
import { AgencyCard } from '@/components/ui/AgencyCard';

const LOCATION = 'London';
const LOCATION_FULL = 'London, UK';

export const metadata: Metadata = {
  title: `Best GTM Agencies in ${LOCATION} (2025) | GTM.quest`,
  description: `Discover top-rated go-to-market agencies in ${LOCATION}. Compare services, specializations, and pricing to find the perfect GTM partner for your business.`,
  openGraph: {
    title: `Best GTM Agencies in ${LOCATION}`,
    description: `Top go-to-market agencies in ${LOCATION} - ranked and reviewed`,
  },
};

async function getAgenciesInLocation(): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (headquarters ILIKE ${'%' + LOCATION + '%'} OR ${LOCATION} = ANY(service_areas))
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

export default async function LondonAgenciesPage() {
  const agencies = await getAgenciesInLocation();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best GTM Agencies in ${LOCATION}`,
    description: `Top-rated go-to-market agencies in ${LOCATION}`,
    itemListElement: agencies.slice(0, 10).map((agency, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Organization',
        name: agency.name,
        url: `https://gtm.quest/agency/${agency.slug}`,
        description: agency.description,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <nav className="text-sm mb-6 opacity-80">
              <Link href="/" className="hover:underline">Home</Link>
              {' / '}
              <Link href="/agencies" className="hover:underline">Agencies</Link>
              {' / '}
              <span>{LOCATION}</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Best GTM Agencies in {LOCATION}
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Discover {agencies.length} top-rated go-to-market agencies in {LOCATION_FULL}.
              Compare services, specializations, and find the perfect GTM partner.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-600">{agencies.length}</div>
                <div className="text-gray-600">Agencies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">
                  {agencies.filter(a => a.global_rank && a.global_rank <= 20).length}
                </div>
                <div className="text-gray-600">Top 20 Ranked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">
                  {new Set(agencies.flatMap(a => a.specializations || [])).size}
                </div>
                <div className="text-gray-600">Specializations</div>
              </div>
            </div>
          </div>
        </section>

        {/* Agency List */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">
            Top GTM Agencies in {LOCATION} (2025)
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} />
            ))}
          </div>

          {agencies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No agencies found in {LOCATION} yet.</p>
              <Link
                href="/agencies"
                className="text-emerald-600 hover:underline"
              >
                View all agencies →
              </Link>
            </div>
          )}
        </section>

        {/* SEO Content */}
        <section className="bg-white border-t py-12">
          <div className="max-w-4xl mx-auto px-4 prose prose-emerald">
            <h2>Why Choose a GTM Agency in {LOCATION}?</h2>
            <p>
              {LOCATION} is home to some of the world&apos;s most innovative go-to-market agencies.
              With deep expertise in B2B SaaS, fintech, and enterprise software, {LOCATION}-based
              GTM agencies offer unique advantages for companies looking to expand in the UK
              and European markets.
            </p>
            <h3>What to Look for in a {LOCATION} GTM Agency</h3>
            <ul>
              <li><strong>Market expertise:</strong> Understanding of UK/EU buyer behavior and regulatory requirements</li>
              <li><strong>Network:</strong> Connections to key decision-makers in your target industries</li>
              <li><strong>Track record:</strong> Proven results with companies similar to yours</li>
              <li><strong>Specialization:</strong> Deep expertise in your specific GTM challenges</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-50 border-t py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
            <p className="text-gray-600 mb-6">
              Our AI advisor can match you with the perfect {LOCATION} GTM agency
              based on your industry, budget, and goals.
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Get AI Recommendations
            </Link>
          </div>
        </section>

        {/* Related Locations */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-4">Explore Other Locations</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/gtm-agencies-new-york" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">New York</Link>
            <Link href="/gtm-agencies-san-francisco" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">San Francisco</Link>
            <Link href="/gtm-agencies-boston" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">Boston</Link>
            <Link href="/gtm-agencies-toronto" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">Toronto</Link>
            <Link href="/gtm-agencies-sydney" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition">Sydney</Link>
          </div>
        </section>
      </main>
    </>
  );
}
