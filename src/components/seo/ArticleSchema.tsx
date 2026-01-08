import { Article } from '@/lib/articles';

interface Props {
  article: Article;
}

export function ArticleSchema({ article }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description || article.excerpt,
    image: article.hero_asset_url,
    datePublished: article.published_at?.toISOString(),
    dateModified: article.published_at?.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'GTM.quest',
      url: 'https://gtm.quest',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GTM.quest',
      url: 'https://gtm.quest',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://gtm.quest/articles/${article.slug}`,
    },
    wordCount: article.word_count,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
