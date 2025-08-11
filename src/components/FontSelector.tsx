'use client';

import { useState } from 'react';
import { useGoogleFonts, useFontLoader } from '@/lib/fonts';

export default function FontSelector() {
  const { fonts, loading, error } = useGoogleFonts();
  const { loadFont, isFontLoading, getFontError, clearFontError } = useFontLoader();
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [selectedWeight, setSelectedWeight] = useState(400);

  const handleFontChange = async (family: string) => {
    setSelectedFont(family);

    // Load the font if it's not a system font
    if (!['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'].includes(family)) {
      await loadFont(family, selectedWeight);
    }
  };

  const handleWeightChange = async (weight: number) => {
    setSelectedWeight(weight);

    // Load the font with new weight if it's not a system font
    if (!['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'].includes(selectedFont)) {
      await loadFont(selectedFont, weight);
    }
  };

  const isLoading = isFontLoading(selectedFont);
  const fontError = getFontError(selectedFont);

  return (
    <div className='bg-white rounded-lg shadow-sm border border-grey-300 p-4 mb-6'>
      <h3 className='text-lg font-medium text-text-primary mb-4'>Font Selector</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        {/* Font Family Selector */}
        <div>
          <label className='block text-sm font-medium text-text-secondary mb-2'>Font Family</label>
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className='w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent'
            disabled={loading}
          >
            {loading ? (
              <option>Loading fonts...</option>
            ) : (
              fonts.map((font) => (
                <option key={font.family} value={font.family}>
                  {font.family}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Font Weight Selector */}
        <div>
          <label className='block text-sm font-medium text-text-secondary mb-2'>Font Weight</label>
          <select
            value={selectedWeight}
            onChange={(e) => handleWeightChange(Number(e.target.value))}
            className='w-full px-3 py-2 border border-grey-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent'
          >
            <option value={100}>100 - Thin</option>
            <option value={300}>300 - Light</option>
            <option value={400}>400 - Regular</option>
            <option value={500}>500 - Medium</option>
            <option value={700}>700 - Bold</option>
            <option value={900}>900 - Black</option>
          </select>
        </div>
      </div>

      {/* Font Preview */}
      <div className='mb-4'>
        <label className='block text-sm font-medium text-text-secondary mb-2'>Preview</label>
        <div
          className={`p-4 border border-grey-300 rounded-lg min-h-[80px] flex items-center ${
            isLoading ? 'opacity-50' : ''
          }`}
          style={{
            fontFamily: selectedFont,
            fontWeight: selectedWeight,
          }}
        >
          {isLoading ? (
            <div className='flex items-center gap-2 text-text-secondary'>
              <div className='w-4 h-4 border-2 border-grey-300 border-t-primary-main rounded-full animate-spin'></div>
              Loading font...
            </div>
          ) : (
            <span>
              The quick brown fox jumps over the lazy dog
              <br />
              <span className='text-sm text-text-secondary'>
                {selectedFont} • {selectedWeight}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {fontError && (
        <div className='mb-4 p-3 bg-error-light border border-error-main rounded-lg'>
          <div className='flex items-center justify-between'>
            <span className='text-error-main text-sm'>{fontError}</span>
            <button
              onClick={() => clearFontError(selectedFont)}
              className='text-error-main hover:text-error-dark text-sm underline'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className='p-3 bg-warning-light border border-warning-main rounded-lg'>
          <span className='text-warning-main text-sm'>{error} - Using fallback fonts</span>
        </div>
      )}

      {/* Instructions */}
      <div className='text-xs text-text-secondary'>
        <p>💡 Google Fonts are loaded on-demand and cached in sessionStorage.</p>
        <p>⚡ Canvas interaction remains responsive during font loading.</p>
        <p>🔑 Set NEXT_PUBLIC_GFONTS_KEY in .env.local for full font catalog.</p>
      </div>
    </div>
  );
}
