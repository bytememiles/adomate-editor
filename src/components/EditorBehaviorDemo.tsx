'use client';

import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Text } from 'react-konva';
import {
  EDITOR_BEHAVIOR,
  createKeyboardManager,
  createSmartHistoryManager,
  calculateSnapping,
  createGuideLines,
  getStageCenter,
} from '@/lib/editor';

export default function EditorBehaviorDemo() {
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const keyboardManager = useRef(createKeyboardManager());
  const historyManager = useRef(createSmartHistoryManager());

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [elements, setElements] = useState([
    { id: '1', x: 100, y: 100, width: 100, height: 50, fill: '#ff6b6b' },
    { id: '2', x: 300, y: 200, width: 80, height: 80, fill: '#4ecdc4' },
  ]);
  const [guides, setGuides] = useState<any[]>([]);
  const [isStageFocused, setIsStageFocused] = useState(false);

  // Handle element selection
  const handleElementClick = (id: string) => {
    setSelectedId(id);
    historyManager.current.addAction('elementSelect');
  };

  // Handle element dragging
  const handleDragStart = (id: string) => {
    historyManager.current.addAction('dragStart');
  };

  const handleDragMove = (id: string, e: any) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;

    const stage = stageRef.current;
    const stageSize = { width: stage.width(), height: stage.height() };
    const stageCenter = getStageCenter(stageSize);

    // Calculate element center
    const elementCenter = {
      x: e.target.x() + element.width / 2,
      y: e.target.y() + element.height / 2,
    };

    // Calculate snapping
    const snapResult = calculateSnapping(elementCenter, stageCenter, element);

    // Update element position with snapping
    const newElements = elements.map((el) =>
      el.id === id
        ? {
            ...el,
            x: snapResult.position.x - element.width / 2,
            y: snapResult.position.y - element.height / 2,
          }
        : el,
    );
    setElements(newElements);

    // Update guides
    const newGuides = createGuideLines(snapResult.guides, stageSize);
    setGuides(newGuides);

    historyManager.current.addAction('dragMove');
  };

  const handleDragEnd = (id: string) => {
    setGuides([]);
    historyManager.current.addAction('dragEnd');
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedId) return;

    const result = keyboardManager.current.handleKeyDown(
      {
        key: e.key,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        preventDefault: () => e.preventDefault(),
      },
      (deltaX, deltaY) => {
        // Handle nudge
        const newElements = elements.map((el) =>
          el.id === selectedId ? { ...el, x: el.x + deltaX, y: el.y + deltaY } : el,
        );
        setElements(newElements);
        historyManager.current.addAction('keyboardNudge');
      },
      () => {
        // Handle undo
        console.log('Undo triggered');
        historyManager.current.addAction('undo');
      },
      () => {
        // Handle redo
        console.log('Redo triggered');
        historyManager.current.addAction('redo');
      },
    );

    if (result.preventDefault) {
      e.preventDefault();
    }
  };

  // Handle stage focus
  const handleStageFocus = () => {
    setIsStageFocused(true);
    keyboardManager.current.setFocusState(true);
  };

  const handleStageBlur = () => {
    setIsStageFocused(false);
    keyboardManager.current.setFocusState(false);
  };

  // Add new element
  const addElement = () => {
    const newElement = {
      id: Date.now().toString(),
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 80,
      height: 60,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
    };
    setElements([...elements, newElement]);
    historyManager.current.addAction('addElement');
  };

  // Get history stats
  const getHistoryStats = () => {
    return historyManager.current.getStats();
  };

  const stats = getHistoryStats();

  return (
    <div className='bg-white rounded-lg shadow-sm border border-grey-300 p-4 mb-6'>
      <h3 className='text-lg font-medium text-text-primary mb-4'>Editor Behavior Demo</h3>

      {/* Controls */}
      <div className='flex gap-3 mb-4'>
        <button
          onClick={addElement}
          className='bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Add Element
        </button>

        <div className='flex items-center gap-2 px-3 py-2 bg-grey-100 rounded-lg'>
          <span className='text-sm text-text-secondary'>Stage Focus:</span>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              isStageFocused ? 'bg-success-light text-success-main' : 'bg-grey-200 text-grey-600'
            }`}
          >
            {isStageFocused ? 'Focused' : 'Not Focused'}
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className='border border-grey-300 rounded-lg overflow-hidden'>
        <Stage
          ref={stageRef}
          width={600}
          height={400}
          tabIndex={EDITOR_BEHAVIOR.focus.stageWrapper.tabIndex}
          style={{ outline: EDITOR_BEHAVIOR.focus.stageWrapper.outline }}
          onKeyDown={handleKeyDown}
          onFocus={handleStageFocus}
          onBlur={handleStageBlur}
        >
          <Layer>
            {/* Background grid */}
            <Rect
              x={0}
              y={0}
              width={600}
              height={400}
              fill='#f8fafc'
              stroke='#e2e8f0'
              strokeWidth={1}
            />

            {/* Stage center indicator */}
            <Rect
              x={298}
              y={198}
              width={4}
              height={4}
              fill='#3b82f6'
              stroke='#1e40af'
              strokeWidth={1}
            />

            {/* Elements */}
            {elements.map((element) => (
              <Rect
                key={element.id}
                x={element.x}
                y={element.y}
                width={element.width}
                height={element.height}
                fill={element.fill}
                stroke={selectedId === element.id ? '#3b82f6' : '#64748b'}
                strokeWidth={selectedId === element.id ? 2 : 1}
                draggable
                onClick={() => handleElementClick(element.id)}
                onTap={() => handleElementClick(element.id)}
                onDragStart={() => handleDragStart(element.id)}
                onDragMove={(e) => handleDragMove(element.id, e)}
                onDragEnd={() => handleDragEnd(element.id)}
              />
            ))}

            {/* Transformer */}
            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // Limit resize
                  return newBox.width < 5 || newBox.height < 5 ? oldBox : newBox;
                }}
                anchorSize={EDITOR_BEHAVIOR.transformer.anchors.size}
                anchorFill={EDITOR_BEHAVIOR.transformer.anchors.fill}
                anchorStroke={EDITOR_BEHAVIOR.transformer.anchors.stroke}
                anchorStrokeWidth={EDITOR_BEHAVIOR.transformer.anchors.strokeWidth}
                borderStroke={EDITOR_BEHAVIOR.transformer.border.color}
                borderStrokeWidth={EDITOR_BEHAVIOR.transformer.border.width}
              />
            )}

            {/* Guide lines */}
            {guides.map((guide, index) => (
              <Rect key={index} {...guide} fill='transparent' />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Instructions */}
      <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
        <h4 className='font-medium text-blue-800 mb-2'>How to Use:</h4>
        <ul className='text-sm text-blue-700 space-y-1'>
          <li>
            • <strong>Click</strong> elements to select them
          </li>
          <li>
            • <strong>Drag</strong> elements to move them (snaps to center within 6px)
          </li>
          <li>
            • <strong>Click canvas</strong> to focus, then use <strong>Arrow keys</strong> to nudge
            (1px)
          </li>
          <li>
            • <strong>Shift + Arrow</strong> for 10px nudge
          </li>
          <li>
            • <strong>Cmd/Ctrl + Z</strong> for undo, <strong>Cmd/Ctrl + Shift + Z</strong> for redo
          </li>
        </ul>
      </div>

      {/* History Stats */}
      <div className='mt-4 p-3 bg-grey-50 border border-grey-200 rounded-lg'>
        <h4 className='font-medium text-grey-800 mb-2'>History Management:</h4>
        <div className='grid grid-cols-2 gap-4 text-sm text-grey-700'>
          <div>
            <p>
              <strong>Total Actions:</strong> {stats.totalActions}
            </p>
            <p>
              <strong>Snapshot Actions:</strong> {stats.snapshotActions}
            </p>
          </div>
          <div>
            <p>
              <strong>No Snapshot:</strong> {stats.noSnapshotActions}
            </p>
            <p>
              <strong>Last Snapshot:</strong> {Math.round(stats.lastSnapshotAge / 1000)}s ago
            </p>
          </div>
        </div>
        <p className='text-xs text-grey-600 mt-2'>
          💡 History snapshots are only created on dragEnd, transformEnd, and input blur/apply
        </p>
      </div>
    </div>
  );
}
