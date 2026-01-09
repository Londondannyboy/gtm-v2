import { Metadata } from 'next';
import Link from 'next/link';
import { getAllArticles, Article } from '@/lib/articles';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'GTM Resources & Guides | GTM.quest',
  description: 'Expert guides, comparisons, and resources on go-to-market strategy, demand generation, sales enablement, and growth tactics.',
  openGraph: {
    title: 'GTM Resources & Guides',
    description: 'Expert go-to-market strategy guides and resources',
  },
};

function groupByType(articles: Article[]): Record<string, Article[]> {
  return articles.reduce((acc, article) => {
    const type = article.guide_type || 'article';
    if (!acc[type]) acc[type] = [];
    acc[type].push(article);
    return acc;
  }, {} as Record<string, Article[]>);
}

const typeLabels: Record<string, string> = {
  listicle: 'Top Lists',
  guide: 'Guides',
  comparison: 'Comparisons',
  article: 'Articles',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles(100);
  const grouped = groupByType(articles);

  const featured = articles.filter((a) => a.guide_type === 'guide').slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-zinc-950 border-b border-white/10 pt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            GTM Resources
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            Expert guides, agency comparisons, and actionable insights for your
            go-to-market strategy.
          </p>
        </div>
      </section>

      {/* Featured Guides */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">Featured Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="block bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition group"
              >
                {article.hero_asset_url && (
                  <div className="h-48 bg-white/5 overflow-hidden">
                    <img
                      src={article.hero_asset_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-6">
                  <span className="text-sm text-emerald-400 font-medium">Guide</span>
                  <h3 className="text-xl font-semibold text-white mt-1 mb-2">{article.title}</h3>
                  {article.excerpt && (
                    <p className="text-white/60 line-clamp-2">{article.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Articles by Type */}
      {Object.entries(grouped).map(([type, typeArticles]) => (
        <section key={type} className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{typeLabels[type] || type}</h2>
            <span className="text-white/50">{typeArticles.length} articles</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {typeArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Need personalized GTM advice?</h2>
          <p className="text-white/90 mb-6">
            Talk to our AI advisor to get customized recommendations for your business.
          </p>
          <Link
            href="/"
            className="inline-block bg-black hover:bg-gray-900 text-white px-8 py-4 rounded-xl font-bold transition"
          >
            Start Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
