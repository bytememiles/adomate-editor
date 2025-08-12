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
import Canvas from '@/components/editor/Canvas';

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
    <div className='flex-1 relative'>
      {/* Canvas with Text Layers */}
      <Canvas background={background} scale={canvas.zoom / 100} />

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
