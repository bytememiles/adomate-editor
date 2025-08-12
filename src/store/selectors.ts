import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { TextLayerProperties } from './slices/selectedLayerSlice';

// Base selectors
const selectEditorState = (state: RootState) => state.editor;

// Main selectors
export const selectDoc = createSelector([selectEditorState], (editorState) => editorState.present);

export const selectCanUndo = createSelector(
  [selectEditorState],
  (editorState) => editorState.past.length > 0,
);

export const selectCanRedo = createSelector(
  [selectEditorState],
  (editorState) => editorState.future.length > 0,
);

// Additional useful selectors
export const selectBackground = createSelector([selectDoc], (doc) => doc.background);

export const selectLayers = createSelector([selectDoc], (doc) => doc.layers);

export const selectSelectedIds = createSelector([selectDoc], (doc) => doc.selectedIds);

export const selectSelectedLayers = createSelector(
  [selectLayers, selectSelectedIds],
  (layers, selectedIds) => layers.filter((layer) => selectedIds.includes(layer.id)),
);

export const selectHistoryCount = createSelector([selectEditorState], (editorState) => ({
  past: editorState.past.length,
  future: editorState.future.length,
}));

// Canvas selectors
export const selectCanvas = createSelector([selectDoc], (doc) => doc.canvas);

export const selectCanvasZoom = createSelector([selectCanvas], (canvas) => canvas.zoom);

export const selectCanvasPan = createSelector([selectCanvas], (canvas) => ({
  x: canvas.panX,
  y: canvas.panY,
}));

export const selectCanvasRotation = createSelector([selectCanvas], (canvas) => canvas.rotation);

// Selected Layer Selectors
export const selectSelectedLayer = (state: RootState) => state.selectedLayer;
export const selectSelectedLayerId = (state: RootState) => state.selectedLayer.id;
export const selectSelectedLayerType = (state: RootState) => state.selectedLayer.type;
export const selectSelectedLayerProperties = (state: RootState) => state.selectedLayer.properties;
export const selectSelectedLayerPosition = (state: RootState) => state.selectedLayer.position;
export const selectSelectedLayerTransform = (state: RootState) => state.selectedLayer.transform;
export const selectIsEditing = (state: RootState) => state.selectedLayer.isEditing;

// Text-specific selectors
export const selectSelectedTextLayer = (state: RootState) => {
  const selected = state.selectedLayer;
  if (selected.type === 'text' && selected.properties) {
    return selected.properties as TextLayerProperties;
  }
  return null;
};

export const selectSelectedTextFont = (state: RootState) => {
  const textLayer = selectSelectedTextLayer(state);
  return textLayer?.font || null;
};

// Preset Selectors
export const selectPreset = (state: RootState) => state.preset;
export const selectTextPreset = (state: RootState) => state.preset.text;
export const selectImagePreset = (state: RootState) => state.preset.image;
export const selectTextFontPreset = (state: RootState) => state.preset.text.font;
