import Link from 'next/link';
import { Agency } from '@/lib/agencies';
import { getCityImage } from '@/lib/images';

interface Props {
  agency: Agency;
  featured?: boolean;
}

export function AgencyCard({ agency, featured }: Props) {
  const heroImage = getCityImage(agency.headquarters, agency.name);

  return (
    <Link
      href={`/agency/${agency.slug}`}
      className={`group block bg-white rounded-xl border hover:shadow-xl transition-all duration-300 overflow-hidden ${
        featured ? 'ring-2 ring-emerald-500' : ''
      }`}
    >
      {/* Hero Banner with Unsplash Image */}
      <div className="h-28 relative overflow-hidden">
        <img
          src={heroImage}
          alt={agency.headquarters || agency.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Rank badge */}
        {agency.global_rank && agency.global_rank <= 20 && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shadow-lg ${
              agency.global_rank === 1 ? 'bg-amber-400 text-amber-900' :
              agency.global_rank === 2 ? 'bg-gray-300 text-gray-700' :
              agency.global_rank === 3 ? 'bg-orange-400 text-orange-900' :
              'bg-white/90 text-gray-700'
            }`}>
              {agency.global_rank}
            </span>
          </div>
        )}

        {/* Location badge on image */}
        {agency.headquarters && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-full shadow">
              <span>📍</span> {agency.headquarters.split(',')[0]}
            </span>
          </div>
        )}

        {/* Logo positioned at bottom right */}
        <div className="absolute -bottom-5 right-4">
          <div className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center border-2 border-white">
            {agency.logo_url ? (
              <img src={agency.logo_url} alt="" className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-xl font-bold bg-gradient-to-br from-gray-600 to-gray-800 bg-clip-text text-transparent">
                {agency.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-7 px-4 pb-4">
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition truncate">
            {agency.name}
          </h3>
          {agency.employee_count && (
            <p className="text-sm text-gray-500">{agency.employee_count}+ team members</p>
          )}
        </div>

        {/* Description */}
        {agency.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {agency.description}
          </p>
        )}

        {/* Tags */}
        {agency.specializations && agency.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {agency.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {spec}
              </span>
            ))}
            {agency.specializations.length > 3 && (
              <span className="text-xs text-gray-400 px-1">
                +{agency.specializations.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {agency.min_budget ? (
            <span className="text-sm text-gray-600">
              From <span className="font-semibold text-gray-900">${agency.min_budget.toLocaleString()}</span>/mo
            </span>
          ) : (
            <span className="text-sm text-gray-400">Contact for pricing</span>
          )}

          {agency.avg_rating && (
            <div className="flex items-center gap-1">
              <span className="text-amber-400">★</span>
              <span className="text-sm font-medium">{Number(agency.avg_rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
