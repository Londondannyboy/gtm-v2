import Link from 'next/link';
import { Article } from '@/lib/articles';

interface Props {
  article: Article;
}

function getGuideTypeLabel(guideType: string | null): string {
  switch (guideType) {
    case 'listicle': return 'List';
    case 'guide': return 'Guide';
    case 'comparison': return 'Comparison';
    default: return 'Article';
  }
}

export function ArticleCard({ article }: Props) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="block bg-white rounded-xl border hover:shadow-lg transition overflow-hidden"
    >
      {/* Hero Image */}
      {article.hero_asset_url && (
        <div className="h-40 bg-gray-100">
          <img
            src={article.hero_asset_url}
            alt={article.hero_asset_alt || article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        {/* Type Badge */}
        <span className="text-sm text-emerald-600 font-medium">
          {getGuideTypeLabel(article.guide_type)}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {article.published_at && (
            <time dateTime={article.published_at.toISOString()}>
              {new Date(article.published_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          )}
          {article.word_count && (
            <span>· {Math.ceil(article.word_count / 200)} min</span>
          )}
        </div>
      </div>
    </Link>
  );
}
