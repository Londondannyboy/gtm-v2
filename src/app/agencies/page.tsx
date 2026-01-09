import { Metadata } from 'next';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';
import { AgencyCard } from '@/components/ui/AgencyCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Top GTM Agencies | GTM.quest',
  description: 'Discover the best go-to-market agencies ranked by expertise, client results, and specializations. Find the perfect GTM partner for your business.',
  openGraph: {
    title: 'Top GTM Agencies',
    description: 'Find the best go-to-market agencies for your business',
  },
};

async function getAgencies(): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

async function getLocations(): Promise<string[]> {
  const results = await sql`
    SELECT DISTINCT headquarters FROM companies
    WHERE app = 'gtm' AND status = 'published' AND headquarters IS NOT NULL
    ORDER BY headquarters
  `;
  return results.map((r) => (r as { headquarters: string }).headquarters);
}

async function getSpecializations(): Promise<string[]> {
  const results = await sql`
    SELECT DISTINCT unnest(specializations) as spec FROM companies
    WHERE app = 'gtm' AND status = 'published'
    ORDER BY spec
    LIMIT 20
  `;
  return results.map((r) => (r as { spec: string }).spec);
}

async function getStats() {
  const result = await sql`
    SELECT
      COUNT(*) as total,
      COUNT(DISTINCT headquarters) as locations,
      AVG(CASE WHEN avg_rating IS NOT NULL THEN avg_rating END) as avg_rating
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
  `;
  return result[0] as { total: string; locations: string; avg_rating: number };
}

export default async function AgenciesPage() {
  const [agencies, locations, specializations, stats] = await Promise.all([
    getAgencies(),
    getLocations(),
    getSpecializations(),
    getStats(),
  ]);

  const topAgencies = agencies.slice(0, 3);
  const remainingAgencies = agencies.slice(3);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white overflow-hidden pt-20">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#hero-grid)"/>
          </svg>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                  🎯 GTM Agency Directory
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Top GTM Agencies
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Discover {stats.total}+ vetted go-to-market agencies. Find the perfect partner
                for demand generation, ABM, and growth strategy.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                  🤖 Get AI Recommendations
                </Link>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
                >
                  📊 Compare Agencies
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{stats.total}</div>
                <div className="text-sm text-white/80">Agencies</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">{stats.locations}</div>
                <div className="text-sm text-white/80">Locations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {stats.avg_rating ? Number(stats.avg_rating).toFixed(1) : '4.5'}
                </div>
                <div className="text-sm text-white/80">Avg Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-zinc-950 border-b border-white/10 sticky top-16 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Location filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-sm text-white/50 shrink-0 font-medium">Location:</span>
            <Link
              href="/agencies"
              className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium shrink-0"
            >
              All ({stats.total})
            </Link>
            {locations.slice(0, 8).map((location) => (
              <Link
                key={location}
                href={`/agencies?location=${encodeURIComponent(location)}`}
                className="bg-white/10 hover:bg-emerald-500/20 hover:text-emerald-400 text-white/70 px-4 py-1.5 rounded-full text-sm shrink-0 transition"
              >
                {location}
              </Link>
            ))}
            {locations.length > 8 && (
              <span className="text-sm text-white/40 shrink-0">+{locations.length - 8} more</span>
            )}
          </div>

          {/* Specialization filters */}
          <div className="flex items-center gap-3 overflow-x-auto pt-2 scrollbar-hide">
            <span className="text-sm text-white/50 shrink-0 font-medium">Focus:</span>
            {specializations.slice(0, 8).map((spec) => (
              <Link
                key={spec}
                href={`/agencies?specialization=${encodeURIComponent(spec)}`}
                className="bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-white/60 px-3 py-1 rounded-full text-sm shrink-0 transition border border-white/10"
              >
                {spec}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agencies */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Top Ranked Agencies
          </h2>
          <Link href="/compare" className="text-emerald-400 hover:underline text-sm font-medium">
            Compare all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {topAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} featured />
          ))}
        </div>
      </section>

      {/* All Agencies */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          All Agencies
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingAgencies.map((agency) => (
            <AgencyCard key={agency.slug} agency={agency} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Not sure which agency is right for you?</h2>
          <p className="text-white/90 mb-8 text-lg">
            Our AI advisor analyzes your industry, budget, and goals to match you with the
            perfect GTM partner in seconds.
          </p>
          <Link
            href="/"
            className="inline-block bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg text-lg"
          >
            Get AI Recommendations
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
