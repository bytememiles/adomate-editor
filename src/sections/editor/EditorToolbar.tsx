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
}

export default function EditorToolbar({ selectedId }: EditorToolbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const doc = useAppSelector(selectDoc);

  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [presetFont, setPresetFont] = useState({
    family: 'Arial',
    size: 16,
    weight: 400,
    color: '#000000',
    align: 'left' as 'left' | 'center' | 'right',
  });

  // Get selected text layer
  const selectedTextLayer = selectedId ? doc.layers.find((l) => l.id === selectedId) : null;

  // Handle text update through Redux
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
      // Update preset for future text layers
      setPresetFont((prev) => ({ ...prev, align }));
    },
    [selectedTextLayer, handleTextUpdate],
  );

  // Handle font family change
  const handleFontFamilyChange = useCallback(
    (family: string) => {
      if (selectedTextLayer) {
        handleTextUpdate(selectedTextLayer.id, {
          font: { ...selectedTextLayer.font, family },
        });
      }
      // Update preset for future text layers
      setPresetFont((prev) => ({ ...prev, family }));
    },
    [selectedTextLayer, handleTextUpdate],
  );

  // Handle font size change
  const handleFontSizeChange = useCallback(
    (size: number) => {
      if (selectedTextLayer) {
        handleTextUpdate(selectedTextLayer.id, {
          font: { ...selectedTextLayer.font, size },
        });
      }
      // Update preset for future text layers
      setPresetFont((prev) => ({ ...prev, size }));
    },
    [selectedTextLayer, handleTextUpdate],
  );

  // Handle color change
  const handleColorChange = useCallback(
    (color: string) => {
      if (selectedTextLayer) {
        handleTextUpdate(selectedTextLayer.id, { fill: color });
      }
      // Update preset for future text layers
      setPresetFont((prev) => ({ ...prev, color }));
    },
    [selectedTextLayer, handleTextUpdate],
  );

  // Handle adding text with preset attributes
  const handleAddText = useCallback(() => {
    dispatch(
      addTextLayer({
        font: {
          family: presetFont.family,
          size: presetFont.size,
          weight: presetFont.weight,
        },
        fill: presetFont.color,
        align: presetFont.align,
        x: 100,
        y: 100,
      }),
    );
  }, [dispatch, presetFont]);

  return (
    <div className='sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-neutral-200 px-6 py-3'>
      <div className='flex items-center justify-between'>
        {/* Left Section: Text Editing Controls */}
        <div className='flex items-center gap-4'>
          {/* Font Family */}
          <FontFamilySelector
            selectedId={selectedId}
            currentFamily={selectedTextLayer?.font?.family || presetFont.family}
            onFamilyChange={handleFontFamilyChange}
          />

          {/* Font Size */}
          <FontSizeSelector
            selectedId={selectedId}
            currentSize={selectedTextLayer?.font?.size || presetFont.size}
            onSizeChange={handleFontSizeChange}
          />

          {/* Color Picker */}
          <input
            type='color'
            className='w-8 h-8 border border-neutral-200 rounded cursor-pointer'
            value={selectedTextLayer?.fill || presetFont.color}
            onChange={(e) => handleColorChange(e.target.value)}
            title='Text Color'
          />

          {/* Text Alignment */}
          <div className='flex border border-neutral-200 rounded overflow-hidden'>
            <ToolbarButton
              icon={AlignLeft}
              tooltip='Align Left'
              active={textAlign === 'left'}
              onClick={() => handleTextAlignChange('left')}
              compact
              square
            />
            <ToolbarButton
              icon={AlignCenter}
              tooltip='Align Center'
              active={textAlign === 'center'}
              onClick={() => handleTextAlignChange('center')}
              compact
              square
            />
            <ToolbarButton
              icon={AlignRight}
              tooltip='Align Right'
              active={textAlign === 'right'}
              onClick={() => handleTextAlignChange('right')}
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
            onClick={handleAddText}
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
