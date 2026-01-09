import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { sql } from '@/lib/db';
import { Agency } from '@/lib/agencies';
import { AgencyCard } from '@/components/ui/AgencyCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { getLocationData } from '@/lib/locations';

const locationKey = 'london';
const location = getLocationData(locationKey)!;

export const metadata: Metadata = {
  title: `GTM Agencies ${location.name} 2025 | Top Go-To-Market Consultants`,
  description: `Find the best GTM agencies in ${location.name}. Compare top go-to-market consultancies serving ${location.country} and ${location.region} markets.`,
  keywords: `GTM agency ${location.name}, go-to-market agencies ${location.name}, GTM consultants ${location.name}`,
  alternates: {
    canonical: `https://gtm.quest/${location.slug}`
  },
  openGraph: {
    title: `Top GTM Agencies in ${location.name} | 2025 Directory`,
    description: `Compare the best go-to-market agencies in ${location.name}.`,
    url: `https://gtm.quest/${location.slug}`,
    type: 'website'
  }
};

async function getAgenciesInLocation(): Promise<Agency[]> {
  const results = await sql`
    SELECT id, slug, name, description, headquarters, logo_url, hero_asset_url,
           specializations, service_areas, category_tags, global_rank, founded_year,
           employee_count, website, pricing_model, min_budget, status, meta_description,
           overview, key_services, avg_rating, review_count
    FROM companies
    WHERE app = 'gtm' AND status = 'published'
      AND (headquarters ILIKE ${'%' + location.name + '%'} OR ${location.name} = ANY(service_areas))
    ORDER BY global_rank NULLS LAST
  `;
  return results as Agency[];
}

export const revalidate = 3600;

export default async function LocationPage() {
  const agencies = await getAgenciesInLocation();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: location.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `GTM Agencies in ${location.name}`,
    description: `Directory of top go-to-market agencies serving ${location.fullName}`,
    url: `https://gtm.quest/${location.slug}`,
    numberOfItems: agencies.length,
    provider: {
      '@type': 'Organization',
      name: 'GTM.quest'
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
            <span className="text-white">{location.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with City Image */}
      <section className="relative py-20 md:py-28 bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={location.heroImage}
            alt={`${location.name} city skyline`}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <span className="text-white/60 text-sm uppercase tracking-wider">{location.fullName}</span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            GTM Agencies<br />in {location.name}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl">
            {agencies.length} verified go-to-market agencies in {location.name}. {location.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl">
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{agencies.length}</div>
              <div className="text-white/60">Agencies</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{location.region}</div>
              <div className="text-white/60">Market Access</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{location.timezone}</div>
              <div className="text-white/60">Time Zone</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{location.currency}</div>
              <div className="text-white/60">Currency</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
            Why Choose a {location.name} GTM Agency?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            {location.description}
          </p>
          <p className="text-lg text-white/70 leading-relaxed">
            {location.marketHighlight}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
            GTM Services in {location.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {location.services.map((service, i) => (
              <div key={i} className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
                <h3 className="text-xl font-bold text-white mb-3">{service}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-zinc-950 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">
            Key Industries in {location.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {location.industries.map((industry, i) => (
              <div key={i} className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white">{industry}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agency Directory */}
      <section className="bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {location.name} GTM Agencies Directory
          </h2>
          <p className="text-xl text-white/60 mb-12">
            Compare {agencies.length} verified go-to-market agencies serving {location.name}
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} />
            ))}
          </div>

          {agencies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 mb-4">No agencies found in {location.name} yet.</p>
              <Link href="/agencies" className="text-emerald-400 hover:underline">
                View all agencies →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      {location.faqs.length > 0 && (
        <section className="bg-zinc-950 border-t border-white/10 py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12">{location.name} GTM Agency FAQs</h2>

            <div className="space-y-8">
              {location.faqs.map((faq, index) => (
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

      {/* Related Markets */}
      <section className="bg-black border-t border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12">Related Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {location.relatedLocations.map((relatedKey) => {
              const related = getLocationData(relatedKey);
              if (!related) return null;
              return (
                <Link
                  key={relatedKey}
                  href={`/${related.slug}`}
                  className="group p-8 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <h3 className="text-xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {related.country}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Build Your {location.name} GTM Strategy
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Get AI-powered recommendations for {location.region} market entry.
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
