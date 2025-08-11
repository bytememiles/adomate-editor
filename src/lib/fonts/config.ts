// Google Fonts API configuration
export const GOOGLE_FONTS_CONFIG = {
  // API key should be set in .env.local as NEXT_PUBLIC_GFONTS_KEY
  API_KEY: process.env['NEXT_PUBLIC_GFONTS_KEY'] || '',
  API_URL: 'https://www.googleapis.com/webfonts/v1/webfonts',
  STORAGE_KEY: 'fonts:catalog',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const;

// Validate API key is configured
if (!GOOGLE_FONTS_CONFIG.API_KEY) {
  console.warn('Google Fonts API key not configured. Set NEXT_PUBLIC_GFONTS_KEY in .env.local');
}
