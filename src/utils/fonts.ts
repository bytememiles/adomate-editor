/**
 * Google Fonts API utilities
 */

export interface GoogleFont {
  family: string;
  variants: string[];
  category?: string;
  files?: Record<string, string>;
}

/**
 * Fetch Google Fonts catalog with caching
 */
export async function fetchGoogleFonts(): Promise<GoogleFont[]> {
  const apiKey = process.env['NEXT_PUBLIC_GFONTS_KEY'];

  if (!apiKey) {
    console.warn('Google Fonts API key not found. Using fallback fonts.');
    return getFallbackFonts();
  }

  try {
    // Check sessionStorage cache first
    const cached = sessionStorage.getItem('fonts:catalog');
    if (cached) {
      const fonts = JSON.parse(cached);
      return fonts;
    }

    // Fetch from Google Fonts API
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch fonts: ${response.status}`);
    }

    const data = await response.json();
    const fonts: GoogleFont[] = data.items.map((item: any) => ({
      family: item.family,
      variants: item.variants,
      category: item.category,
      files: item.files,
    }));

    // Cache in sessionStorage
    sessionStorage.setItem('fonts:catalog', JSON.stringify(fonts));
    return fonts;
  } catch (error) {
    console.error('Failed to load Google Fonts:', error);
    return getFallbackFonts();
  }
}

/**
 * Get fallback system fonts when Google Fonts is unavailable
 */
export function getFallbackFonts(): GoogleFont[] {
  return [
    { family: 'Arial', variants: ['400', '700'] },
    { family: 'Helvetica', variants: ['400', '700'] },
    { family: 'Times New Roman', variants: ['400', '700'] },
    { family: 'Georgia', variants: ['400', '700'] },
    { family: 'Verdana', variants: ['400', '700'] },
    { family: 'Courier New', variants: ['400', '700'] },
    { family: 'Impact', variants: ['400'] },
    { family: 'Comic Sans MS', variants: ['400'] },
    { family: 'Tahoma', variants: ['400', '700'] },
    { family: 'Trebuchet MS', variants: ['400', '700'] },
  ];
}

/**
 * Ensure a font is loaded with fallback handling
 */
export async function ensureFontLoaded(
  family: string,
  weight: number = 400,
  fallbackStack: string = 'Inter, system-ui, sans-serif',
): Promise<void> {
  try {
    // Check if font is already loaded
    if (document.fonts.check(`${weight} 16px "${family}"`)) {
      return;
    }

    // Load Google Font
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Wait for font to load
    await document.fonts.load(`${weight} 16px "${family}"`);
  } catch (error) {
    console.error(`Failed to load font ${family}:`, error);

    // Apply fallback font
    const style = document.createElement('style');
    style.textContent = `
      .font-${family.replace(/\s+/g, '-').toLowerCase()} {
        font-family: "${fallbackStack}" !important;
      }
    `;
    document.head.appendChild(style);

    throw error;
  }
}

/**
 * Get recent fonts from localStorage
 */
export function getRecentFonts(): string[] {
  try {
    const recent = localStorage.getItem('fonts:recent');
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Failed to parse recent fonts:', error);
    return [];
  }
}

/**
 * Add font to recent fonts list
 */
export function addRecentFont(family: string, maxCount: number = 6): void {
  try {
    const recent = getRecentFonts();
    const newRecent = [family, ...recent.filter((f) => f !== family)].slice(0, maxCount);

    localStorage.setItem('fonts:recent', JSON.stringify(newRecent));
  } catch (error) {
    console.error('Failed to save recent fonts:', error);
  }
}

/**
 * Find nearest available weight for a font
 */
export function findNearestWeight(font: GoogleFont, targetWeight: number): number {
  if (!font.variants || font.variants.length === 0) {
    return 400; // Default to normal weight
  }

  const weights = font.variants
    .map((v) => parseInt(v, 10))
    .filter((w) => !isNaN(w))
    .sort((a, b) => a - b);

  if (weights.length === 0) {
    return 400;
  }

  // Find exact match
  if (weights.includes(targetWeight)) {
    return targetWeight;
  }

  // Find nearest weight - weights array is guaranteed to have at least one element
  let nearest = weights[0]!;
  let minDiff = Math.abs(targetWeight - nearest);

  for (const weight of weights) {
    const diff = Math.abs(targetWeight - weight);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = weight;
    }
  }

  return nearest;
}

/**
 * Check if a font supports a specific weight
 */
export function fontSupportsWeight(font: GoogleFont, weight: number): boolean {
  if (!font.variants) return false;
  return font.variants.includes(weight.toString());
}

/**
 * Get font preview text for different categories
 */
export function getFontPreviewText(category?: string): string {
  switch (category) {
    case 'serif':
      return 'The quick brown fox jumps over the lazy dog';
    case 'monospace':
      return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    case 'display':
      return 'FONT PREVIEW';
    case 'handwriting':
      return 'Handwritten text sample';
    default:
      return 'The quick brown fox jumps over the lazy dog';
  }
}
