'use client';

import { useState } from 'react';

interface Props {
  agencySlug?: string;
  agencyName?: string;
  prefilledCompany?: string;
  onSuccess?: () => void;
}

export function ContactForm({ agencySlug, agencyName, prefilledCompany, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: prefilledCompany || '',
    message: '',
    scheduleCall: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          agencySlug,
          submissionType: agencySlug ? 'agency_inquiry' : 'gtm_consultation',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      setIsSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-bold text-emerald-800 text-lg mb-2">Request Sent!</h3>
        <p className="text-emerald-700">
          {agencyName
            ? `${agencyName} will reach out to you within 24 hours.`
            : "We'll connect you with the best agencies for your needs."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {agencyName && (
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          Contacting: <strong>{agencyName}</strong>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Work Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="john@company.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tell us about your GTM needs
        </label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          placeholder="We're looking for help with demand generation for our B2B SaaS product..."
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.scheduleCall}
          onChange={(e) => setFormData({ ...formData, scheduleCall: e.target.checked })}
          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
        />
        <span className="text-sm text-gray-700">
          I'd like to schedule a discovery call
        </span>
      </label>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          'Send Request'
        )}
      </button>
    </form>
  );
}
