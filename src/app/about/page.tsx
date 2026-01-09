import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about GTM.quest - the AI-powered go-to-market strategy platform helping companies launch and scale faster.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              AI-Powered GTM Strategy
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto">
              We're building the future of go-to-market strategy with AI that understands your business
              and connects you with the right agencies.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-zinc-950 border-y border-white/10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Our Mission</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              Every company deserves a world-class GTM strategy, but traditionally this has been reserved
              for those who can afford expensive consultants or have deep networks in the industry.
            </p>
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              GTM.quest democratizes access to GTM expertise through AI. Our platform combines the knowledge
              of hundreds of successful launches, agency partnerships, and proven frameworks to give every
              company personalized, actionable strategy recommendations.
            </p>
            <p className="text-lg text-white/70 leading-relaxed">
              Whether you're a seed-stage startup or a Series C company expanding to new markets, our AI
              strategist helps you navigate the complex landscape of go-to-market planning.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">What We Offer</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold text-white mb-3">AI Strategist</h3>
                <p className="text-white/60">
                  Voice and chat-powered AI that builds personalized GTM strategies based on your company's
                  unique situation, industry, and goals.
                </p>
              </div>

              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-3">Agency Matching</h3>
                <p className="text-white/60">
                  Directory of 200+ verified GTM agencies worldwide, with AI-powered matching to find
                  the right partners for your specific needs.
                </p>
              </div>

              <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-white mb-3">ROI Projections</h3>
                <p className="text-white/60">
                  Data-driven ROI estimates and benchmarks based on industry data, helping you make
                  informed investment decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-zinc-950 border-y border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">200+</div>
                <div className="text-white/60">GTM Agencies</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">50+</div>
                <div className="text-white/60">Specializations</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">20+</div>
                <div className="text-white/60">Countries</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-black text-emerald-400 mb-2">AI</div>
                <div className="text-white/60">Powered</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to build your GTM strategy?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Start a conversation with our AI strategist and get personalized recommendations in minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
            >
              Try AI Strategist
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
