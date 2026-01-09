import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'GTM.quest privacy policy. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {' / '}
            <span className="text-white">Privacy Policy</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">Privacy Policy</h1>

          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            <p className="text-white/70 text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-white/70">
                GTM.quest ("we," "us," or "our") operates the GTM.quest website. This Privacy Policy explains our
                data practices and your privacy rights when you use our AI-powered go-to-market strategy platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              <p className="text-white/70">
                We collect information you voluntarily provide, such as when you create an account, use our AI strategist,
                contact agencies, or reach out to us. This may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>Name and email address</li>
                <li>Company information and GTM requirements</li>
                <li>Conversation data with our AI strategist</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-white/70">
                We use your information to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>Provide personalized GTM strategy recommendations</li>
                <li>Connect you with relevant agencies</li>
                <li>Improve our AI models and services</li>
                <li>Communicate with you about your account</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Protection</h2>
              <p className="text-white/70">
                We implement appropriate security measures to protect your personal information, including encryption
                and secure storage. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Cookies and Analytics</h2>
              <p className="text-white/70">
                We use cookies and similar technologies to improve your experience, analyze usage patterns, and
                personalize content. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Third-Party Services</h2>
              <p className="text-white/70">
                We may share data with trusted third-party services including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>AI providers (for strategy generation)</li>
                <li>Analytics services</li>
                <li>Partner agencies (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-white/70">
                Under GDPR and other privacy laws, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Contact Us</h2>
              <p className="text-white/70">
                If you have questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@gtm.quest" className="text-emerald-400 hover:text-emerald-300">
                  privacy@gtm.quest
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
