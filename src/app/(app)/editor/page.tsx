'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  selectBackground,
  selectCanUndo,
  selectCanRedo,
  selectDoc,
  selectCanvas,
  selectCanvasZoom,
  addTextLayer,
  undo,
  redo,
  setBackground,
  updateLayer,
  selectLayers,
  commitSnapshot,
  deleteLayer,
  resetCanvas,
  setCanvasZoom,
  setCanvasPan,
  setCanvasRotation,
  resetCanvasView,
  resetTextLayers,
  clearAllLayers,
} from '@/store';
import UploadedFilesSidebar from '@/components/UploadedFilesSidebar';
import { Button, ToolbarButton } from '@/components/ui';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { STORAGE_KEYS, STORAGE_LIMITS } from '@/constants';
import { type UploadedFile } from '@/types';
import {
  Type,
  Upload,
  Download,
  Undo2,
  Redo2,
  Magnet,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  ZoomIn,
  ZoomOut,
  Trash2,
  RotateCcw,
  Square,
  Layers,
  Lock,
  Unlock,
  FlipHorizontal,
} from 'lucide-react';

export default function EditorPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const background = useAppSelector(selectBackground);
  const doc = useAppSelector(selectDoc);
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const canvas = useAppSelector(selectCanvas);

  const [uploadedFiles, setUploadedFiles] = useLocalStorage<UploadedFile[]>(
    STORAGE_KEYS.UPLOADED_FILES,
    [],
  );

  // UI State
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  console.log('Editor page loaded, background:', background);

  // Redirect to home if no background
  useEffect(() => {
    if (background === null) {
      router.replace('/');
    }
  }, [background, router]);

  // Get selected text layer
  const selectedTextLayer = selectedId ? doc.layers.find((l) => l.id === selectedId) : null;

  // Handle file selection from sidebar
  const handleFileSelect = useCallback(
    async (file: UploadedFile) => {
      try {
        // Get image dimensions from the stored base64 string
        const img = new Image();
        img.onload = () => {
          dispatch(
            setBackground({
              src: file.src,
              originalWidth: img.naturalWidth,
              originalHeight: img.naturalHeight,
              displayWidth: img.naturalWidth,
              displayHeight: img.naturalHeight,
            }),
          );
        };
        img.src = file.src;
      } catch (error) {
        console.error('Failed to get image dimensions:', error);
        alert('Failed to load the selected image. Please try again.');
      }
    },
    [dispatch],
  );

  // Handle file deletion
  const handleFileDelete = useCallback(
    (fileId: string) => {
      setUploadedFiles((prev) => {
        const updated = prev.filter((file) => file.id !== fileId);
        return updated;
      });
    },
    [setUploadedFiles],
  );

  // Handle upload new image
  const handleUploadNew = useCallback(() => {
    router.push('/');
  }, [router]);

  // Handle clear all files
  const handleClearAll = useCallback(() => {
    setUploadedFiles([]);
  }, [setUploadedFiles]);

  // Handle text layer updates
  const handleTextUpdate = useCallback(
    (id: string, updates: any) => {
      dispatch(updateLayer({ id, patch: updates }));
    },
    [dispatch],
  );

  // Handle text alignment change
  const handleTextAlignChange = useCallback(
    (align: 'left' | 'center' | 'right') => {
      setTextAlign(align);
      if (selectedTextLayer) {
        handleTextUpdate(selectedTextLayer.id, { align });
      }
    },
    [selectedTextLayer, handleTextUpdate],
  );

  // Show loading while checking state
  if (background === null) {
    return (
      <div className='min-h-screen bg-neutral-50 text-neutral-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-8 h-8 border-2 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-text-secondary'>Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-neutral-50 text-neutral-900 flex'>
      {/* Desktop-only warning */}
      <div className='lg:hidden fixed inset-0 bg-grey-100 flex items-center justify-center p-8 z-50'>
        <div className='text-center max-w-md'>
          <h1 className='text-2xl font-semibold text-text-primary mb-4'>Desktop Only</h1>
          <p className='text-text-secondary'>
            This application is designed for desktop use only. Please use a device with a minimum
            width of 1024px.
          </p>
        </div>
      </div>

      {/* Main content - only visible on desktop */}
      <div className='hidden lg:flex lg:flex-col lg:flex-1 relative'>
        {/* 1. Top Text Toolbar */}
        <div className='sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-6 py-3'>
          <div className='flex items-center justify-between'>
            {/* Left Section: Text Editing Controls */}
            <div className='flex items-center gap-4'>
              {/* Font Family */}
              <select
                className='px-3 py-1 border border-neutral-200 rounded text-sm'
                value={selectedTextLayer?.font?.family || 'Arial'}
                disabled={!selectedTextLayer}
              >
                <option value='Arial'>Arial</option>
                <option value='Helvetica'>Helvetica</option>
                <option value='Times New Roman'>Times New Roman</option>
              </select>

              {/* Font Size */}
              <input
                type='number'
                className='w-16 px-2 py-1 border border-neutral-200 rounded text-sm text-center'
                value={selectedTextLayer?.font?.size || 16}
                disabled={!selectedTextLayer}
                min='8'
                max='200'
              />

              {/* Color Picker */}
              <input
                type='color'
                className='w-8 h-8 border border-neutral-200 rounded cursor-pointer'
                value={selectedTextLayer?.fill || '#000000'}
                disabled={!selectedTextLayer}
                title='Text Color'
              />

              {/* Text Alignment */}
              <div className='flex border border-neutral-200 rounded overflow-hidden'>
                <ToolbarButton
                  icon={AlignLeft}
                  tooltip='Align Left'
                  active={textAlign === 'left'}
                  onClick={() => handleTextAlignChange('left')}
                  disabled={!selectedTextLayer}
                  compact
                  square
                />
                <ToolbarButton
                  icon={AlignCenter}
                  tooltip='Align Center'
                  active={textAlign === 'center'}
                  onClick={() => handleTextAlignChange('center')}
                  disabled={!selectedTextLayer}
                  compact
                  square
                />
                <ToolbarButton
                  icon={AlignRight}
                  tooltip='Align Right'
                  active={textAlign === 'right'}
                  onClick={() => handleTextAlignChange('right')}
                  disabled={!selectedTextLayer}
                  compact
                  square
                />
              </div>

              {/* Text Style Toggles */}
              <ToolbarButton
                icon={Bold}
                tooltip='Bold'
                active={selectedTextLayer?.font?.weight === 700}
                onClick={() =>
                  selectedTextLayer &&
                  handleTextUpdate(selectedTextLayer.id, {
                    font: {
                      ...selectedTextLayer.font,
                      weight: selectedTextLayer.font.weight === 700 ? 400 : 700,
                    },
                  })
                }
                disabled={!selectedTextLayer}
                compact
                square
              />
              <ToolbarButton
                icon={Italic}
                tooltip='Italic'
                active={selectedTextLayer?.font?.style === 'italic'}
                onClick={() =>
                  selectedTextLayer &&
                  handleTextUpdate(selectedTextLayer.id, {
                    font: {
                      ...selectedTextLayer.font,
                      style: selectedTextLayer.font.style === 'italic' ? 'normal' : 'italic',
                    },
                  })
                }
                disabled={!selectedTextLayer}
                compact
                square
              />
              <ToolbarButton
                icon={Underline}
                tooltip='Underline'
                active={selectedTextLayer?.underline}
                onClick={() =>
                  selectedTextLayer &&
                  handleTextUpdate(selectedTextLayer.id, {
                    underline: !selectedTextLayer.underline,
                  })
                }
                disabled={!selectedTextLayer}
                compact
                square
              />
              <ToolbarButton
                icon={Strikethrough}
                tooltip='Strikethrough'
                active={selectedTextLayer?.strikethrough}
                onClick={() =>
                  selectedTextLayer &&
                  handleTextUpdate(selectedTextLayer.id, {
                    strikethrough: !selectedTextLayer.strikethrough,
                  })
                }
                disabled={!selectedTextLayer}
                compact
                square
              />
            </div>

            {/* Center Section: Main Action Buttons */}
            <div className='flex items-center gap-3'>
              <Button
                icon={Type}
                variant='primary'
                onClick={() => dispatch(addTextLayer())}
                tooltip='Add Text Layer'
                tooltipPosition='bottom'
                rounded
              >
                Add Text
              </Button>

              <Button
                icon={Upload}
                variant='secondary'
                onClick={() => router.push('/')}
                tooltip='Upload New Background'
                tooltipPosition='bottom'
                rounded
              >
                Upload PNG
              </Button>

              <Button
                icon={Download}
                variant='success'
                onClick={() => {
                  /* TODO: Implement export */
                }}
                tooltip='Export PNG'
                tooltipPosition='bottom'
                rounded
              >
                Export PNG
              </Button>
            </div>

            {/* Right Section: Object Actions Only */}
            <div className='flex items-center gap-4'>
              {/* Object Action Buttons */}
              <ToolbarButton
                icon={Copy}
                tooltip='Duplicate Object'
                onClick={() => {
                  /* TODO: Implement duplicate */
                }}
                compact
                square
              />
              <ToolbarButton
                icon={RotateCcw}
                tooltip='Rotate Left'
                onClick={() => {
                  /* TODO: Implement rotate left */
                }}
                compact
                square
              />
              <ToolbarButton
                icon={RotateCcw}
                tooltip='Rotate Right'
                onClick={() => {
                  /* TODO: Implement rotate right */
                }}
                compact
                square
                className='rotate-180'
              />
              <ToolbarButton
                icon={Square}
                tooltip='Group Objects'
                onClick={() => {
                  /* TODO: Implement group */
                }}
                compact
                square
              />
              <ToolbarButton
                icon={Layers}
                tooltip='Bring to Front'
                onClick={() => {
                  /* TODO: Implement bring to front */
                }}
                compact
                square
              />
              <ToolbarButton
                icon={Unlock}
                tooltip='Unlock Object'
                onClick={() => {
                  /* TODO: Implement unlock */
                }}
                compact
                square
              />
              <ToolbarButton
                icon={Trash2}
                tooltip='Delete Object'
                onClick={() => {
                  /* TODO: Implement delete */
                }}
                compact
                square
                variant='danger'
              />
            </div>
          </div>
        </div>

        {/* 2. Canvas Workspace Area */}
        <div className='flex-1 relative'>
          {/* Undo/Redo Controls - Positioned above canvas */}
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
                onClick={() => {
                  dispatch(resetTextLayers());
                }}
                compact
                square
                rounded
              />
            </div>
          </div>

          {/* Zoom Controls - Positioned above canvas */}
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

          {/* Canvas Area */}
          <div className='w-full h-full flex items-center justify-center p-8 bg-checkerboard'>
            {/* Canvas Placeholder */}
            <div className='text-center text-neutral-500'>
              <p className='text-sm'>Canvas Area</p>
              <p className='text-xs'>Konva stage will be rendered here</p>
              <p className='text-xs mt-2'>
                Background: {background.displayWidth} × {background.displayHeight}
              </p>
            </div>

            {/* 3. Right Object Toolbar - Floating over canvas */}
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
        </div>
      </div>

      {/* Right Sidebar - Uploaded Files */}
      <UploadedFilesSidebar
        files={uploadedFiles}
        onFileSelect={handleFileSelect}
        onFileDelete={handleFileDelete}
        onUploadNew={handleUploadNew}
        onClearAll={handleClearAll}
        maxFiles={STORAGE_LIMITS.MAX_FILES}
        storageWarning={null}
        maxStorageSize={STORAGE_LIMITS.MAX_STORAGE_SIZE}
      />
    </div>
  );
}
