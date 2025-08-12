'use client';

import {
  selectSelectedTextLayer,
  selectTextFontPreset,
  updateSelectedLayerProperties,
  updateTextFontPreset,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { cn } from '@/utils';
import {
  addRecentFont,
  ensureFontLoaded,
  fetchGoogleFonts,
  findNearestWeight,
  getRecentFonts,
  type GoogleFont,
} from '@/utils/fonts';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface FontFamilySelectorProps {
  selectedId: string | null;
}

interface FontFamilySelectorState {
  isOpen: boolean;
  searchQuery: string;
  selectedFamily: string;
  fonts: GoogleFont[];
  recentFonts: string[];
  loadingFonts: Set<string>;
  highlightedIndex: number;
}

const FONT_PREVIEW_SIZE = 16;
const MAX_RECENT_FONTS = 6;
const FONT_SELECTOR_WIDTH = 360;
const FONT_SELECTOR_MAX_HEIGHT = 420;
const ITEM_HEIGHT = 40;

export default function FontFamilySelector({ selectedId }: FontFamilySelectorProps) {
  const dispatch = useAppDispatch();
  const selectedTextLayer = useAppSelector(selectSelectedTextLayer);
  const textFontPreset = useAppSelector(selectTextFontPreset);

  const [state, setState] = useState<FontFamilySelectorState>({
    isOpen: false,
    searchQuery: '',
    selectedFamily: selectedTextLayer?.font?.family || textFontPreset.family || 'Arial',
    fonts: [],
    recentFonts: [],
    loadingFonts: new Set(),
    highlightedIndex: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load recent fonts from localStorage
  useEffect(() => {
    const recent = getRecentFonts();
    setState((prev) => ({ ...prev, recentFonts: recent }));
  }, []);

  // Update selectedFamily when selectedTextLayer changes
  useEffect(() => {
    if (selectedTextLayer?.font?.family) {
      setState((prev) => ({ ...prev, selectedFamily: selectedTextLayer.font.family }));
    }
  }, [selectedTextLayer?.font?.family]);

  // Update selectedFamily when selectedTextLayer or preset changes
  useEffect(() => {
    const newFamily = selectedTextLayer?.font?.family || textFontPreset.family;
    if (newFamily) {
      setState((prev) => ({ ...prev, selectedFamily: newFamily }));
    }
  }, [selectedTextLayer?.font?.family, textFontPreset.family]);

  // Load Google Fonts catalog
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const fonts = await fetchGoogleFonts();
        setState((prev) => ({ ...prev, fonts }));
      } catch (error) {
        console.error('Failed to load fonts:', error);
        // Set empty array on error to prevent undefined state
        setState((prev) => ({ ...prev, fonts: [] }));
      }
    };

    if (state.isOpen) {
      loadFonts();
    }
  }, [state.isOpen]);

  // Ensure font is loaded
  const ensureFontLoadedWithFallback = useCallback(
    async (family: string, weight = 400): Promise<void> => {
      if (stateRef.current.loadingFonts.has(family)) return;

      setState((prev) => ({
        ...prev,
        loadingFonts: new Set([...prev.loadingFonts, family]),
      }));

      try {
        await ensureFontLoaded(family, weight);

        setState((prev) => ({
          ...prev,
          loadingFonts: new Set([...prev.loadingFonts].filter((f) => f !== family)),
        }));
      } catch (error) {
        console.error(`Failed to load font ${family}:`, error);
        setState((prev) => ({
          ...prev,
          loadingFonts: new Set([...prev.loadingFonts].filter((f) => f !== family)),
        }));
      }
    },
    [],
  );

  // Filter fonts based on search
  const filteredFonts = useMemo(() => {
    // Ensure state.fonts is always an array
    const fonts = Array.isArray(state.fonts) ? state.fonts : [];

    if (!state.searchQuery) return fonts;

    const query = state.searchQuery.toLowerCase();
    return fonts.filter((font) => font.family.toLowerCase().includes(query));
  }, [state.fonts, state.searchQuery]);

  // Get visible fonts for virtualization
  const visibleFonts = useMemo(() => {
    // Ensure filteredFonts is an array and has items
    if (!Array.isArray(filteredFonts) || filteredFonts.length === 0) {
      return [];
    }

    const startIndex = Math.floor(state.highlightedIndex / 10) * 10;
    return filteredFonts.slice(startIndex, startIndex + 20);
  }, [filteredFonts, state.highlightedIndex]);

  // Handle font selection
  const handleFontSelect = useCallback(
    async (family: string) => {
      console.log('FontFamilySelector: handleFontSelect called with family:', family);

      // Find the font object to check weight support
      const font = state.fonts.find((f) => f.family === family);
      const currentWeight = selectedTextLayer?.font?.weight || textFontPreset.weight;

      // Find nearest available weight
      const targetWeight = font ? findNearestWeight(font, currentWeight) : currentWeight;

      // If there's a selected text layer, update it
      if (selectedTextLayer) {
        dispatch(
          updateSelectedLayerProperties({
            font: {
              ...selectedTextLayer.font,
              family,
              weight: targetWeight,
            },
          }),
        );
      }

      // Always update the preset for future text layers
      dispatch(
        updateTextFontPreset({
          family,
          weight: targetWeight,
        }),
      );

      // Load font and close popup
      try {
        await ensureFontLoadedWithFallback(family, targetWeight);
      } catch (error) {
        console.error('Font loading failed:', error);
        // Fallback to safe stack
        if (selectedTextLayer) {
          dispatch(
            updateSelectedLayerProperties({
              font: {
                ...selectedTextLayer.font,
                family: 'Inter, system-ui, sans-serif',
              },
            }),
          );
        }
      }

      // Add to recent fonts
      addRecentFont(family, MAX_RECENT_FONTS);
      const newRecentFonts = getRecentFonts();

      setState((prev) => ({
        ...prev,
        isOpen: false,
        selectedFamily: family,
        recentFonts: newRecentFonts,
      }));
    },
    [selectedTextLayer, textFontPreset.weight, state.fonts, dispatch],
  );

  // Handle search input
  const handleSearchChange = useCallback((query: string) => {
    setState((prev) => ({
      ...prev,
      searchQuery: query,
      highlightedIndex: 0,
    }));
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            highlightedIndex: Math.min(
              prev.highlightedIndex + 1,
              Math.max(0, (filteredFonts?.length || 1) - 1),
            ),
          }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            highlightedIndex: Math.max(prev.highlightedIndex - 1, 0),
          }));
          break;
        case 'Enter':
          e.preventDefault();
          if (
            Array.isArray(filteredFonts) &&
            filteredFonts.length > 0 &&
            state.highlightedIndex >= 0 &&
            state.highlightedIndex < filteredFonts.length
          ) {
            const selectedFont = filteredFonts[state.highlightedIndex];
            if (selectedFont) {
              handleFontSelect(selectedFont.family);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setState((prev) => ({ ...prev, isOpen: false }));
          break;
        case 'Home':
          e.preventDefault();
          setState((prev) => ({ ...prev, highlightedIndex: 0 }));
          break;
        case 'End':
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            highlightedIndex: Math.max(0, (filteredFonts?.length || 1) - 1),
          }));
          break;
      }
    },
    [state.isOpen, state.highlightedIndex, filteredFonts, handleFontSelect],
  );

  // Load font preview when row becomes visible
  useEffect(() => {
    // Only load fonts that aren't already loading and aren't already loaded
    visibleFonts.forEach((font) => {
      if (!state.loadingFonts.has(font.family)) {
        // Check if font is already loaded before attempting to load
        const isLoaded = document.fonts.check(`16px "${font.family}"`);
        if (!isLoaded) {
          ensureFontLoadedWithFallback(font.family, 400);
        }
      }
    });
  }, [visibleFonts, ensureFontLoadedWithFallback]);

  // Close popup when clicking outside
  useEffect(() => {
    if (!state.isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setState((prev) => ({ ...prev, isOpen: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [state.isOpen]);

  // Focus search input when opening
  useEffect(() => {
    if (state.isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [state.isOpen]);

  // Use internal state for selected family, fallback to text layer font, then to Arial
  const selectedFontFamily = state.selectedFamily || selectedTextLayer?.font?.family || 'Arial';
  const hasRecentFonts = state.recentFonts.length > 0;

  return (
    <div className='relative' ref={containerRef}>
      {/* Trigger Button */}
      <button
        type='button'
        className={cn(
          'px-3 py-1 border border-neutral-200 rounded text-sm flex items-center gap-2 min-w-[120px]',
          'hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        )}
        onClick={() => setState((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        aria-label='Font family'
      >
        <span className='truncate' style={{ fontFamily: selectedFontFamily }}>
          {selectedFontFamily}
        </span>
        <ChevronDown className='w-4 h-4 flex-shrink-0' />
      </button>

      {/* Font Selector Popup */}
      {state.isOpen && (
        <div
          className='absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50'
          style={{
            width: FONT_SELECTOR_WIDTH,
            maxHeight: FONT_SELECTOR_MAX_HEIGHT,
          }}
        >
          {/* Search Input */}
          <div className='p-3 border-b border-neutral-100'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400' />
              <input
                ref={searchInputRef}
                type='text'
                placeholder='Search a Font'
                value={state.searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className='w-full pl-10 pr-8 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                aria-label='Search a font'
              />
              {state.searchQuery && (
                <button
                  type='button'
                  onClick={() => handleSearchChange('')}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600'
                  aria-label='Clear search'
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
          </div>

          {/* Font List */}
          <div
            ref={listRef}
            className='overflow-y-auto'
            style={{ maxHeight: FONT_SELECTOR_MAX_HEIGHT - 80 }}
          >
            {/* Using Fonts Section */}
            {hasRecentFonts && (
              <>
                <div className='px-3 py-2 bg-neutral-50 text-xs font-medium text-neutral-600 uppercase tracking-wide'>
                  Using fonts
                </div>
                {state.recentFonts.map((family, index) => (
                  <div
                    key={family}
                    className={cn(
                      'px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center justify-between',
                      state.highlightedIndex === index && 'bg-blue-100',
                      family === selectedFontFamily && 'bg-blue-50',
                    )}
                    onClick={() => handleFontSelect(family)}
                    onMouseEnter={() => setState((prev) => ({ ...prev, highlightedIndex: index }))}
                    role='option'
                    aria-selected={family === selectedFontFamily}
                  >
                    <span className='text-sm truncate' style={{ fontFamily: family }}>
                      {family}
                    </span>
                    {family === selectedFontFamily && (
                      <Check className='w-4 h-4 text-blue-600 flex-shrink-0' />
                    )}
                  </div>
                ))}
                <div className='border-t border-neutral-100 my-2' />
              </>
            )}

            {/* Catalog Section */}
            <div className='px-3 py-2 bg-neutral-50 text-xs font-medium text-neutral-600 uppercase tracking-wide'>
              English fonts
            </div>
            {Array.isArray(visibleFonts) &&
              visibleFonts.map((font, index) => {
                const globalIndex = hasRecentFonts ? state.recentFonts.length + index : index;
                const isHighlighted = globalIndex === state.highlightedIndex;
                const isLoading = state.loadingFonts.has(font.family);
                const isSelected = font.family === selectedFontFamily;

                return (
                  <div
                    key={font.family}
                    className={cn(
                      'px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center justify-between',
                      isHighlighted && 'bg-blue-100',
                      isSelected && 'bg-blue-50',
                    )}
                    onClick={() => handleFontSelect(font.family)}
                    onMouseEnter={() =>
                      setState((prev) => ({ ...prev, highlightedIndex: globalIndex }))
                    }
                    role='option'
                    aria-selected={isSelected}
                    style={{ height: ITEM_HEIGHT }}
                  >
                    <div className='flex items-center gap-2 min-w-0 flex-1'>
                      <span
                        className={cn('text-sm truncate', isLoading && 'text-neutral-400')}
                        style={{
                          fontFamily: isLoading ? 'system-ui' : font.family,
                          fontSize: FONT_PREVIEW_SIZE,
                        }}
                      >
                        {font.family}
                      </span>
                      {isLoading && (
                        <Loader2 className='w-4 h-4 text-neutral-400 animate-spin flex-shrink-0' />
                      )}
                    </div>
                    {isSelected && <Check className='w-4 h-4 text-blue-600 flex-shrink-0' />}
                  </div>
                );
              })}

            {/* Empty State */}
            {Array.isArray(filteredFonts) && filteredFonts.length === 0 && state.searchQuery && (
              <div className='px-3 py-4 text-center text-sm text-neutral-500'>
                No fonts match '{state.searchQuery}'
              </div>
            )}

            {/* Error State */}
            {state.fonts.length === 0 && !state.searchQuery && (
              <div className='px-3 py-4 text-center text-sm text-neutral-500'>
                <p>Fonts unavailable.</p>
                <button
                  type='button'
                  onClick={() => window.location.reload()}
                  className='mt-2 text-blue-600 hover:text-blue-700 underline'
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
