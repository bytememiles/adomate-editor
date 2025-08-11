import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { Background, TextLayer, Doc, HistoryState } from '@/types';

// Constants
const HISTORY_LIMIT = 50;

// Default font configuration
const DEFAULT_FONT = {
  family: 'Arial',
  weight: 400,
  size: 16,
};

// Initial state
const initialState: HistoryState = {
  past: [],
  present: {
    background: null,
    layers: [],
    selectedIds: [],
  },
  future: [],
};

// Helper function to create a new text layer
const createTextLayer = (partial?: Partial<Omit<TextLayer, 'id'>>): TextLayer => ({
  id: nanoid(),
  content: 'New Text',
  x: 100,
  y: 100,
  rotation: 0,
  align: 'left',
  opacity: 1,
  fill: '#000000',
  font: DEFAULT_FONT,
  ...partial,
});

// Helper function to reorder layers
const reorderLayers = (
  layers: TextLayer[],
  id: string,
  direction: 'up' | 'down' | 'top' | 'bottom',
): TextLayer[] => {
  const newLayers = [...layers];
  const currentIndex = newLayers.findIndex((layer) => layer.id === id);

  if (currentIndex === -1) return layers;

  switch (direction) {
    case 'up':
      if (currentIndex > 0) {
        const temp = newLayers[currentIndex]!;
        newLayers[currentIndex] = newLayers[currentIndex - 1]!;
        newLayers[currentIndex - 1] = temp;
      }
      break;
    case 'down':
      if (currentIndex < newLayers.length - 1) {
        const temp = newLayers[currentIndex]!;
        newLayers[currentIndex] = newLayers[currentIndex + 1]!;
        newLayers[currentIndex + 1] = temp;
      }
      break;
    case 'top':
      if (currentIndex > 0) {
        const layer = newLayers.splice(currentIndex, 1)[0]!;
        newLayers.unshift(layer);
      }
      break;
    case 'bottom':
      if (currentIndex < newLayers.length - 1) {
        const layer = newLayers.splice(currentIndex, 1)[0]!;
        newLayers.push(layer);
      }
      break;
  }

  return newLayers;
};

// Helper function to commit a snapshot to history
const commitToHistory = (state: HistoryState): HistoryState => {
  const { past, present, future } = state;
  const newPast = [...past, present].slice(-HISTORY_LIMIT);

  return {
    past: newPast,
    present,
    future: [], // Clear future when committing
  };
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
      setBackground: (state, action: PayloadAction<Background>) => {
    const newBackground = action.payload;
    
    // If replacing background, preserve existing display dimensions if set
    if (state.present.background && state.present.background.displayWidth && state.present.background.displayHeight) {
      newBackground.displayWidth = state.present.background.displayWidth;
      newBackground.displayHeight = state.present.background.displayHeight;
    }
    
    state.present.background = newBackground;
  },

    addTextLayer: (state, action: PayloadAction<Partial<Omit<TextLayer, 'id'>> | undefined>) => {
      const newLayer = createTextLayer(action.payload);
      state.present.layers.push(newLayer);
      state.present.selectedIds = [newLayer.id]; // Select the new layer
    },

    updateLayer: (
      state,
      action: PayloadAction<{ id: string; patch: Partial<Omit<TextLayer, 'id'>> }>,
    ) => {
      const { id, patch } = action.payload;
      const layerIndex = state.present.layers.findIndex((layer) => layer.id === id);

      if (layerIndex !== -1) {
        state.present.layers[layerIndex] = {
          ...state.present.layers[layerIndex]!,
          ...patch,
        };
      }
    },

    reorderLayer: (
      state,
      action: PayloadAction<{ id: string; direction: 'up' | 'down' | 'top' | 'bottom' }>,
    ) => {
      const { id, direction } = action.payload;
      state.present.layers = reorderLayers(state.present.layers, id, direction);
    },

    deleteLayer: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.present.layers = state.present.layers.filter((layer) => layer.id !== id);
      state.present.selectedIds = state.present.selectedIds.filter(
        (selectedId) => selectedId !== id,
      );
    },

    selectLayers: (state, action: PayloadAction<string[]>) => {
      state.present.selectedIds = action.payload;
    },

    commitSnapshot: (state) => {
      const { past, present, future } = commitToHistory(state);
      state.past = past;
      state.future = future;
    },

    undo: (state) => {
      const { past, present, future } = state;

      if (past.length > 0) {
        const previous = past[past.length - 1]!;
        const newPast = past.slice(0, -1);

        state.past = newPast;
        state.future = [present, ...future];
        state.present = previous;
      }
    },

    redo: (state) => {
      const { past, present, future } = state;

      if (future.length > 0) {
        const next = future[0]!;
        const newFuture = future.slice(1);

        state.past = [...past, present];
        state.future = newFuture;
        state.present = next;
      }
    },

    restoreSnapshot: (state, action: PayloadAction<Doc>) => {
      const { past, present } = state;

      state.past = [...past, present];
      state.present = action.payload;
      state.future = [];
    },
  },
});

export const {
  setBackground,
  addTextLayer,
  updateLayer,
  reorderLayer,
  deleteLayer,
  selectLayers,
  commitSnapshot,
  undo,
  redo,
  restoreSnapshot,
} = editorSlice.actions;

export default editorSlice.reducer;
