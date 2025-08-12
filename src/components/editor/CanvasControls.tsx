'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectCanUndo,
  selectCanRedo,
  selectCanvas,
  undo,
  redo,
  resetTextLayers,
  setCanvasZoom,
} from '@/store';
import { ToolbarButton } from '@/components/ui';
import { Undo2, Redo2, RotateCcw, ZoomIn, ZoomOut, FlipHorizontal } from 'lucide-react';
import { type Background } from '@/types';

interface CanvasControlsProps {
  background: Background;
}

export default function CanvasControls({ background }: CanvasControlsProps) {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const canvas = useAppSelector(selectCanvas);

  return (
    <>
      {/* Undo/Redo/Reset Controls - Positioned at bottom-left */}
      <div className='absolute bottom-4 left-8 z-10'>
        <div className='bg-white rounded-full border border-neutral-200 shadow-sm p-2 flex items-center gap-2'>
          <ToolbarButton
            icon={Undo2}
            tooltip='Undo (Ctrl+Z)'
            tooltipPosition='top'
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            compact
            square
            rounded
          />
          <div className='w-px h-6 bg-neutral-200'></div>
          <ToolbarButton
            icon={Redo2}
            tooltip='Redo (Ctrl+Shift+Z)'
            tooltipPosition='top'
            onClick={() => dispatch(redo())}
            disabled={!canRedo}
            compact
            square
            rounded
          />
          <div className='w-px h-6 bg-neutral-200'></div>
          <ToolbarButton
            icon={RotateCcw}
            tooltip='Reset Text Layers'
            tooltipPosition='top'
            onClick={() => dispatch(resetTextLayers())}
            compact
            square
            rounded
          />
        </div>
      </div>

      {/* Zoom Controls - Positioned at bottom-right */}
      <div className='absolute bottom-4 right-8 z-10'>
        <div className='bg-white rounded-full border border-neutral-200 shadow-sm p-2 pl-4 flex items-center gap-4'>
          {/* Canvas Size */}
          <div className='text-sm text-neutral-600 font-medium'>
            {background.displayWidth}px × {background.displayHeight}px
          </div>

          <div className='w-px h-6 bg-neutral-200'></div>

          {/* Zoom Controls */}
          <div className='flex items-center gap-2'>
            <ToolbarButton
              icon={ZoomOut}
              tooltip='Zoom Out'
              tooltipPosition='top'
              onClick={() => dispatch(setCanvasZoom(Math.max(canvas.zoom - 25, 25)))}
              compact
              square
              rounded
            />

            <span className='text-sm font-medium min-w-[3rem] text-center text-neutral-700'>
              {canvas.zoom}%
            </span>

            <ToolbarButton
              icon={ZoomIn}
              tooltip='Zoom In'
              tooltipPosition='top'
              onClick={() => dispatch(setCanvasZoom(Math.min(canvas.zoom + 25, 400)))}
              compact
              square
              rounded
            />
          </div>

          <div className='w-px h-6 bg-neutral-200'></div>

          {/* Compare Button */}
          <ToolbarButton
            icon={FlipHorizontal}
            tooltip='Compare View'
            tooltipPosition='top'
            onClick={() => {
              /* TODO: Implement compare view */
            }}
            compact
            square
            rounded
          />
        </div>
      </div>
    </>
  );
}
