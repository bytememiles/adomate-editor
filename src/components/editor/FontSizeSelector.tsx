'use client';

import { commitSnapshot, useAppDispatch } from '@/store';
import { cn } from '@/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FontSizeSelectorProps {
  selectedId: string | null;
  currentSize: number;
  onTextUpdate?: (id: string, updates: any) => void;
  onSizeChange?: (size: number) => void;
}

const PRESET_SIZES = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 96, 128,
];
const MIN_SIZE = 6;
const MAX_SIZE = 512;
const FONT_SIZE_SELECTOR_WIDTH = 120;
const FONT_SIZE_SELECTOR_MAX_HEIGHT = 320;
const ITEM_HEIGHT = 32;

export default function FontSizeSelector({
  selectedId,
  currentSize,
  onTextUpdate,
  onSizeChange,
}: FontSizeSelectorProps) {
  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    isOpen: false,
    isEditing: false,
    editValue: currentSize.toString(),
    highlightedIndex: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Update edit value when current size changes
  useEffect(() => {
    setState((prev) => ({ ...prev, editValue: currentSize.toString() }));
  }, [currentSize]);

  // Find current size in presets
  const currentSizeIndex = PRESET_SIZES.findIndex((size) => size === currentSize);
  const isCustomSize = currentSizeIndex === -1;

  // Handle size selection
  const handleSizeSelect = useCallback(
    (size: number) => {
      // Clamp size to valid range
      const clampedSize = Math.max(MIN_SIZE, Math.min(MAX_SIZE, size));

      // If there's a selected text layer, update it
      if (selectedId && onTextUpdate) {
        // Update the text layer
        onTextUpdate(selectedId, {
          font: { size: clampedSize },
        });

        // Commit to history
        dispatch(commitSnapshot());
      }

      // Always call the onSizeChange callback if provided (for presets)
      if (onSizeChange) {
        onSizeChange(clampedSize);
      }

      // Close popup
      setState((prev) => ({ ...prev, isOpen: false }));
    },
    [selectedId, onTextUpdate, onSizeChange, dispatch],
  );

  // Handle custom size input
  const handleCustomSizeChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, editValue: value }));
  }, []);

  // Handle custom size submission
  const handleCustomSizeSubmit = useCallback(() => {
    const size = parseInt(state.editValue, 10);
    if (!isNaN(size)) {
      handleSizeSelect(size);
    }
  }, [state.editValue, handleSizeSelect]);

  // Handle custom size blur
  const handleCustomSizeBlur = useCallback(() => {
    setState((prev) => ({ ...prev, isEditing: false }));
    handleCustomSizeSubmit();
  }, [handleCustomSizeSubmit]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!state.isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (!state.isEditing) {
            setState((prev) => ({
              ...prev,
              highlightedIndex: Math.min(prev.highlightedIndex + 1, PRESET_SIZES.length - 1),
            }));
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (!state.isEditing) {
            setState((prev) => ({
              ...prev,
              highlightedIndex: Math.max(prev.highlightedIndex - 1, 0),
            }));
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (state.isEditing) {
            handleCustomSizeSubmit();
          } else {
            const selectedSize = PRESET_SIZES[state.highlightedIndex];
            if (selectedSize) {
              handleSizeSelect(selectedSize);
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setState((prev) => ({ ...prev, isOpen: false, isEditing: false }));
          break;
        case 'Home':
          e.preventDefault();
          if (!state.isEditing) {
            setState((prev) => ({ ...prev, highlightedIndex: 0 }));
          }
          break;
        case 'End':
          e.preventDefault();
          if (!state.isEditing) {
            setState((prev) => ({ ...prev, highlightedIndex: PRESET_SIZES.length - 1 }));
          }
          break;
      }
    },
    [
      state.isOpen,
      state.isEditing,
      state.highlightedIndex,
      handleCustomSizeSubmit,
      handleSizeSelect,
    ],
  );

  // Handle input click to start editing
  const handleInputClick = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      isEditing: true,
    }));

    // Focus input after state update
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  }, []);

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

  // Focus input when editing starts
  useEffect(() => {
    if (state.isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [state.isEditing]);

  if (state.isEditing) {
    return (
      <input
        ref={inputRef}
        type='number'
        value={state.editValue}
        onChange={(e) => handleCustomSizeChange(e.target.value)}
        onBlur={handleCustomSizeBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-16 px-2 py-1 border border-blue-500 rounded text-sm text-center',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        )}
        min={MIN_SIZE}
        max={MAX_SIZE}
        aria-label='Font size'
      />
    );
  }

  return (
    <div className='relative' ref={containerRef}>
      {/* Trigger Button */}
      <button
        type='button'
        className={cn(
          'w-16 px-2 py-1 border border-neutral-200 rounded text-sm text-center flex items-center justify-center gap-1',
          'hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
        )}
        onClick={() => setState((prev) => ({ ...prev, isOpen: !prev.isOpen }))}
        aria-label='Font size'
      >
        <span className='truncate'>{currentSize}</span>
        <ChevronDown className='w-3 h-3 flex-shrink-0' />
      </button>

      {/* Font Size Selector Popup */}
      {state.isOpen && (
        <div
          className='absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50'
          style={{
            width: FONT_SIZE_SELECTOR_WIDTH,
            maxHeight: FONT_SIZE_SELECTOR_MAX_HEIGHT,
          }}
        >
          {/* Custom Size Input */}
          <div className='p-2 border-b border-neutral-100'>
            <input
              type='number'
              placeholder='Custom size'
              value={state.editValue}
              onChange={(e) => handleCustomSizeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleCustomSizeBlur}
              onClick={() => setState((prev) => ({ ...prev, isEditing: true }))}
              className='w-full px-2 py-1 border border-neutral-200 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
              min={MIN_SIZE}
              max={MAX_SIZE}
              aria-label='Custom font size'
            />
          </div>

          {/* Preset Sizes List */}
          <div
            ref={listRef}
            className='overflow-y-auto'
            style={{ maxHeight: FONT_SIZE_SELECTOR_MAX_HEIGHT - 80 }}
          >
            {PRESET_SIZES.map((size, index) => {
              const isHighlighted = index === state.highlightedIndex;
              const isSelected = size === currentSize;

              return (
                <div
                  key={size}
                  className={cn(
                    'px-3 py-1 cursor-pointer hover:bg-blue-50 flex items-center justify-between',
                    isHighlighted && 'bg-blue-100',
                    isSelected && 'bg-blue-50',
                  )}
                  onClick={() => handleSizeSelect(size)}
                  onMouseEnter={() => setState((prev) => ({ ...prev, highlightedIndex: index }))}
                  role='option'
                  aria-selected={isSelected}
                  style={{ height: ITEM_HEIGHT }}
                >
                  <span className='text-sm'>{size}px</span>
                  {isSelected && <Check className='w-4 h-4 text-blue-600 flex-shrink-0' />}
                </div>
              );
            })}

            {/* Custom Size Entry (if not in presets) */}
            {isCustomSize && (
              <div
                className={cn(
                  'px-3 py-1 cursor-pointer hover:bg-blue-50 flex items-center justify-between border-t border-neutral-100',
                  state.highlightedIndex === PRESET_SIZES.length && 'bg-blue-100',
                  'bg-blue-50',
                )}
                onClick={() => handleSizeSelect(currentSize)}
                onMouseEnter={() =>
                  setState((prev) => ({ ...prev, highlightedIndex: PRESET_SIZES.length }))
                }
                role='option'
                aria-selected={true}
                style={{ height: ITEM_HEIGHT }}
              >
                <span className='text-sm'>{currentSize}px</span>
                <Check className='w-4 h-4 text-blue-600 flex-shrink-0' />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
