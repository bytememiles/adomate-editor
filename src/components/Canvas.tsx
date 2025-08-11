import React from 'react';
import { Circle, Layer as KonvaLayer, Rect, Stage, Text } from 'react-konva';

import { createNewElement } from '@/utils/helpers';

import type { CanvasElement, EditorState, Layer } from '@/types';
import type { KonvaEventObject } from 'konva/lib/Node';

interface CanvasProps {
  state: EditorState;
  onStateChange: (state: EditorState) => void;
}

const Canvas: React.FC<CanvasProps> = ({ state, onStateChange }) => {
  const handleCanvasClick = (e: KonvaEventObject<MouseEvent>): void => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;

    if (state.selectedTool === 'rectangle') {
      const newElement = createNewElement('rectangle', pos.x, pos.y);
      const newState = {
        ...state,
        layers: state.layers.map((layer: Layer, index: number) => {
          if (index === 0) {
            return {
              ...layer,
              elements: [...layer.elements, newElement],
            };
          }
          return layer;
        }),
      };
      onStateChange(newState);
    }
  };

  const renderElement = (element: CanvasElement): React.ReactNode => {
    switch (element.type) {
      case 'rectangle':
        return (
          <Rect
            key={element.id}
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            fill='#64748b'
            stroke='#334155'
            strokeWidth={2}
          />
        );
      case 'circle':
        return (
          <Circle
            key={element.id}
            x={element.x}
            y={element.y}
            radius={element.width / 2}
            fill='#38bdf8'
            stroke='#0284c7'
            strokeWidth={2}
          />
        );
      case 'text':
        return (
          <Text
            key={element.id}
            x={element.x}
            y={element.y}
            text='Text'
            fontSize={16}
            fill='#334155'
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stage
      width={state.canvas.width}
      height={state.canvas.height}
      onClick={handleCanvasClick}
      style={{ border: '1px solid #cbd5e1', borderRadius: '8px' }}
    >
      {state.layers.map((layer: Layer) => (
        <KonvaLayer key={layer.id} visible={layer.visible}>
          {layer.elements.map(renderElement)}
        </KonvaLayer>
      ))}
    </Stage>
  );
};

export default Canvas;
