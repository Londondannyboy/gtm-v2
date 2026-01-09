import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';
import { AgencyCard } from '@/components/ui/AgencyCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { getAllSEOPages, getSEOPageBySlug, getRelatedPages } from '@/lib/seo-pages';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all SEO pages (locations + categories)
export async function generateStaticParams() {
  const pages = await getAllSEOPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getSEOPageBySlug(slug);

  if (!page) {
    return { title: 'Not Found' };
  }

  return {
    title: page.meta_title || `${page.display_name || page.name} | GTM.quest`,
    description: page.meta_description || page.description || '',
    alternates: {
      canonical: `https://gtm.quest/${page.slug}`
    },
    openGraph: {
      title: page.meta_title || `${page.display_name || page.name} | GTM.quest`,
      description: page.meta_description || page.description || '',
      url: `https://gtm.quest/${page.slug}`,
      type: 'website'
    }
  };
}

// Get agencies for a location page
async function getAgenciesForLocation(locationName: string): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (headquarters ILIKE ${'%' + locationName + '%'} OR ${locationName} = ANY(service_areas))
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

// Get agencies for a category page
async function getAgenciesForCategory(categoryName: string): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND ${categoryName} = ANY(category_tags)
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

export const revalidate = 3600;

export default async function SEOPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await getSEOPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // Get agencies based on page type
  const agencies = page.page_type === 'location'
    ? await getAgenciesForLocation(page.name)
    : await getAgenciesForCategory(page.name);

  // Get related pages
  const relatedPages = await getRelatedPages(page.related_pages || []);

  const faqs = page.faqs || [];

  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  } : null;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: page.display_name || page.name,
    description: page.description,
    url: `https://gtm.quest/${page.slug}`,
    numberOfItems: agencies.length,
    provider: {
      '@type': 'Organization',
      name: 'GTM.quest'
    }
  };

  const isLocation = page.page_type === 'location';
  const displayName = page.display_name || page.name;

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Breadcrumb */}
      <div className="pt-20 border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="text-white/60 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {' / '}
            <Link href="/agencies" className="hover:text-white transition-colors">GTM Agencies</Link>
            {' / '}
            <span className="text-white">{page.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-black overflow-hidden">
        {page.hero_image_url && (
          <div className="absolute inset-0 z-0">
            <Image
              src={page.hero_image_url}
              alt={`${page.name} ${isLocation ? 'city' : 'marketing'}`}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {isLocation && page.country && (
            <span className="text-white/60 text-sm uppercase tracking-wider">
              {page.name}, {page.country}
            </span>
          )}
          {!isLocation && (
            <span className="text-emerald-400 text-sm uppercase tracking-wider font-medium">
              Agency Category
            </span>
          )}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            {isLocation ? (
              <>GTM Agencies<br />in {page.name}</>
            ) : (
              <>{displayName}</>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl">
            {agencies.length} verified {isLocation ? `go-to-market agencies in ${page.name}` : displayName.toLowerCase()}. {page.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{agencies.length}</div>
              <div className="text-white/60">Agencies</div>
            </div>
            {isLocation && page.region && (
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{page.region}</div>
                <div className="text-white/60">Market Access</div>
              </div>
            )}
            {isLocation && page.timezone && (
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{page.timezone}</div>
                <div className="text-white/60">Time Zone</div>
              </div>
            )}
            {isLocation && page.currency && (
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{page.currency}</div>
                <div className="text-white/60">Currency</div>
              </div>
            )}
            {!isLocation && (
              <>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">Top</div>
                  <div className="text-white/60">Rated</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">2025</div>
                  <div className="text-white/60">Updated</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      {(page.description || page.market_highlight) && (
        <section className="py-20 bg-zinc-950 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
              {isLocation ? `Why Choose a ${page.name} GTM Agency?` : `Why Work with ${displayName}?`}
            </h2>
            {page.description && (
              <p className="text-lg text-white/70 leading-relaxed mb-6">
                {page.description}
              </p>
            )}
            {page.market_highlight && (
              <p className="text-lg text-white/70 leading-relaxed">
                {page.market_highlight}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Services Section */}
      {page.services && page.services.length > 0 && (
        <section className="py-20 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isLocation ? `GTM Services in ${page.name}` : 'Key Services'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {page.services.map((service: string, i: number) => (
                <div key={i} className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                  <h3 className="text-xl font-bold text-white">{service}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Industries Section */}
      {page.industries && page.industries.length > 0 && (
        <section className="py-20 bg-zinc-950 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isLocation ? `Key Industries in ${page.name}` : 'Industries Served'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {page.industries.map((industry: string, i: number) => (
                <div key={i} className="p-8 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-bold text-white">{industry}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Agency Directory */}
      <section className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {isLocation ? `${page.name} GTM Agencies Directory` : `Top ${displayName}`}
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Compare {agencies.length} verified {isLocation ? `agencies serving ${page.name}` : displayName.toLowerCase()}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} />
            ))}
          </div>

          {agencies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No agencies found yet.</p>
              <Link href="/agencies" className="text-emerald-400 hover:underline">
                View all agencies →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-zinc-950 border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isLocation ? `${page.name} GTM Agency FAQs` : `${displayName} FAQs`}
            </h2>

            <div className="space-y-8">
              {faqs.map((faq: { question: string; answer: string }, index: number) => (
                <div key={index}>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-lg text-white/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Pages */}
      {relatedPages.length > 0 && (
        <section className="bg-black border-t border-white/10 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
              {isLocation ? 'Related Markets' : 'Related Categories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedPages.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${related.slug}`}
                  className="group p-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {related.country || related.page_type}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            {isLocation
              ? `Build Your ${page.name} GTM Strategy`
              : `Find the Right ${page.name}`
            }
          </h2>
          <p className="text-xl text-white/90 mb-10">
            {isLocation
              ? `Get AI-powered recommendations for ${page.region || 'your'} market entry.`
              : 'Get personalized agency recommendations based on your specific needs.'
            }
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-12 py-5 text-lg font-black rounded-xl bg-black text-white hover:bg-gray-900 transition-all shadow-2xl"
          >
            Try AI Strategist
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
