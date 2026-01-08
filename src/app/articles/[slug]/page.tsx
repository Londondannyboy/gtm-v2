import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from '@/lib/articles';
import { ArticleSchema } from '@/components/seo/ArticleSchema';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found' };
  }

  return {
    title: `${article.title} | GTM.quest`,
    description: article.meta_description || article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.meta_description || article.excerpt || undefined,
      images: article.hero_asset_url ? [article.hero_asset_url] : undefined,
      type: 'article',
      publishedTime: article.published_at?.toISOString(),
    },
  };
}

function getGuideTypeLabel(guideType: string | null): string {
  switch (guideType) {
    case 'listicle': return 'List';
    case 'guide': return 'Guide';
    case 'comparison': return 'Comparison';
    default: return 'Article';
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, article.guide_type || undefined, 4);

  return (
    <>
      <ArticleSchema article={article} />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <header className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/articles" className="text-emerald-600 hover:underline text-sm">
                ← All Articles
              </Link>
              <span className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full">
                {getGuideTypeLabel(article.guide_type)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {article.published_at && (
                <time dateTime={article.published_at.toISOString()}>
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              {article.word_count && (
                <span>· {Math.ceil(article.word_count / 200)} min read</span>
              )}
            </div>
          </div>

          {article.hero_asset_url && (
            <div className="max-w-5xl mx-auto px-4 pb-8">
              <img
                src={article.hero_asset_url}
                alt={article.hero_asset_alt || article.title}
                className="w-full rounded-xl shadow-lg"
              />
            </div>
          )}
        </header>

        {/* Content */}
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div
            className="prose prose-lg prose-emerald max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-a:text-emerald-600
              prose-li:text-gray-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* CTA Section */}
        <section className="bg-emerald-50 border-y py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Need help with your GTM strategy?</h2>
            <p className="text-gray-600 mb-6">
              Talk to our AI advisor to get personalized agency recommendations.
            </p>
            <Link
              href="/"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition"
            >
              Start Free Consultation
            </Link>
          </div>
        </section>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/articles/${related.slug}`}
                  className="block bg-white p-6 rounded-xl border hover:shadow-md transition"
                >
                  <span className="text-sm text-emerald-600 font-medium">
                    {getGuideTypeLabel(related.guide_type)}
                  </span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">{related.title}</h3>
                  {related.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">{related.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
