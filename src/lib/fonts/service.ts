import { GOOGLE_FONTS_CONFIG } from './config';

// Font family interface
export interface GoogleFont {
  family: string;
  variants: string[];
}

// Font loading status
export interface FontLoadStatus {
  loaded: boolean;
  error?: string;
}

/**
 * Fetch Google Fonts catalog from API or cache
 */
export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  try {
    // Check cache first
    const cached = sessionStorage.getItem(GOOGLE_FONTS_CONFIG.STORAGE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      // Return cached data if still valid
      if (now - timestamp < GOOGLE_FONTS_CONFIG.CACHE_DURATION) {
        return data;
      }
    }

    // Fetch from API if no cache or expired
    if (!GOOGLE_FONTS_CONFIG.API_KEY) {
      throw new Error('Google Fonts API key not configured');
    }

    const response = await fetch(
      `${GOOGLE_FONTS_CONFIG.API_URL}?key=${GOOGLE_FONTS_CONFIG.API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Transform to minimal format
    const fonts: GoogleFont[] = result.items.map((font: any) => ({
      family: font.family,
      variants: font.variants,
    }));

    // Cache the result
    const cacheData = {
      data: fonts,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(GOOGLE_FONTS_CONFIG.STORAGE_KEY, JSON.stringify(cacheData));

    return fonts;
  } catch (error) {
    console.error('Failed to fetch Google Fonts:', error);
    
    // Return fallback fonts if API fails
    return [
      { family: 'Arial', variants: ['regular'] },
      { family: 'Helvetica', variants: ['regular'] },
      { family: 'Times New Roman', variants: ['regular'] },
      { family: 'Georgia', variants: ['regular'] },
      { family: 'Verdana', variants: ['regular'] },
    ];
  }
}

/**
 * Ensure a Google Font is loaded and ready to use
 */
export async function ensureFontLoaded(
  family: string, 
  weight: number = 400
): Promise<FontLoadStatus> {
  try {
    // Check if font is already loaded
    if (document.fonts.check(`16px "${family}"`)) {
      return { loaded: true };
    }

    // Inject Google Fonts stylesheet
    const linkId = `google-font-${family.toLowerCase().replace(/\s+/g, '-')}`;
    let link = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
      document.head.appendChild(link);
    }

    // Wait for font to load
    await document.fonts.load(`${weight} 16px "${family}"`);
    
    return { loaded: true };
  } catch (error) {
    console.warn(`Failed to load font "${family}":`, error);
    return { 
      loaded: false, 
      error: `Failed to load font: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Load multiple fonts simultaneously
 */
export async function ensureFontsLoaded(
  fonts: Array<{ family: string; weight?: number }>
): Promise<FontLoadStatus[]> {
  const promises = fonts.map(({ family, weight = 400 }) => 
    ensureFontLoaded(family, weight)
  );
  
  return Promise.all(promises);
}
