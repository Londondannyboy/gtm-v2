// Location data for SEO pages
export interface LocationData {
  slug: string;
  name: string;
  fullName: string;
  country: string;
  region: string;
  timezone: string;
  currency: string;
  heroImage: string;
  description: string;
  marketHighlight: string;
  relatedLocations: string[];
  industries: string[];
  services: string[];
  faqs: { question: string; answer: string }[];
}

export const locations: Record<string, LocationData> = {
  'london': {
    slug: 'gtm-agencies-london',
    name: 'London',
    fullName: 'London, United Kingdom',
    country: 'United Kingdom',
    region: 'EMEA',
    timezone: 'GMT',
    currency: 'GBP',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80',
    description: "Europe's leading tech hub and a global fintech capital. GTM agencies here have direct access to Europe's deepest talent pool and most sophisticated buyers.",
    marketHighlight: 'London is home to Europe\'s largest financial services sector, employing over 400,000 professionals.',
    relatedLocations: ['berlin', 'paris', 'amsterdam', 'new-york'],
    industries: ['Financial Services', 'Enterprise Software', 'Fintech', 'Professional Services'],
    services: ['European Market Entry', 'Enterprise Sales', 'Fintech GTM', 'Product-Led Growth'],
    faqs: [
      {
        question: 'What makes London GTM agencies different?',
        answer: 'London agencies combine deep European market expertise with global reach. They excel at fintech, enterprise software, and regulated industries, with strong understanding of UK and EU compliance requirements.'
      },
      {
        question: 'How much do London GTM agencies charge?',
        answer: 'London GTM agencies typically charge £15,000-£50,000 per month for retainers. Project-based work ranges from £40,000-£250,000 depending on scope.'
      },
      {
        question: 'Do London agencies work with US companies?',
        answer: 'Yes, many London agencies specialize in helping US companies enter European markets. They provide local market intelligence, regulatory guidance, and established networks.'
      }
    ]
  },
  'new-york': {
    slug: 'gtm-agencies-new-york',
    name: 'New York',
    fullName: 'New York City, USA',
    country: 'United States',
    region: 'North America',
    timezone: 'EST',
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80',
    description: "America's enterprise B2B capital with the highest concentration of Fortune 500 headquarters. NYC agencies specialize in complex enterprise sales and financial services.",
    marketHighlight: 'New York hosts more Fortune 500 headquarters than any other city, making it the epicenter of enterprise B2B sales.',
    relatedLocations: ['boston', 'san-francisco', 'chicago', 'london'],
    industries: ['Financial Services', 'Media & Advertising', 'Enterprise SaaS', 'Healthcare'],
    services: ['Enterprise GTM', 'ABM Strategies', 'Financial Services GTM', 'Media & PR'],
    faqs: [
      {
        question: 'Why choose a New York GTM agency?',
        answer: 'NYC agencies have unparalleled access to Fortune 500 decision-makers and deep expertise in complex enterprise sales cycles. They understand the unique dynamics of selling to financial institutions and large enterprises.'
      },
      {
        question: 'What industries do NYC agencies specialize in?',
        answer: 'New York agencies excel in financial services, media, healthcare, and enterprise software. The city\'s diverse economy creates specialists in nearly every B2B vertical.'
      }
    ]
  },
  'san-francisco': {
    slug: 'gtm-agencies-san-francisco',
    name: 'San Francisco',
    fullName: 'San Francisco Bay Area, USA',
    country: 'United States',
    region: 'North America',
    timezone: 'PST',
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
    description: "Silicon Valley's startup epicenter and the birthplace of product-led growth. SF agencies are pioneers in PLG, developer marketing, and tech startup GTM.",
    marketHighlight: 'The Bay Area is home to the world\'s highest concentration of venture capital and tech startups.',
    relatedLocations: ['los-angeles', 'seattle', 'austin', 'new-york'],
    industries: ['SaaS', 'Developer Tools', 'AI/ML', 'Consumer Tech'],
    services: ['Product-Led Growth', 'Developer Marketing', 'Startup GTM', 'Growth Hacking'],
    faqs: [
      {
        question: 'What makes SF agencies unique?',
        answer: 'San Francisco agencies pioneered product-led growth and developer marketing. They understand the startup ecosystem intimately and specialize in rapid scaling strategies.'
      },
      {
        question: 'Are SF agencies good for Series A startups?',
        answer: 'Yes, many SF agencies specialize in early-stage startups. They understand the constraints and opportunities of venture-backed growth and can scale with you.'
      }
    ]
  },
  'boston': {
    slug: 'gtm-agencies-boston',
    name: 'Boston',
    fullName: 'Boston, Massachusetts, USA',
    country: 'United States',
    region: 'North America',
    timezone: 'EST',
    currency: 'USD',
    heroImage: 'https://images.unsplash.com/photo-1501979376754-1d09a6e4d688?w=1920&q=80',
    description: "America's biotech and healthcare hub with strong enterprise software and education technology sectors. Boston agencies combine academic rigor with startup agility.",
    marketHighlight: 'Boston is home to the world\'s largest biotech cluster and numerous elite universities driving innovation.',
    relatedLocations: ['new-york', 'cambridge', 'philadelphia'],
    industries: ['Biotech & Life Sciences', 'Healthcare', 'EdTech', 'Enterprise SaaS'],
    services: ['Healthcare GTM', 'Biotech Marketing', 'Enterprise Sales', 'Academic Partnerships'],
    faqs: [
      {
        question: 'What industries do Boston agencies focus on?',
        answer: 'Boston agencies have deep expertise in biotech, healthcare, education technology, and enterprise software. The city\'s academic ecosystem also makes them strong in research-backed marketing.'
      }
    ]
  },
  'sydney': {
    slug: 'gtm-agencies-sydney',
    name: 'Sydney',
    fullName: 'Sydney, Australia',
    country: 'Australia',
    region: 'APAC',
    timezone: 'AEST',
    currency: 'AUD',
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1920&q=80',
    description: "Australia's tech capital and gateway to the Asia-Pacific market. Sydney agencies specialize in APAC market entry and cross-cultural B2B marketing.",
    marketHighlight: 'Sydney is the largest tech hub in the Southern Hemisphere and the gateway to APAC markets.',
    relatedLocations: ['melbourne', 'singapore', 'tokyo'],
    industries: ['Fintech', 'Mining & Resources', 'Healthcare', 'Enterprise SaaS'],
    services: ['APAC Market Entry', 'Enterprise GTM', 'Fintech Marketing', 'Regional Expansion'],
    faqs: [
      {
        question: 'Why use a Sydney GTM agency for APAC expansion?',
        answer: 'Sydney agencies understand the diverse APAC market, from Australia\'s mature tech ecosystem to Southeast Asia\'s emerging markets. They can navigate regulatory, cultural, and commercial differences.'
      }
    ]
  },
  'toronto': {
    slug: 'gtm-agencies-toronto',
    name: 'Toronto',
    fullName: 'Toronto, Canada',
    country: 'Canada',
    region: 'North America',
    timezone: 'EST',
    currency: 'CAD',
    heroImage: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=1920&q=80',
    description: "Canada's largest tech hub and a growing fintech center. Toronto agencies offer cost-effective GTM services with proximity to US markets.",
    marketHighlight: 'Toronto is Canada\'s financial capital and home to a rapidly growing tech ecosystem.',
    relatedLocations: ['vancouver', 'new-york', 'boston'],
    industries: ['Fintech', 'AI/ML', 'Enterprise SaaS', 'E-commerce'],
    services: ['North American GTM', 'Enterprise Sales', 'Startup GTM', 'Cross-border Marketing'],
    faqs: [
      {
        question: 'What advantages do Toronto agencies offer?',
        answer: 'Toronto agencies offer US-comparable expertise at more competitive rates. They understand both Canadian and US markets, making them ideal for cross-border GTM strategies.'
      }
    ]
  },
};

// Get all location slugs for static generation
export function getAllLocationSlugs(): string[] {
  return Object.keys(locations);
}

// Get location data by key (e.g., 'london', 'new-york')
export function getLocationData(key: string): LocationData | null {
  return locations[key] || null;
}

// Get location by slug (e.g., 'gtm-agencies-london')
export function getLocationBySlug(slug: string): LocationData | null {
  return Object.values(locations).find(loc => loc.slug === slug) || null;
}
