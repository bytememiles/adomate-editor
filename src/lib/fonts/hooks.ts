import { useState, useCallback, useEffect } from 'react';
import { fetchGoogleFonts, ensureFontLoaded, type GoogleFont, type FontLoadStatus } from './service';

/**
 * Hook to manage Google Fonts catalog
 */
export function useGoogleFonts() {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFonts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fontList = await fetchGoogleFonts();
      setFonts(fontList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fonts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  return { fonts, loading, error, refetch: loadFonts };
}

/**
 * Hook to manage font loading with loading states
 */
export function useFontLoader() {
  const [loadingFonts, setLoadingFonts] = useState<Set<string>>(new Set());
  const [fontErrors, setFontErrors] = useState<Map<string, string>>(new Map());

  const loadFont = useCallback(async (family: string, weight: number = 400) => {
    // Skip if already loading
    if (loadingFonts.has(family)) {
      return;
    }

    setLoadingFonts(prev => new Set(prev).add(family));
    setFontErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(family);
      return newMap;
    });

    try {
      const result = await ensureFontLoaded(family, weight);
      
      if (!result.loaded && result.error) {
        setFontErrors(prev => new Map(prev).set(family, result.error!));
      }
    } catch (err) {
      setFontErrors(prev => new Map(prev).set(family, 'Failed to load font'));
    } finally {
      setLoadingFonts(prev => {
        const newSet = new Set(prev);
        newSet.delete(family);
        return newSet;
      });
    }
  }, [loadingFonts]);

  const isFontLoading = useCallback((family: string) => {
    return loadingFonts.has(family);
  }, [loadingFonts]);

  const getFontError = useCallback((family: string) => {
    return fontErrors.get(family);
  }, [fontErrors]);

  const clearFontError = useCallback((family: string) => {
    setFontErrors(prev => {
      const newMap = new Map(prev);
      newMap.delete(family);
      return newMap;
    });
  }, []);

  return {
    loadFont,
    isFontLoading,
    getFontError,
    clearFontError,
    loadingFonts: Array.from(loadingFonts),
    fontErrors: Object.fromEntries(fontErrors),
  };
}
