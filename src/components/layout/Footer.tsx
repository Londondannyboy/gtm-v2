import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-gray-300 py-16 md:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <span className="font-black text-white text-2xl">GTM</span>
              <span className="text-emerald-400 font-black text-2xl">.quest</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered GTM strategy helping companies launch and scale their products faster.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://twitter.com/gtmquest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/gtmquest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Agencies */}
          <div>
            <h3 className="text-white font-bold mb-4">Agencies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/agencies" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  All Agencies
                </Link>
              </li>
              <li>
                <Link href="/gtm-agencies-london" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  London Agencies
                </Link>
              </li>
              <li>
                <Link href="/gtm-agencies-new-york" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  New York Agencies
                </Link>
              </li>
              <li>
                <Link href="/gtm-agencies-san-francisco" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  San Francisco Agencies
                </Link>
              </li>
              <li>
                <Link href="/gtm-agencies-boston" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Boston Agencies
                </Link>
              </li>
            </ul>
          </div>

          {/* GTM Services */}
          <div>
            <h3 className="text-white font-bold mb-4">GTM Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  AI Strategist
                </Link>
              </li>
              <li>
                <Link href="/agencies" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Agency Directory
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Compare Agencies
                </Link>
              </li>
              <li>
                <Link href="/consult" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  GTM Consulting
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/articles" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/gtm-strategy" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  GTM Strategy Guide
                </Link>
              </li>
              <li>
                <Link href="/b2b-gtm-strategy" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  B2B GTM Strategy
                </Link>
              </li>
              <li>
                <Link href="/gtm-for-startups" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  GTM for Startups
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-emerald-400 transition text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GTM.quest. AI-powered <span className="text-emerald-400 font-semibold">go-to-market strategy</span>.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <Link href="/sitemap.xml" className="text-gray-500 hover:text-emerald-400 transition">
                Sitemap
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-emerald-400 transition">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-emerald-400 transition">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
