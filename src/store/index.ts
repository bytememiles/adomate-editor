export { store } from './store';
export type { RootState, AppDispatch } from './store';

// Export actions
export {
  setBackground,
  addTextLayer,
  updateLayer,
  reorderLayer,
  deleteLayer,
  selectLayers as selectLayersAction,
  commitSnapshot,
  undo,
  redo,
  restoreSnapshot,
  resetCanvas,
  setCanvasZoom,
  setCanvasPan,
  setCanvasRotation,
  resetCanvasView,
  resetTextLayers,
  clearAllLayers,
} from './slices/editorSlice';

// Export thunks
export { restoreFromStorage, resetEditor } from './thunks';

// Export selectors
export {
  selectDoc,
  selectCanUndo,
  selectCanRedo,
  selectBackground,
  selectLayers,
  selectSelectedIds,
  selectSelectedLayers,
  selectHistoryCount,
  selectCanvas,
  selectCanvasZoom,
  selectCanvasPan,
  selectCanvasRotation,
} from './selectors';

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Export types
export type { Background, TextLayer, Doc, HistoryState, Font, EditorAction } from '@/types';
