export const SITE_CONFIG = {
  name: 'Solace Jewels',
  wordmark: 'Solace Jewels',
  heroHeading: 'TIMELESS RADIANCE',
  heroSubheading: 'High Jewelry & Atelier Collections',
  copyrightYear: new Date().getFullYear(),
  contactEmail: 'atelier@solacejewels.com',
  goldPriceApiEndpoint: import.meta.env.VITE_GOLD_PRICE_API_URL || '',
  contactFormEndpoint: import.meta.env.VITE_CONTACT_FORM_ENDPOINT || '',
};
