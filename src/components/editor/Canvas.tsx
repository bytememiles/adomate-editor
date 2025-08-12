'use client';

import { useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectBackground, selectLayers, selectLayersAction } from '@/store';
import { type Background } from '@/types';
import TextLayer from './TextLayer';

interface CanvasProps {
  background: Background;
  scale?: number;
}

export default function Canvas({ background, scale = 1 }: CanvasProps) {
  const dispatch = useAppDispatch();
  const layers = useAppSelector(selectLayers);
  const selectedIds = useAppSelector((state) => state.editor.present.selectedIds);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle canvas click to deselect all layers
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        dispatch(selectLayersAction([]));
      }
    },
    [dispatch],
  );

  // Handle layer selection
  const handleLayerSelect = useCallback(
    (id: string, multiSelect?: boolean) => {
      if (multiSelect) {
        // Multi-select: add/remove from selection
        const newSelection = selectedIds.includes(id)
          ? selectedIds.filter((selectedId) => selectedId !== id)
          : [...selectedIds, id];
        dispatch(selectLayersAction(newSelection));
      } else {
        // Single select: replace selection
        dispatch(selectLayersAction([id]));
      }
    },
    [selectedIds, dispatch],
  );

  return (
    <div
      ref={canvasRef}
      className='relative w-full h-full flex items-center justify-center p-8 bg-checkerboard'
      style={{ width: 'calc(100vw - 340px)' }}
      onClick={handleCanvasClick}
    >
      {/* Background Image */}
      <div
        className='relative bg-white shadow-lg'
        style={{
          width: background.displayWidth * scale,
          height: background.displayHeight * scale,
        }}
      >
        <img
          src={background.src}
          alt='Background'
          className='w-full h-full object-cover'
          style={{
            width: background.displayWidth * scale,
            height: background.displayHeight * scale,
          }}
        />

        {/* Text Layers Overlay */}
        <div className='absolute inset-0'>
          {layers.map((layer) => (
            <TextLayer
              key={layer.id}
              layer={layer}
              isSelected={selectedIds.includes(layer.id)}
              onSelect={handleLayerSelect}
              scale={scale}
            />
          ))}
        </div>
      </div>

      {/* Fallback when no background */}
      {!background && (
        <div className='text-center text-neutral-500'>
          <p className='text-sm'>Canvas Area</p>
          <p className='text-xs'>Upload an image to get started</p>
        </div>
      )}
    </div>
  );
}
