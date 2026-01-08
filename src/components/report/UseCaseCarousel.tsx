'use client';

import { useState } from 'react';

interface UseCase {
  company_name: string;
  industry: string;
  challenge: string;
  solution: string;
  results: Record<string, string>;
  logo_url?: string;
}

interface Props {
  useCases: UseCase[];
}

export function UseCaseCarousel({ useCases }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (useCases.length === 0) return null;

  const activeCase = useCases[activeIndex];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <h2 className="text-xl font-bold text-gray-900">Success Stories</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{activeIndex + 1} of {useCases.length}</span>
        </div>
      </div>

      {/* Active Case */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-4 animate-in fade-in duration-300">
        {/* Company Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            {activeCase.logo_url ? (
              <img src={activeCase.logo_url} alt="" className="w-10 h-10 object-contain" />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {activeCase.company_name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{activeCase.company_name}</h3>
            <span className="text-sm text-gray-500">{activeCase.industry}</span>
          </div>
        </div>

        {/* Challenge & Solution */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-red-600 mb-1">
              <span>🎯</span> Challenge
            </div>
            <p className="text-gray-700">{activeCase.challenge}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 mb-1">
              <span>💡</span> Solution
            </div>
            <p className="text-gray-700">{activeCase.solution}</p>
          </div>
        </div>

        {/* Results */}
        {Object.keys(activeCase.results).length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-500 mb-3">Results</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(activeCase.results).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-emerald-50 rounded-lg p-3 text-center"
                >
                  <div className="text-xl font-bold text-emerald-600">{value}</div>
                  <div className="text-xs text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Dots */}
      {useCases.length > 1 && (
        <div className="flex items-center justify-center gap-2">
          {useCases.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? 'w-6 bg-emerald-500' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
