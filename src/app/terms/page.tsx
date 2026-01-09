import { Metadata } from 'next';
import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'GTM.quest terms of service. Read our terms and conditions for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {' / '}
            <span className="text-white">Terms of Service</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-8">Terms of Service</h1>

          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            <p className="text-white/70 text-lg">
              Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/70">
                By accessing and using GTM.quest, you accept and agree to be bound by these Terms of Service.
                If you do not agree with any part of these terms, you may not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-white/70">
                GTM.quest provides an AI-powered go-to-market strategy platform, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>AI strategy recommendations and analysis</li>
                <li>Agency directory and matching services</li>
                <li>GTM resources and educational content</li>
                <li>Voice and chat-based consultation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="text-white/70">
                You may need to create an account to access certain features. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. AI-Generated Content</h2>
              <p className="text-white/70">
                Our AI provides strategy recommendations based on the information you provide. Please note:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>AI recommendations are for informational purposes only</li>
                <li>We do not guarantee specific business outcomes</li>
                <li>You should verify recommendations with qualified professionals</li>
                <li>Final business decisions are your responsibility</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <p className="text-white/70">
                All content on GTM.quest, including text, graphics, logos, and software, is owned by us or our
                licensors. You may not reproduce, distribute, or create derivative works without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Prohibited Uses</h2>
              <p className="text-white/70">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/70 mt-4">
                <li>Use the service for unlawful purposes</li>
                <li>Attempt to gain unauthorized access</li>
                <li>Interfere with the service's operation</li>
                <li>Scrape or harvest data without permission</li>
                <li>Impersonate others or misrepresent your affiliation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
              <p className="text-white/70">
                GTM.quest is provided "as is" without warranties of any kind. We do not guarantee that the
                service will be uninterrupted, error-free, or meet your specific requirements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-white/70">
                To the maximum extent permitted by law, GTM.quest shall not be liable for any indirect,
                incidental, special, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
              <p className="text-white/70">
                We may update these terms from time to time. Continued use of the service after changes
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Governing Law</h2>
              <p className="text-white/70">
                These terms are governed by the laws of the United Kingdom. Any disputes shall be resolved
                in the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact</h2>
              <p className="text-white/70">
                For questions about these terms, contact us at{' '}
                <a href="mailto:legal@gtm.quest" className="text-emerald-400 hover:text-emerald-300">
                  legal@gtm.quest
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
