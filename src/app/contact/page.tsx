import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with GTM.quest. Contact us for questions about our AI strategy platform or agency partnerships.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Let's Talk GTM
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Have questions about our platform? Want to partner with us? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-xl font-bold text-white mb-3">General Inquiries</h3>
                <p className="text-white/60 mb-4">
                  Questions about our platform or services.
                </p>
                <a
                  href="mailto:hello@gtm.quest"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  hello@gtm.quest
                </a>
              </div>

              <div className="p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-3">Agency Partnerships</h3>
                <p className="text-white/60 mb-4">
                  Interested in joining our agency directory?
                </p>
                <a
                  href="mailto:partners@gtm.quest"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  partners@gtm.quest
                </a>
              </div>

              <div className="p-8 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-4xl mb-4">🛠️</div>
                <h3 className="text-xl font-bold text-white mb-3">Technical Support</h3>
                <p className="text-white/60 mb-4">
                  Need help with the platform?
                </p>
                <a
                  href="mailto:support@gtm.quest"
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  support@gtm.quest
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="max-w-2xl mx-auto">
              <div className="p-8 md:p-12 bg-zinc-900 rounded-2xl border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-white/70 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="partnership">Agency Partnership</option>
                      <option value="enterprise">Enterprise Plan</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Alternative CTA */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Prefer to chat with our AI?
            </h2>
            <p className="text-white/70 mb-6">
              Get instant GTM strategy recommendations from our AI strategist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Try AI Strategist →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
