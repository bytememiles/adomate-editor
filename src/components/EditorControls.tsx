'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import {
  addTextLayer,
  resetEditor,
  selectCanUndo,
  selectCanRedo,
  selectHistoryCount,
} from '@/store';

export default function EditorControls() {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const historyState = useAppSelector(selectHistoryCount);
  const historyCount = historyState.past;

  const handleAddText = () => {
    dispatch(addTextLayer());
  };

  const handleReset = () => {
    dispatch(resetEditor());
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-grey-300 p-4 mb-6'>
      <h3 className='text-lg font-medium text-text-primary mb-4'>Editor Controls</h3>

      <div className='flex gap-3 mb-4'>
        <button
          onClick={handleAddText}
          className='bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Add Text Layer
        </button>

        <button
          onClick={handleReset}
          className='bg-error-main hover:bg-error-dark text-white px-4 py-2 rounded-lg font-medium transition-colors'
        >
          Reset Editor
        </button>
      </div>

      <div className='text-sm text-text-secondary'>
        <p>History: {historyCount} snapshots</p>
        <p>Can Undo: {canUndo ? 'Yes' : 'No'}</p>
        <p>Can Redo: {canRedo ? 'Yes' : 'No'}</p>
        <p className='text-xs mt-2'>
          💾 Editor state is automatically saved to localStorage every 300ms after changes.
          <br />
          🔄 Refresh the page to see the restore functionality in action!
        </p>
      </div>
    </div>
  );
}
