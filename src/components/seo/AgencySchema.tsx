import { Agency } from '@/lib/agencies';

interface Props {
  agency: Agency;
}

export function AgencySchema({ agency }: Props) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: agency.name,
    description: agency.description || agency.overview,
    url: agency.website,
    logo: agency.logo_url,
    foundingDate: agency.founded_year?.toString(),
    address: agency.headquarters ? {
      '@type': 'PostalAddress',
      addressLocality: agency.headquarters,
    } : undefined,
    aggregateRating: agency.avg_rating ? {
      '@type': 'AggregateRating',
      ratingValue: agency.avg_rating,
      reviewCount: agency.review_count || 0,
    } : undefined,
    numberOfEmployees: agency.employee_count ? {
      '@type': 'QuantitativeValue',
      value: agency.employee_count,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
