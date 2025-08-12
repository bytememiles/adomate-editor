import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

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
