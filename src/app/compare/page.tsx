import { Metadata } from 'next';
import Link from 'next/link';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';

export const metadata: Metadata = {
  title: 'Compare GTM Agencies | GTM.quest',
  description: 'Compare top go-to-market agencies side by side. Compare services, pricing, specializations, and client reviews.',
};

async function getTopAgencies(): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published' AND global_rank IS NOT NULL
    ORDER BY global_rank ASC
    LIMIT 20
  `;
  return results as Agency[];
}

export default async function ComparePage() {
  const agencies = await getTopAgencies();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link href="/agencies" className="text-emerald-600 hover:underline text-sm mb-4 inline-block">
            ← Back to all agencies
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Compare GTM Agencies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Compare top-ranked go-to-market agencies side by side. Evaluate their specializations,
            pricing, and services to find the perfect match.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                    Agency
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Rank
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Location
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Specializations
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Min Budget
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Team Size
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    Rating
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {agencies.map((agency, i) => (
                  <tr
                    key={agency.slug}
                    className={`hover:bg-gray-50 transition ${i < 3 ? 'bg-emerald-50/50' : ''}`}
                  >
                    {/* Agency Name */}
                    <td className="px-6 py-4 sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          {agency.logo_url ? (
                            <img src={agency.logo_url} alt="" className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="font-bold text-gray-400">{agency.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/agency/${agency.slug}`}
                            className="font-medium text-gray-900 hover:text-emerald-600"
                          >
                            {agency.name}
                          </Link>
                        </div>
                      </div>
                    </td>

                    {/* Rank */}
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                        agency.global_rank === 1 ? 'bg-amber-100 text-amber-700' :
                        agency.global_rank === 2 ? 'bg-gray-200 text-gray-700' :
                        agency.global_rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {agency.global_rank}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {agency.headquarters || 'Remote'}
                    </td>

                    {/* Specializations */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {agency.specializations?.slice(0, 2).map((spec) => (
                          <span
                            key={spec}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                          >
                            {spec}
                          </span>
                        ))}
                        {agency.specializations && agency.specializations.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{agency.specializations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Min Budget */}
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {agency.min_budget ? (
                        <span className="text-gray-900 font-medium">
                          ${agency.min_budget.toLocaleString()}/mo
                        </span>
                      ) : (
                        <span className="text-gray-400">Contact</span>
                      )}
                    </td>

                    {/* Team Size */}
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {agency.employee_count ? `${agency.employee_count}+` : '-'}
                    </td>

                    {/* Rating */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agency.avg_rating ? (
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400">★</span>
                          <span className="text-sm font-medium">{Number(agency.avg_rating).toFixed(1)}</span>
                          {agency.review_count && (
                            <span className="text-xs text-gray-400">({agency.review_count})</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/agency/${agency.slug}`}
                        className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-emerald-50 rounded"></span>
            <span>Top 3 ranked</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-amber-100 rounded-full"></span>
            <span>#1 Agency</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-50 border-t py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Need personalized recommendations?</h2>
          <p className="text-gray-600 mb-6">
            Our AI advisor can match you with the perfect agency based on your specific needs.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Get AI Recommendations
            </Link>
            <Link
              href="/consult"
              className="inline-block bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium transition"
            >
              Start Consultation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
