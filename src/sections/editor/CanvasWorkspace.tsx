'use client';

import { ToolbarButton } from '@/components/ui';
import {
  redo,
  selectCanRedo,
  selectCanUndo,
  selectCanvas,
  setCanvasZoom,
  undo,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { type Background } from '@/types';
import { Copy, Redo2, Trash2, Undo2, ZoomIn, ZoomOut } from 'lucide-react';

interface CanvasWorkspaceProps {
  background: Background;
  selectedId: string | null;
}

export default function CanvasWorkspace({ background, selectedId }: CanvasWorkspaceProps) {
  const dispatch = useAppDispatch();
  const canvas = useAppSelector(selectCanvas);
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

  return (
    <div
      className='h-full flex items-center justify-center p-8 bg-checkerboard'
      style={{ width: 'calc(100vw - 340px)' }}
    >
      {/* Background Image Display */}
      {background && (
        <div
          className='relative bg-white shadow-lg'
          style={{
            width: background.displayWidth,
            height: background.displayHeight,
          }}
        >
          <img
            src={background.src}
            alt='Background'
            className='w-full h-full object-cover'
            style={{
              width: background.displayWidth,
              height: background.displayHeight,
            }}
          />

          {/* Canvas Overlay for Future Text Layers */}
          <div className='absolute inset-0 pointer-events-none'>
            {/* Text layers will be rendered here in the future */}
          </div>
        </div>
      )}

      {/* Fallback when no background */}
      {!background && (
        <div className='text-center text-neutral-500'>
          <p className='text-sm'>Canvas Area</p>
          <p className='text-xs'>Upload an image to get started</p>
        </div>
      )}

      {/* Floating Object Toolbar - Only visible when something is selected */}
      {selectedId && (
        <div className='absolute top-4 right-4 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-lg p-2 shadow-lg'>
          <div className='flex gap-1'>
            <ToolbarButton
              icon={Copy}
              tooltip='Duplicate'
              onClick={() => {
                /* TODO: Implement duplicate */
              }}
              compact
              square
            />
            <ToolbarButton
              icon={Undo2}
              tooltip='Undo'
              onClick={() => dispatch(undo())}
              disabled={!canUndo}
              compact
              square
            />
            <ToolbarButton
              icon={Redo2}
              tooltip='Redo'
              onClick={() => dispatch(redo())}
              disabled={!canRedo}
              compact
              square
            />
            <ToolbarButton
              icon={ZoomOut}
              tooltip='Zoom Out'
              tooltipPosition='top'
              onClick={() => dispatch(setCanvasZoom(Math.max(canvas.zoom - 25, 25)))}
              compact
              square
            />
            <ToolbarButton
              icon={ZoomIn}
              tooltip='Zoom In'
              tooltipPosition='top'
              onClick={() => dispatch(setCanvasZoom(Math.min(canvas.zoom + 25, 400)))}
              compact
              square
            />
            <ToolbarButton
              icon={Trash2}
              tooltip='Delete'
              onClick={() => {
                /* TODO: Implement delete */
              }}
              compact
              square
              variant='danger'
            />
          </div>
        </div>
      )}
    </div>
  );
}
