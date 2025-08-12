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

// Export selected layer actions
export {
  setSelectedLayer,
  clearSelectedLayer,
  updateSelectedLayerProperties,
  updateSelectedLayerPosition,
  updateSelectedLayerTransform,
  setEditMode,
  initializeLayerProperties,
} from './slices/selectedLayerSlice';

// Export preset actions
export {
  updateTextPreset,
  updateTextFontPreset,
  updateImagePreset,
  resetTextPreset,
  resetImagePreset,
  resetAllPresets,
} from './slices/presetSlice';

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
  selectSelectedLayer,
  selectSelectedLayerId,
  selectSelectedLayerType,
  selectSelectedLayerProperties,
  selectSelectedLayerPosition,
  selectSelectedLayerTransform,
  selectIsEditing,
  selectSelectedTextLayer,
  selectSelectedTextFont,
  selectPreset,
  selectTextPreset,
  selectImagePreset,
  selectTextFontPreset,
} from './selectors';

// Export hooks
export { useAppDispatch, useAppSelector } from './hooks';

// Export types
export type { Background, TextLayer, Doc, HistoryState, Font, EditorAction } from '@/types';
