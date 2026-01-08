'use client';

import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  slug: string;
  type: string;
  specializations: string[];
  pricing_tier: string;
  logo_url?: string;
  website?: string;
  description: string;
  rating?: number;
  match_score?: number;
}

interface Props {
  provider: Provider;
  index: number;
}

export function AgencyMatchCard({ provider, index }: Props) {
  const score = provider.match_score || 0;
  const percentage = Math.round(score * 100);

  const getScoreColor = () => {
    if (score >= 0.8) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 0.6) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getPricingBadge = () => {
    switch (provider.pricing_tier) {
      case 'budget': return { label: '$', color: 'bg-green-100 text-green-700' };
      case 'mid': return { label: '$$', color: 'bg-blue-100 text-blue-700' };
      case 'premium': return { label: '$$$', color: 'bg-purple-100 text-purple-700' };
      default: return { label: '$$', color: 'bg-gray-100 text-gray-700' };
    }
  };

  const pricing = getPricingBadge();

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom"
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
    >
      {/* Header with score */}
      <div className="flex items-start justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {provider.logo_url ? (
              <img src={provider.logo_url} alt="" className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {provider.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{provider.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-500 capitalize">{provider.type}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${pricing.color}`}>
                {pricing.label}
              </span>
            </div>
          </div>
        </div>

        {/* Match Score Circle */}
        <div className={`relative w-14 h-14 rounded-full border-4 ${getScoreColor()} flex items-center justify-center`}>
          <div className="text-center">
            <div className="text-lg font-bold">{percentage}</div>
            <div className="text-[8px] uppercase tracking-wide opacity-70">match</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 line-clamp-2">
          {provider.description}
        </p>
      </div>

      {/* Specializations */}
      {provider.specializations.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1.5">
            {provider.specializations.slice(0, 4).map((spec) => (
              <span
                key={spec}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {spec}
              </span>
            ))}
            {provider.specializations.length > 4 && (
              <span className="text-xs px-2 py-1 text-gray-400">
                +{provider.specializations.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rating */}
      {provider.rating && (
        <div className="px-4 pb-3 flex items-center gap-1">
          <span className="text-amber-400">★</span>
          <span className="text-sm font-medium">{provider.rating.toFixed(1)}</span>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t flex items-center gap-2">
        <Link
          href={`/agency/${provider.slug}`}
          className="flex-1 text-center text-sm font-medium text-emerald-600 hover:text-emerald-700 py-2 rounded-lg hover:bg-emerald-50 transition"
        >
          View Profile
        </Link>
        {provider.website && (
          <a
            href={provider.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm font-medium text-gray-600 hover:text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Visit Site ↗
          </a>
        )}
      </div>
    </div>
  );
}
