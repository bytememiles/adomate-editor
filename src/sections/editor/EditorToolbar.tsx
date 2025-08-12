'use client';

import { Button, ToolbarButton } from '@/components/ui';
import { addTextLayer, selectDoc, updateLayer, useAppDispatch, useAppSelector } from '@/store';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Copy,
  Download,
  Italic,
  Layers,
  Lock,
  RotateCcw,
  Square,
  Strikethrough,
  Trash2,
  Type,
  Underline,
  Unlock,
  Upload,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import FontFamilySelector from '@/components/editor/FontFamilySelector';
import FontSizeSelector from '@/components/editor/FontSizeSelector';

interface EditorToolbarProps {
  selectedId: string | null;
  onTextUpdate: (id: string, updates: any) => void;
}

export default function EditorToolbar({ selectedId, onTextUpdate }: EditorToolbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const doc = useAppSelector(selectDoc);

  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Get selected text layer
  const selectedTextLayer = selectedId ? doc.layers.find((l) => l.id === selectedId) : null;

  // Handle text alignment change
  const handleTextAlignChange = useCallback(
    (align: 'left' | 'center' | 'right') => {
      setTextAlign(align);
      if (selectedTextLayer) {
        onTextUpdate(selectedTextLayer.id, { align });
      }
    },
    [selectedTextLayer, onTextUpdate],
  );

  return (
    <div className='sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-6 py-3'>
      <div className='flex items-center justify-between'>
        {/* Left Section: Text Editing Controls */}
        <div className='flex items-center gap-4'>
          {/* Font Family */}
          <FontFamilySelector selectedId={selectedId} onTextUpdate={onTextUpdate} />

          {/* Font Size */}
          <FontSizeSelector
            selectedId={selectedId}
            currentSize={selectedTextLayer?.font?.size || 16}
            onTextUpdate={onTextUpdate}
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
              onTextUpdate(selectedTextLayer.id, {
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
              onTextUpdate(selectedTextLayer.id, {
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
              onTextUpdate(selectedTextLayer.id, {
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
              onTextUpdate(selectedTextLayer.id, {
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
  );
}
