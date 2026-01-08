/**
 * Generate contextual image URLs from Unsplash based on agency data
 * Uses Unsplash's direct URL format for free usage with attribution
 */

// Map of locations to relevant search terms
const locationKeywords: Record<string, string> = {
  'London': 'london skyline',
  'New York': 'new york city',
  'NYC': 'new york city',
  'San Francisco': 'san francisco',
  'SF': 'san francisco golden gate',
  'Boston': 'boston skyline',
  'Toronto': 'toronto skyline',
  'Sydney': 'sydney opera house',
  'Los Angeles': 'los angeles skyline',
  'LA': 'los angeles',
  'Chicago': 'chicago skyline',
  'Austin': 'austin texas',
  'Seattle': 'seattle skyline',
  'Denver': 'denver mountains',
  'Miami': 'miami beach',
  'Atlanta': 'atlanta skyline',
  'Dallas': 'dallas texas',
  'Berlin': 'berlin germany',
  'Paris': 'paris france',
  'Amsterdam': 'amsterdam netherlands',
  'Dublin': 'dublin ireland',
  'Singapore': 'singapore skyline',
  'Hong Kong': 'hong kong skyline',
  'Tokyo': 'tokyo japan',
  'Melbourne': 'melbourne australia',
};

// Map of specializations to relevant search terms
const specializationKeywords: Record<string, string> = {
  'Demand Generation': 'marketing funnel',
  'ABM': 'business meeting',
  'Account-Based Marketing': 'business strategy',
  'Content Marketing': 'content creation',
  'SEO': 'search analytics',
  'Paid Media': 'digital advertising',
  'Sales Enablement': 'sales team',
  'B2B Marketing': 'b2b business',
  'SaaS Marketing': 'software technology',
  'Growth Marketing': 'business growth chart',
  'Product Marketing': 'product launch',
  'Brand Strategy': 'brand design',
  'Digital Marketing': 'digital marketing',
  'Lead Generation': 'leads pipeline',
  'Marketing Automation': 'automation technology',
  'GTM Strategy': 'go to market strategy',
};

// Fallback Unsplash image IDs for agencies without location data
const fallbackImageIds = [
  'photo-1497366216548-37526070297c', // Modern office
  'photo-1552664730-d307ca884978', // Team meeting
  'photo-1553877522-43269d4ea984', // Strategy session
  'photo-1542744173-8e7e53415bb0', // Business people
  'photo-1560179707-f14e90ef3623', // Office building
  'photo-1497215842964-222b430dc094', // Workspace
  'photo-1517245386807-bb43f82c33c4', // Conference
  'photo-1556761175-5973dc0f32e7', // Collaboration
];

/**
 * Generate a consistent hash from a string (for consistent image selection)
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get an Unsplash image URL based on location
 */
export function getLocationImage(location: string | null, seed: string, width = 800, height = 400): string {
  if (!location) {
    // Return a consistent fallback image based on seed
    const imageId = fallbackImageIds[hashString(seed) % fallbackImageIds.length];
    return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format`;
  }

  // Find matching location keyword
  let keyword = '';
  for (const [loc, kw] of Object.entries(locationKeywords)) {
    if (location.toLowerCase().includes(loc.toLowerCase())) {
      keyword = kw;
      break;
    }
  }

  // If no match, try to use the location name itself
  if (!keyword) {
    // Extract city name (usually first part before comma)
    keyword = location.split(',')[0].trim() + ' city';
  }

  // Use Unsplash source with the keyword
  // Adding seed ensures consistent image for same agency
  const seedNum = hashString(seed) % 1000;
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keyword)}&sig=${seedNum}`;
}

/**
 * Get an Unsplash image URL based on specialization
 */
export function getSpecializationImage(specializations: string[] | null, seed: string, width = 800, height = 400): string {
  if (!specializations || specializations.length === 0) {
    return `https://images.unsplash.com/photo-1552664730-d307ca884978?w=${width}&h=${height}&fit=crop&auto=format`;
  }

  // Find first matching specialization keyword
  let keyword = '';
  for (const spec of specializations) {
    for (const [s, kw] of Object.entries(specializationKeywords)) {
      if (spec.toLowerCase().includes(s.toLowerCase())) {
        keyword = kw;
        break;
      }
    }
    if (keyword) break;
  }

  // Fallback to generic business keyword
  if (!keyword) {
    keyword = 'business marketing';
  }

  const seedNum = hashString(seed) % 1000;
  return `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keyword)}&sig=${seedNum}`;
}

/**
 * Get a hero image URL for an agency - prioritizes location, falls back to specialization
 */
export function getAgencyHeroImage(
  agency: { name: string; headquarters?: string | null; specializations?: string[] | null },
  width = 1200,
  height = 400
): string {
  // Try location-based image first
  if (agency.headquarters) {
    return getLocationImage(agency.headquarters, agency.name, width, height);
  }

  // Fall back to specialization-based image
  if (agency.specializations && agency.specializations.length > 0) {
    return getSpecializationImage(agency.specializations, agency.name, width, height);
  }

  // Final fallback - use a curated business image
  const fallbackImages = [
    'photo-1497366216548-37526070297c', // Modern office
    'photo-1552664730-d307ca884978', // Team meeting
    'photo-1553877522-43269d4ea984', // Strategy session
    'photo-1542744173-8e7e53415bb0', // Business people
    'photo-1560179707-f14e90ef3623', // Office building
    'photo-1497215842964-222b430dc094', // Workspace
    'photo-1517245386807-bb43f82c33c4', // Conference
    'photo-1556761175-5973dc0f32e7', // Collaboration
  ];

  const imageId = fallbackImages[hashString(agency.name) % fallbackImages.length];
  return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&auto=format`;
}

/**
 * Pre-defined curated images for specific cities (higher quality, hand-picked)
 */
export const curatedCityImages: Record<string, string> = {
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=400&fit=crop&auto=format',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&h=400&fit=crop&auto=format',
  'san francisco': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=400&fit=crop&auto=format',
  'boston': 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&h=400&fit=crop&auto=format',
  'toronto': 'https://images.unsplash.com/photo-1517090504531-3f1550a5b9e9?w=1200&h=400&fit=crop&auto=format',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&h=400&fit=crop&auto=format',
  'chicago': 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&h=400&fit=crop&auto=format',
  'los angeles': 'https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=1200&h=400&fit=crop&auto=format',
  'seattle': 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&h=400&fit=crop&auto=format',
  'austin': 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=1200&h=400&fit=crop&auto=format',
  'denver': 'https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=1200&h=400&fit=crop&auto=format',
  'miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&h=400&fit=crop&auto=format',
  'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200&h=400&fit=crop&auto=format',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&h=400&fit=crop&auto=format',
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&h=400&fit=crop&auto=format',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&h=400&fit=crop&auto=format',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=400&fit=crop&auto=format',
};

/**
 * Get a curated city image if available, otherwise generate one
 */
export function getCityImage(location: string | null, seed: string): string {
  if (!location) {
    return getLocationImage(null, seed);
  }

  const locationLower = location.toLowerCase();

  // Check for curated image
  for (const [city, url] of Object.entries(curatedCityImages)) {
    if (locationLower.includes(city)) {
      return url;
    }
  }

  // Fall back to generated
  return getLocationImage(location, seed);
}
