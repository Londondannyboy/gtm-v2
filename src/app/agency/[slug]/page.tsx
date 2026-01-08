import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAgencyBySlug, getAllAgencySlugs, getRelatedAgencies } from '@/lib/agencies';
import { AgencySchema } from '@/components/seo/AgencySchema';
import { getCityImage } from '@/lib/images';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllAgencySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    return { title: 'Agency Not Found' };
  }

  return {
    title: `${agency.name} - GTM Agency | GTM.quest`,
    description: agency.meta_description || agency.description || `${agency.name} is a GTM agency based in ${agency.headquarters}`,
    openGraph: {
      title: `${agency.name} - GTM Agency`,
      description: agency.meta_description || agency.description || undefined,
      images: agency.hero_asset_url ? [agency.hero_asset_url] : undefined,
    },
  };
}

export default async function AgencyPage({ params }: Props) {
  const { slug } = await params;
  const agency = await getAgencyBySlug(slug);

  if (!agency) {
    notFound();
  }

  const relatedAgencies = await getRelatedAgencies(slug, 6);
  const heroImage = getCityImage(agency.headquarters, agency.name);

  return (
    <>
      <AgencySchema agency={agency} />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section with Unsplash Image */}
        <section className="relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={agency.headquarters || agency.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center gap-2 text-white/80 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li>/</li>
                <li><Link href="/agencies" className="hover:text-white">Agencies</Link></li>
                <li>/</li>
                <li className="text-white font-medium">{agency.name}</li>
              </ol>
            </nav>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
                {agency.logo_url ? (
                  <img
                    src={agency.logo_url}
                    alt={`${agency.name} logo`}
                    className="w-20 h-20 object-contain"
                  />
                ) : (
                  <span className="text-4xl font-bold bg-gradient-to-br from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    {agency.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {agency.global_rank && (
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
                      agency.global_rank === 1 ? 'bg-amber-400 text-amber-900' :
                      agency.global_rank === 2 ? 'bg-gray-300 text-gray-800' :
                      agency.global_rank === 3 ? 'bg-orange-400 text-orange-900' :
                      'bg-white/20 backdrop-blur-sm text-white'
                    }`}>
                      {agency.global_rank <= 3 ? '🏆' : '🎯'} #{agency.global_rank} Ranked
                    </span>
                  )}
                  {agency.pricing_model && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
                      {agency.pricing_model}
                    </span>
                  )}
                  {agency.avg_rating && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="text-amber-300">★</span> {Number(agency.avg_rating).toFixed(1)}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mb-3">{agency.name}</h1>

                <p className="text-white/90 mb-4 text-lg">
                  {agency.headquarters && <span>📍 {agency.headquarters}</span>}
                  {agency.founded_year && <span> · Founded {agency.founded_year}</span>}
                  {agency.employee_count && <span> · {agency.employee_count}+ team</span>}
                </p>

                <p className="text-lg text-white/90 mb-6 max-w-2xl line-clamp-3">
                  {agency.description || agency.overview}
                </p>

                <div className="flex flex-wrap gap-3">
                  {agency.website && (
                    <a
                      href={agency.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                      Visit Website →
                    </a>
                  )}
                  <Link
                    href="/"
                    className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
                  >
                    🤖 Get AI Match
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Specializations */}
              {agency.specializations && agency.specializations.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Specializations</h2>
                  <div className="flex flex-wrap gap-2">
                    {agency.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {agency.key_services && agency.key_services.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Services</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {agency.key_services.map((service) => (
                      <li key={service} className="flex items-start gap-2">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Service Areas */}
              {agency.service_areas && agency.service_areas.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Service Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {agency.service_areas.map((area) => (
                      <span
                        key={area}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Facts */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                <dl className="space-y-3">
                  {agency.headquarters && (
                    <div>
                      <dt className="text-sm text-gray-500">Location</dt>
                      <dd className="font-medium">{agency.headquarters}</dd>
                    </div>
                  )}
                  {agency.founded_year && (
                    <div>
                      <dt className="text-sm text-gray-500">Founded</dt>
                      <dd className="font-medium">{agency.founded_year}</dd>
                    </div>
                  )}
                  {agency.employee_count && (
                    <div>
                      <dt className="text-sm text-gray-500">Team Size</dt>
                      <dd className="font-medium">{agency.employee_count} employees</dd>
                    </div>
                  )}
                  {agency.min_budget && (
                    <div>
                      <dt className="text-sm text-gray-500">Min. Budget</dt>
                      <dd className="font-medium">${agency.min_budget.toLocaleString()}/mo</dd>
                    </div>
                  )}
                  {agency.avg_rating && (
                    <div>
                      <dt className="text-sm text-gray-500">Rating</dt>
                      <dd className="font-medium">
                        {agency.avg_rating.toFixed(1)} ⭐ ({agency.review_count} reviews)
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* CTA */}
              <div className="bg-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Need help choosing?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Talk to our AI advisor to find the perfect GTM agency for your needs.
                </p>
                <Link
                  href="/"
                  className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Start Consultation
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Agencies */}
        {relatedAgencies.length > 0 && (
          <section className="bg-white border-t py-12">
            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Related Agencies</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedAgencies.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/agency/${related.slug}`}
                    className="block p-4 border rounded-xl hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {related.logo_url ? (
                          <img src={related.logo_url} alt="" className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="font-bold text-gray-400">{related.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{related.name}</h3>
                        <p className="text-sm text-gray-500">{related.headquarters}</p>
                      </div>
                    </div>
                    {related.global_rank && (
                      <span className="text-sm text-emerald-600">#{related.global_rank} Ranked</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
