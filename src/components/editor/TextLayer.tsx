'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectLayers, updateLayer, selectLayers as selectLayersAction } from '@/store';
import { type TextLayer as TextLayerType } from '@/types';
import { cn } from '@/utils';

interface TextLayerProps {
  layer: TextLayerType;
  isSelected: boolean;
  onSelect: (id: string, multiSelect?: boolean) => void;
  scale: number;
}

export default function TextLayer({ layer, isSelected, onSelect, scale }: TextLayerProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(layer.content);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle text selection
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(layer.id, e.shiftKey);
    },
    [layer.id, onSelect],
  );

  // Handle double click to edit
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditing(true);
      setEditContent(layer.content);
    },
    [layer.content],
  );

  // Handle text editing
  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContent(e.target.value);
  }, []);

  // Handle text editing completion
  const handleEditComplete = useCallback(() => {
    if (editContent !== layer.content) {
      dispatch(
        updateLayer({
          id: layer.id,
          patch: { content: editContent },
        }),
      );
    }
    setIsEditing(false);
  }, [editContent, layer.content, layer.id, dispatch]);

  // Handle key events during editing
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEditComplete();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditContent(layer.content);
        setIsEditing(false);
      }
    },
    [handleEditComplete, layer.content],
  );

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update edit content when layer content changes
  useEffect(() => {
    setEditContent(layer.content);
  }, [layer.content]);

  const textStyle = {
    fontFamily: layer.font.family,
    fontSize: `${layer.font.size * scale}px`,
    fontWeight: layer.font.weight,
    fontStyle: layer.font.style === 'italic' ? 'italic' : 'normal',
    textDecoration: [layer.underline && 'underline', layer.strikethrough && 'line-through']
      .filter(Boolean)
      .join(' '),
    color: layer.fill,
    opacity: layer.opacity,
    textAlign: layer.align,
    transform: `rotate(${layer.rotation}deg)`,
  };

  return (
    <div
      ref={textRef}
      className={cn(
        'absolute cursor-text select-none',
        isSelected && 'ring-2 ring-blue-500 ring-offset-1',
      )}
      style={{
        left: layer.x * scale,
        top: layer.y * scale,
        minWidth: '20px',
        minHeight: '20px',
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          value={editContent}
          onChange={handleEditChange}
          onBlur={handleEditComplete}
          onKeyDown={handleKeyDown}
          className='bg-transparent border-none outline-none p-0 m-0'
          style={textStyle}
        />
      ) : (
        <div className='whitespace-pre-wrap break-words' style={textStyle}>
          {layer.content}
        </div>
      )}
    </div>
  );
}
